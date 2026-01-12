"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { City } from "@/lib/types";

type Bg = {
  imageUrl: string;
  photoPage: string;
  authorName: string;
  authorPage: string;
  usedQuery?: string;
};

function bgKey(city: City) {
  return `${city.latitude.toFixed(3)}:${city.longitude.toFixed(3)}`;
}

export default function CityBackground({ city }: { city: City | null }) {
  const [bg, setBg] = useState<Bg | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [isNewLoaded, setIsNewLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const key = useMemo(() => (city ? bgKey(city) : ""), [city?.latitude, city?.longitude]);

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!city) {
        setPrevUrl(null);
        setBg(null);
        setIsNewLoaded(false);
        return;
      }

      setLoading(true);
      setIsNewLoaded(false);

      try {
        const qs = new URLSearchParams({
          lat: String(city.latitude),
          lon: String(city.longitude),
          city: city.name, // fallback
          country: city.country ?? "",
        });

        const res = await fetch(`/api/unsplash?${qs.toString()}`);
        if (!res.ok) throw new Error("bg failed");

        const data: Bg = await res.json();

        if (!alive) return;

        setPrevUrl((old) => (data.imageUrl && old !== data.imageUrl ? old : old));
        setBg((old) => {
          if (old?.imageUrl && old.imageUrl !== data.imageUrl) setPrevUrl(old.imageUrl);
          return data;
        });
      } catch {
        if (alive) setBg(null);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [key, city?.name, city?.country]); // key головний, name/country як fallback

  return (
    <div className="fixed inset-0 -z-10">
      {/* base */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900" />

      {/* previous image */}
      {prevUrl && (
        <Image
          src={prevUrl}
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-90"
        />
      )}

      {/* current image (fade in onLoad) */}
      {bg?.imageUrl && (
        <Image
          key={bg.imageUrl}
          src={bg.imageUrl}
          alt={city?.name ?? "City"}
          fill
          sizes="100vw"
          priority
          onLoadingComplete={() => setIsNewLoaded(true)}
          className={`object-cover transition-opacity duration-700 opacity-90 ${
            isNewLoaded ? "opacity-90" : "opacity-0"
          }`}
        />
      )}

      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-slate-950/90" />

      {/* attribution */}
      {bg && (
        <div className="absolute bottom-3 right-3 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-[11px] text-slate-200/80 backdrop-blur">
          Photo by{" "}
          <a className="underline hover:text-slate-100" href={bg.authorPage} target="_blank" rel="noreferrer">
            {bg.authorName}
          </a>{" "}
          on{" "}
          <a className="underline hover:text-slate-100" href={bg.photoPage} target="_blank" rel="noreferrer">
            Unsplash
          </a>
          {loading ? <span className="ml-2 opacity-70">…</span> : null}
        </div>
      )}
    </div>
  );
}
