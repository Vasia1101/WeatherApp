import type { City } from "./types";

export async function reverseCity(lat: number, lon: number) {
  const res = await fetch(`/api/reverse?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error("Reverse geocoding failed");
  return (await res.json()) as City;
}

export async function fetchForecast(lat: number, lon: number, unit: "c" | "f") {
  const res = await fetch(`/api/forecast?lat=${lat}&lon=${lon}&unit=${unit}`);
  if (!res.ok) throw new Error("Forecast failed");
  return res.json();
}
