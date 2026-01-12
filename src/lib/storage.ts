import type { City } from "./types";

const KEY = "weather:favorites:v1";

export function loadFavorites(): City[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as City[];
  } catch {
    return [];
  }
}

export function saveFavorites(items: City[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function cityKey(c: City) {
  return `${c.name}|${c.country ?? ""}|${c.latitude.toFixed(4)}|${c.longitude.toFixed(4)}`;
}

const GEO_KEY = "weather:geoPrompt:v1";
type GeoChoice = "allow" | "deny" | "";

function isGeoChoice(v: string | null): v is GeoChoice {
  return v === "allow" || v === "deny" || v === "";
}

export function getGeoPromptChoice(): GeoChoice {
  if (typeof window === "undefined") return "";
  const v = localStorage.getItem(GEO_KEY);
  return isGeoChoice(v) ? v : "";
}

export function setGeoPromptChoice(v: Exclude<GeoChoice, "">) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GEO_KEY, v);
}
