"use client";

import { useState } from "react";
import { reverseCity } from "@/lib/api";
import type { City } from "@/lib/types";

export default function GeoButton({ onPick }: { onPick: (c: City) => void }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onClick() {
    setErr(null);

    if (!("geolocation" in navigator)) {
      setErr("Геолокація не підтримується в цьому браузері.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          const city = await reverseCity(lat, lon);
          onPick(city);
        } catch {
          setErr("Не вдалося визначити місто за координатами.");
        } finally {
          setLoading(false);
        }
      },
      (e) => {
        setLoading(false);
        if (e.code === 1) setErr("Доступ до геолокації заборонено. Дозволь у браузері.");
        else if (e.code === 2) setErr("Неможливо визначити локацію (слабкий сигнал).");
        else if (e.code === 3) setErr("Таймаут геолокації. Спробуй ще раз.");
        else setErr("Помилка геолокації.");
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60_000,
      }
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={onClick}
        disabled={loading}
        className={`rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition ${
          loading ? "opacity-60 cursor-not-allowed" : ""
        }`}
        title="Використати поточну локацію"
      >
        {loading ? "📍 Визначаю…" : "📍 Моя локація"}
      </button>

      {err && <div className="text-xs text-rose-300/90">{err}</div>}
    </div>
  );
}
