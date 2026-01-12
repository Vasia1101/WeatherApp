import { NextResponse } from "next/server";

export const runtime = "nodejs";

type NominatimItem = {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
    country_code?: string;
  };
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q) return NextResponse.json([], { status: 200 });

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "8");
  url.searchParams.set("accept-language", "en");

  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 8000);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "WeatherApp/1.0 (contact: you@domain.com)",
        "Accept-Language": "en",
      },
      signal: ac.signal,
      next: { revalidate: 60 * 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "geocode failed", status: res.status }, { status: 502 });
    }

    const data = (await res.json()) as NominatimItem[];

    // мапимо в твій City формат
    const cities = data.map((x) => {
      const name = x.address?.city || x.address?.town || x.address?.village || x.display_name.split(",")[0];
      const country = x.address?.country || (x.address?.country_code ? x.address.country_code.toUpperCase() : undefined);

      return {
        name,
        country,
        latitude: Number(x.lat),
        longitude: Number(x.lon),
      };
    });

    return NextResponse.json(cities);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  } finally {
    clearTimeout(t);
  }
}
