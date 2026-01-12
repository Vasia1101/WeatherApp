import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const unit = searchParams.get("unit") === "f" ? "fahrenheit" : "celsius";

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat/lon required" }, { status: 400 });
  }

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);

  url.searchParams.set("current", "temperature_2m,apparent_temperature,wind_speed_10m,weather_code");
  url.searchParams.set("hourly", "temperature_2m,weather_code");
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,weather_code");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("temperature_unit", unit);

  const res = await fetch(url.toString(), {
    next: { revalidate: 10 * 60 }, // 10 min
  });

  if (!res.ok) {
    return NextResponse.json({ error: "forecast fetch failed" }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, max-age=300" },
  });
}
