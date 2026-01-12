"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { City } from "@/lib/types";
import { fetchForecast } from "@/lib/api";
import GlassCard from "./GlassCard";
import { formatHour } from "@/lib/utils";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function HourlyChart({ city, unit }: { city: City; unit: "c" | "f" }) {
  const q = useQuery({
    queryKey: ["forecast", city.latitude, city.longitude, unit],
    queryFn: () => fetchForecast(city.latitude, city.longitude, unit),
  });

  const data = useMemo(() => {
    const h = q.data?.hourly;
    if (!h?.time?.length) return [];
    // беремо найближчі 24 години
    const items = [];
    for (let i = 0; i < Math.min(24, h.time.length); i++) {
      items.push({
        t: h.time[i],
        label: formatHour(h.time[i]),
        temp: h.temperature_2m[i],
      });
    }
    return items;
  }, [q.data]);

  const unitLabel = unit === "c" ? "°C" : "°F";

  return (
    <GlassCard title="По годинах (24h)">
      {q.isLoading ? (
        <div className="h-48 animate-pulse rounded-2xl bg-white/10" />
      ) : q.isError || data.length === 0 ? (
        <div className="text-sm text-slate-300/80">Немає даних по годинах.</div>
      ) : (
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="label" tick={{ fill: "rgba(226,232,240,0.75)", fontSize: 12 }} interval={3} />
              <YAxis
                tick={{ fill: "rgba(226,232,240,0.75)", fontSize: 12 }}
                width={35}
                domain={["dataMin - 2", "dataMax + 2"]}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(15,23,42,0.95)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 16,
                }}
                labelStyle={{ color: "rgba(226,232,240,0.9)" }}
                formatter={(v) => [`${Math.round(Number(v))}${unitLabel}`, "Температура"]}
                labelFormatter={(l) => `Час: ${l}`}
              />
              <Line type="monotone" dataKey="temp" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
}
