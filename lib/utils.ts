/** Small shared helpers. No domain logic lives here. */

export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

const kesFormatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

const kesCompactFormatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  notation: "compact",
  maximumFractionDigits: 1,
});

/** KSh 18,400 */
export function formatKes(amount: number): string {
  return kesFormatter.format(amount).replace("KES", "KSh").trim();
}

/** KSh 18.4K — for tight UI such as mini charts. */
export function formatKesCompact(amount: number): string {
  return kesCompactFormatter.format(amount).replace("KES", "KSh").trim();
}

export function formatNumber(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("en-KE", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/** 5 Sep 2026 */
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(date);
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getTime());
  next.setDate(next.getDate() + days);
  return next;
}

export function addMonths(date: Date, months: number): Date {
  const next = new Date(date.getTime());
  next.setMonth(next.getMonth() + months);
  return next;
}

/** The next occurrence of a day-of-month (used for scheduled payout copy). */
export function nextOccurrenceOfDay(dayOfMonth: number, from: Date = new Date()): Date {
  const candidate = new Date(from.getFullYear(), from.getMonth(), dayOfMonth);
  if (candidate.getTime() <= from.getTime()) {
    return new Date(from.getFullYear(), from.getMonth() + 1, dayOfMonth);
  }
  return candidate;
}

/** "Today", "Yesterday", "12 Sep" — derived from real dates, never hard-coded. */
export function relativeDayLabel(date: Date, today: Date = new Date()): string {
  const startOf = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const diffDays = Math.round((startOf(today) - startOf(date)) / 86_400_000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;
  return formatDate(date, { year: undefined });
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** #1565FF + 0.12 -> rgba(21, 101, 255, 0.12). Used for tinted category chips. */
export function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;
  const value = Number.parseInt(full, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function percentOf(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

/** Reads a CSS custom property, with a safe fallback outside the browser. */
export function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}
