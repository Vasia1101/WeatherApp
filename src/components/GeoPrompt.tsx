"use client";

import { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import type { City } from "@/lib/types";
import { getGeoPromptChoice, setGeoPromptChoice } from "@/lib/storage";
import { getCityFromGeolocation } from "@/lib/geo";

type GeoPositionErrorLike = { code?: number; message?: string };

function isGeoPositionErrorLike(e: unknown): e is GeoPositionErrorLike {
  return typeof e === "object" && e !== null && ("code" in e || "message" in e);
}

export default function GeoPrompt({
  onPick,
  disabled,
}: {
  onPick: (c: City) => void;
  disabled: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (disabled) return;

    const choice = getGeoPromptChoice();
    if (choice === "deny") return;
    if ("geolocation" in navigator) setVisible(true);
  }, [disabled]);

  async function allow() {
    setErr(null);
    setLoading(true);
    try {
      const city = await getCityFromGeolocation();
      setGeoPromptChoice("allow");
      onPick(city);
      setVisible(false);
    } catch (e: unknown) {
      const code = isGeoPositionErrorLike(e) ? e.code : undefined;

      setErr(
        code === 1
          ? "Доступ до геолокації заборонено. Дозволь у браузері."
          : "Не вдалося визначити локацію. Можеш спробувати ще раз або вибрати місто вручну."
      );
    } finally {
      setLoading(false);
    }
  }

  function deny() {
    setGeoPromptChoice("deny");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <GlassCard title="Швидкий старт" className="bg-white/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm text-slate-100/90">
            Показати погоду для <span className="font-medium">моєї локації</span>?
          </div>
          <div className="mt-1 text-xs text-slate-300/70">
            Можеш відмовитись — тоді обереш місто вручну. Ніяких драм 🙂
          </div>
          {err && <div className="mt-2 text-xs text-rose-300/90">{err}</div>}
        </div>

        <div className="flex gap-2">
          <button
            onClick={deny}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Не зараз
          </button>
          <button
            onClick={allow}
            disabled={loading}
            className={`rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/20 ${
              loading ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            {loading ? "📍 Визначаю…" : "📍 Дозволити"}
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
