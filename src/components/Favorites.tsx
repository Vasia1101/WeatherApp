"use client";

import { useEffect, useMemo, useState } from "react";
import type { City } from "@/lib/types";
import { cityKey, loadFavorites, saveFavorites } from "@/lib/storage";
import GlassCard from "./GlassCard";

export default function Favorites({
  current,
  onPick,
}: {
  current: City | null;
  onPick: (c: City) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<City[]>([]);

  useEffect(() => {
    setMounted(true);
    setItems(loadFavorites());
  }, []);

  const currentKey = useMemo(() => (current ? cityKey(current) : ""), [current]);

  function toggle() {
    if (!current) return;

    const key = cityKey(current);
    const exists = items.some((x) => cityKey(x) === key);

    const next = exists
      ? items.filter((x) => cityKey(x) !== key)
      : [current, ...items].slice(0, 10);

    setItems(next);
    saveFavorites(next);
  }

  const isFav = current ? items.some((x) => cityKey(x) === currentKey) : false;

  return (
    <GlassCard
      title="Обрані міста"
      right={
        <button
          onClick={toggle}
          disabled={!current || !mounted}
          className={`rounded-2xl px-3 py-2 text-xs border border-white/10 ${
            !current || !mounted ? "opacity-40 cursor-not-allowed" : "hover:bg-white/10"
          }`}
          title={current ? "Додати/прибрати з обраних" : "Спочатку обери місто"}
        >
          {isFav ? "★ В обраних" : "☆ Додати"}
        </button>
      }
    >
      {/* Важливо: до mounted рендеримо той самий HTML, що і сервер */}
      {!mounted ? (
        <div className="text-sm text-slate-300/80">Завантажую обрані…</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-slate-300/80">Поки порожньо. Обери місто і натисни ☆</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((c) => (
            <button
              key={cityKey(c)}
              onClick={() => onPick(c)}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
            >
              {c.name}
              {c.country ? <span className="text-slate-300/70">, {c.country}</span> : null}
            </button>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
