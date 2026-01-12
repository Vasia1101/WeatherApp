"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

type CityResult = {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
};

function useDebouncedValue<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function CitySearch({
  value,
  onChange,
  onPick,
}: {
  value: string;
  onChange: (v: string) => void;
  onPick: (city: { name: string; country?: string; latitude: number; longitude: number }) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const debounced = useDebouncedValue(value, 300);
  const queryEnabled = isOpen && debounced.trim().length >= 2;

  const { data, isFetching } = useQuery({
    queryKey: ["geocode", debounced],
    enabled: queryEnabled,
    queryFn: async () => {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(debounced)}`);
      return (await res.json()) as { results: CityResult[] };
    },
  });

  const results = useMemo(() => data?.results ?? [], [data]);

  function pick(c: CityResult) {
    onPick({
      name: c.name,
      country: c.country,
      latitude: c.latitude,
      longitude: c.longitude,
    });
    onChange(`${c.name}${c.country ? `, ${c.country}` : ""}`);
    setIsOpen(false);
    // прибираємо фокус — щоб не відкривалось знову одразу
    inputRef.current?.blur();
  }

  // Закриття по кліку поза компонентом
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setIsOpen(false);
            inputRef.current?.blur();
          }
          if (e.key === "Enter" && results.length > 0 && queryEnabled) {
            e.preventDefault();
            pick(results[0]);
          }
        }}
        placeholder="Введи місто (наприклад, Тернопіль, Львів, Vienna)…"
        className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 outline-none placeholder:text-slate-500 focus:border-slate-600"
      />

      {queryEnabled && (
        <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/95 shadow-xl">
          <div className="px-4 py-2 text-xs text-slate-400">
            {isFetching ? "Шукаю…" : results.length ? "Результати" : "Нічого не знайдено"}
          </div>

          {results.slice(0, 8).map((c) => (
            <button
              key={c.id}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-slate-900"
              // onMouseDown щоб blur input не закрив dropdown до кліку
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(c)}
            >
              <div className="font-medium">
                {c.name}
                <span className="text-slate-400">{c.admin1 ? `, ${c.admin1}` : ""}</span>
              </div>
              <div className="text-xs text-slate-500">{c.country ?? ""}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
