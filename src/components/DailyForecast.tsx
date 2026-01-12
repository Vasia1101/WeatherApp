"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { City } from "@/lib/types";
import { fetchForecast } from "@/lib/api";
import GlassCard from "./GlassCard";
import { formatDay } from "@/lib/utils";
import { weatherFromCode } from "@/lib/weather";

import type { ForecastResponse } from "@/lib/types";

export default function DailyForecast({ city, unit }: { city: City; unit: "c" | "f" }) {
  const q =useQuery<ForecastResponse>({
    queryKey: ["forecast", city.latitude, city.longitude, unit],
    queryFn: () => fetchForecast(city.latitude, city.longitude, unit),
  });

  const days = useMemo(() => {
    const d = q.data?.daily;
    if (!d?.time?.length) return [];
    return d.time.slice(0, 7).map((t, i) => ({
      date: t,
      min: d.temperature_2m_min[i],
      max: d.temperature_2m_max[i],
      code: d.weather_code[i],
    }));
  }, [q.data]);

  const unitLabel = unit === "c" ? "°C" : "°F";

  return (
    <GlassCard title="7-денний прогноз">
      {q.isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/10" />
          ))}
        </div>
      ) : q.isError || days.length === 0 ? (
        <div className="text-sm text-slate-300/80">Немає даних по днях.</div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {days.map((d) => {
            const wx = weatherFromCode(d.code);
            return (
              <div
                key={d.date}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 hover:bg-white/10 transition"
              >
                <div className="text-xs text-slate-300/70">{formatDay(d.date)}</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-2xl">{wx.emoji}</div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {Math.round(d.max)}
                      {unitLabel}
                    </div>
                    <div className="text-xs text-slate-300/70">
                      {Math.round(d.min)}
                      {unitLabel}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-200/80">{wx.label}</div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
