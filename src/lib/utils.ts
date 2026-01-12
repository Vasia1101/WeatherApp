export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function formatDay(dateISO: string, locale = "uk-UA") {
  const d = new Date(dateISO);
  return new Intl.DateTimeFormat(locale, { weekday: "short", day: "2-digit", month: "short" }).format(d);
}

export function formatHour(dateISO: string, locale = "uk-UA") {
  const d = new Date(dateISO);
  return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(d);
}
