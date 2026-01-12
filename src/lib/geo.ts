import { reverseCity } from "@/lib/api";
import type { City } from "@/lib/types";

export async function getCityFromGeolocation(): Promise<City> {
  if (!("geolocation" in navigator)) throw new Error("No geolocation");

  const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 60_000,
    });
  });

  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  return reverseCity(lat, lon);
}
