"use client";

import { useState } from "react";
import CitySearch from "@/components/CitySearch";
import GeoButton from "@/components/GeoButton";
import CurrentWeatherCard from "@/components/CurrentWeatherCard";
import HourlyChart from "@/components/HourlyChart";
import DailyForecast from "@/components/DailyForecast";
import Favorites from "@/components/Favorites";
import GeoPrompt from "@/components/GeoPrompt";
import CityBackground from "@/components/CityBackground";

import type { City } from "@/lib/types";

export default function Page() {
  const [city, setCity] = useState<City | null>(null);
  const [unit, setUnit] = useState<"c" | "f">("c");
  const [searchValue, setSearchValue] = useState("");

  function pickCity(c: City) {
    console.log("PICK CITY:", c);
    setCity(c);
    setSearchValue(`${c.name}${c.country ? `, ${c.country}` : ""}`);
  }

  return (
    <>
      <CityBackground city={city} />
      <main className="min-h-screen text-slate-100">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Погода</h1>
              <p className="text-slate-300">Обери місто або візьми “мою локацію” 📍</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                className={`rounded-xl px-3 py-2 text-sm ${unit === "c" ? "bg-slate-700" : "bg-slate-800"}`}
                onClick={() => setUnit("c")}
              >
                °C
              </button>
              <button
                className={`rounded-xl px-3 py-2 text-sm ${unit === "f" ? "bg-slate-700" : "bg-slate-800"}`}
                onClick={() => setUnit("f")}
              >
                °F
              </button>
            </div>
          </header>

          <div className="mt-6 grid gap-6">
            <GeoPrompt onPick={pickCity} disabled={!!city} />

            <section className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
              <CitySearch value={searchValue} onChange={setSearchValue} onPick={pickCity} />
              <GeoButton onPick={pickCity} />
            </section>

            <Favorites current={city} onPick={pickCity} />

            {!city ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-slate-300">
                Вибери місто — і я покажу прогноз.
              </div>
            ) : (
              <>
                <CurrentWeatherCard city={city} unit={unit} />
                <HourlyChart city={city} unit={unit} />
                <DailyForecast city={city} unit={unit} />
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
