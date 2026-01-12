import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat/lon required" }, { status: 400 });
  }

  // Open-Meteo reverse geocoding (через пошук найближчого населеного пункту)
  // У них немає окремого reverse endpoint, але можна використати "name" - ні.
  // Тому беремо інший стабільний сервіс: Nominatim (OSM) через наш backend.
  // (Для продакшну можна винести на свій провайдер/план)
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("zoom", "10");
  url.searchParams.set("accept-language", "uk");

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "weather-app (contact: example@local)", 
    },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "reverse failed" }, { status: 502 });
  }

  const data = await res.json();

  const a = data?.address ?? {};
  const name =
    a.city ||
    a.town ||
    a.village ||
    a.municipality ||
    a.county ||
    data?.name ||
    "Моя локація";

  const country = a.country_code ? String(a.country_code).toUpperCase() : a.country;

  return NextResponse.json(
    {
      name,
      country,
      latitude: Number(lat),
      longitude: Number(lon),
    },
    { headers: { "Cache-Control": "public, max-age=86400" } }
  );
}
