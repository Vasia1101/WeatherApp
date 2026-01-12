type Wx = { label: string; emoji: string; accent: string };

export function weatherFromCode(code: number): Wx {
  // Open-Meteo WMO weather codes
  if (code === 0) return { label: "Ясно", emoji: "☀️", accent: "from-amber-500/20 to-sky-500/10" };
  if ([1, 2].includes(code)) return { label: "Мінлива хмарність", emoji: "🌤️", accent: "from-sky-500/15 to-slate-500/10" };
  if (code === 3) return { label: "Хмарно", emoji: "☁️", accent: "from-slate-500/20 to-slate-800/10" };

  if ([45, 48].includes(code)) return { label: "Туман", emoji: "🌫️", accent: "from-slate-400/15 to-slate-700/10" };

  if ([51, 53, 55, 56, 57].includes(code)) return { label: "Мряка", emoji: "🌦️", accent: "from-teal-500/15 to-slate-700/10" };

  if ([61, 63, 65, 66, 67].includes(code)) return { label: "Дощ", emoji: "🌧️", accent: "from-cyan-500/15 to-slate-800/10" };
  if ([80, 81, 82].includes(code)) return { label: "Злива", emoji: "⛈️", accent: "from-blue-500/20 to-slate-900/10" };

  if ([71, 73, 75, 77].includes(code)) return { label: "Сніг", emoji: "🌨️", accent: "from-sky-300/20 to-slate-800/10" };
  if ([85, 86].includes(code)) return { label: "Снігопад", emoji: "❄️", accent: "from-sky-300/25 to-slate-900/10" };

  if ([95, 96, 99].includes(code)) return { label: "Гроза", emoji: "⚡", accent: "from-purple-500/20 to-slate-900/10" };

  return { label: "Погода", emoji: "🌡️", accent: "from-slate-500/10 to-slate-900/10" };
}
