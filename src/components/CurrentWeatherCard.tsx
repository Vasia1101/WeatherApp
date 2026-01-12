"use client";

import { useQuery } from "@tanstack/react-query";
import type { City } from "@/lib/types";
import { fetchForecast } from "@/lib/api";
import GlassCard from "./GlassCard";
import { weatherFromCode } from "@/lib/weather";

export default function CurrentWeatherCard({ city, unit }: { city: City; unit: "c" | "f" }) {
  const q = useQuery({
    queryKey: ["forecast", city.latitude, city.longitude, unit],
    queryFn: () => fetchForecast(city.latitude, city.longitude, unit),
  });

  if (q.isLoading) {
    return <GlassCard title="Зараз"><Skeleton /></GlassCard>;
  }
  if (q.isError || !q.data?.current) {
    return (
      <GlassCard title="Зараз">
        <div className="text-sm text-slate-300/80">
          Не вдалося отримати погоду. Спробуй ще раз (або перевір інтернет — він інколи теж “взятий в обрані”, але не працює 😄).
        </div>
      </GlassCard>
    );
  }

  const c = q.data.current;
  const wx = weatherFromCode(c.weather_code);
  const unitLabel = unit === "c" ? "°C" : "°F";

  return (
    <GlassCard
      title={`${city.name}${city.country ? `, ${city.country}` : ""}`}
      right={<div className="text-xs text-slate-300/70">{q.data.timezone ?? ""}</div>}
      className={`bg-gradient-to-br ${wx.accent}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{wx.emoji}</div>
          <div>
            <div className="text-3xl font-semibold tracking-tight">
              {Math.round(c.temperature_2m)}
              {unitLabel}
            </div>
            <div className="text-sm text-slate-200/80">{wx.label}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric label="Відчувається" value={`${Math.round(c.apparent_temperature)}${unitLabel}`} />
          <Metric label="Вітер" value={`${Math.round(c.wind_speed_10m)} м/с`} />
          <Metric label="Код" value={`${c.weather_code}`} />
        </div>
      </div>
    </GlassCard>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
      <div className="text-xs text-slate-300/70">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-6 w-56 rounded bg-white/10" />
      <div className="h-10 w-40 rounded bg-white/10" />
      <div className="h-20 w-full rounded bg-white/10" />
    </div>
  );
}
