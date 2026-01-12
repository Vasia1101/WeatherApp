import { NextResponse } from "next/server";

export const runtime = "edge";

type OWReverseItem = {
  name: string;
  country: string; // "UA"
  local_names?: Record<string, string>;
};

type UnsplashPhoto = {
  id: string;
  urls: { raw: string; regular: string; full: string };
  user: { name: string; links: { html: string } };
  links: { html: string };
};

type UnsplashSearchResponse = {
  results: UnsplashPhoto[];
};

async function unsplashSearchOne(query: string, key: string): Promise<UnsplashPhoto | null> {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("orientation", "landscape");
  u.searchParams.set("per_page", "1");
  u.searchParams.set("content_filter", "high");

  const res = await fetch(u.toString(), {
    headers: { Authorization: `Client-ID ${key}`, "Accept-Version": "v1" },
    next: { revalidate: 60 * 60 * 24 }, // 24h
  });

  if (!res.ok) throw new Error(`Unsplash failed ${res.status}`);

  const data = (await res.json()) as UnsplashSearchResponse;
  return data.results?.[0] ?? null;
}

async function getEnglishCityNameByCoords(lat: string, lon: string) {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) throw new Error("OPENWEATHER_API_KEY is missing");

  const url = new URL("https://api.openweathermap.org/geo/1.0/reverse");
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("limit", "1");
  url.searchParams.set("appid", key);

  const res = await fetch(url.toString(), { next: { revalidate: 60 * 60 * 24 } }); // 24h
  if (!res.ok) throw new Error(`OpenWeather reverse failed: ${res.status}`);

  const data = (await res.json()) as OWReverseItem[];
  const item = data?.[0];
  if (!item) return null;

  const en = item.local_names?.en || item.name;
  return { cityEn: en, countryCode: item.country };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const lat = searchParams.get("lat")?.trim() || "";
  const lon = searchParams.get("lon")?.trim() || "";

  // fallback, якщо раптом coords нема
  const city = (searchParams.get("city") || "").trim();
  const country = (searchParams.get("country") || "").trim();

  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!unsplashKey) {
    return NextResponse.json({ error: "UNSPLASH_ACCESS_KEY is missing" }, { status: 500 });
  }

  let cityEn = city;
  let countryToken = country;

  // ✅ Pre-step: якщо є координати — беремо EN назву міста через OpenWeather reverse
  if (lat && lon) {
    try {
      const r = await getEnglishCityNameByCoords(lat, lon);
      if (r) {
        cityEn = r.cityEn;
        countryToken = r.countryCode; // UA/AT/PL...
      }
    } catch {
      // якщо OpenWeather впав — не валимо весь бекграунд
    }
  }

  if (!cityEn) {
    return NextResponse.json({ error: "city is required" }, { status: 400 });
  }

  // ✅ Fallback queries (менше 404)
  const queries = [
    `${cityEn} ${countryToken || ""} city skyline`.trim(),
    `${cityEn} ${countryToken || ""} skyline`.trim(),
    `${cityEn} ${countryToken || ""} city`.trim(),
    `${cityEn} city skyline`.trim(),
    `${cityEn} city`.trim(),
  ];

  let photo: UnsplashPhoto | null = null;
  let usedQuery = "";

  try {
    for (const q of queries) {
      const p = await unsplashSearchOne(q, unsplashKey);
      if (p) {
        photo = p;
        usedQuery = q;
        break;
      }
    }
  } catch (e: unknown) {
    return NextResponse.json(
      { error: "Unsplash failed", message: e instanceof Error ? e.message : "Unknown error" },
      { status: 502 }
    );
  }

  if (!photo) {
    return NextResponse.json({ error: "No photo found", usedQuery: queries[0] }, { status: 404 });
  }

  const bgUrl = `${photo.urls.raw}&w=1920&h=1080&fit=crop&crop=entropy&auto=format&q=80`;

  const utm = "utm_source=weather-app&utm_medium=referral";
  const photoPage = `${photo.links.html}?${utm}`;
  const authorPage = `${photo.user.links.html}?${utm}`;

  return NextResponse.json(
    {
      imageUrl: bgUrl,
      photoPage,
      authorName: photo.user.name,
      authorPage,
      usedQuery,
    },
    { headers: { "Cache-Control": "public, max-age=600" } }
  );
}
