import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", q);
  url.searchParams.set("count", "8");
  url.searchParams.set("language", "uk");
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "weather-app" },
    next: { revalidate: 60 * 60 },
  });

  if (!res.ok) {
    return NextResponse.json({ results: [] }, { status: 200 });
  }

  const data = await res.json();

  return NextResponse.json(
    { results: data?.results ?? [] },
    { headers: { "Cache-Control": "public, max-age=600" } }
  );
}
