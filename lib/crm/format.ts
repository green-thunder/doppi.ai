import { format, formatDistanceToNow, isValid } from "date-fns";
import { enUS, uz } from "date-fns/locale";
import type { Locale } from "./i18n";

const dfLocale = (locale: Locale) => (locale === "en" ? enUS : uz);

function toDate(value: Date | string | number | null | undefined): Date | null {
  if (value == null) return null;
  const d = value instanceof Date ? value : new Date(value);
  return isValid(d) ? d : null;
}

/** Full money string, e.g. "12 000 000 UZS". No fraction digits for UZS. */
export function formatMoney(
  amount: number | null | undefined,
  currency = "UZS",
  locale: Locale = "uz",
): string {
  const n = typeof amount === "number" && isFinite(amount) ? amount : 0;
  const grouped = new Intl.NumberFormat(locale === "en" ? "en-US" : "ru-RU", {
    maximumFractionDigits: 0,
  }).format(n);
  return `${grouped} ${currency}`;
}

/** Compact money for tight spaces, e.g. "12 mln UZS" / "12M UZS". */
export function formatMoneyCompact(
  amount: number | null | undefined,
  currency = "UZS",
  locale: Locale = "uz",
): string {
  const n = typeof amount === "number" && isFinite(amount) ? amount : 0;
  const abs = Math.abs(n);
  const units =
    locale === "en"
      ? [
          { v: 1e9, s: "B" },
          { v: 1e6, s: "M" },
          { v: 1e3, s: "K" },
        ]
      : [
          { v: 1e9, s: " mlrd" },
          { v: 1e6, s: " mln" },
          { v: 1e3, s: " ming" },
        ];
  for (const u of units) {
    if (abs >= u.v) {
      const val = n / u.v;
      const str = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1);
      return `${str}${u.s} ${currency}`;
    }
  }
  return `${n} ${currency}`;
}

export function formatNumber(n: number, locale: Locale = "uz"): string {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "ru-RU").format(n);
}

export function formatDate(
  value: Date | string | number | null | undefined,
  locale: Locale = "uz",
): string {
  const d = toDate(value);
  if (!d) return "—";
  return format(d, "d MMM yyyy", { locale: dfLocale(locale) });
}

export function formatDateTime(
  value: Date | string | number | null | undefined,
  locale: Locale = "uz",
): string {
  const d = toDate(value);
  if (!d) return "—";
  return format(d, "d MMM yyyy, HH:mm", { locale: dfLocale(locale) });
}

export function fromNow(
  value: Date | string | number | null | undefined,
  locale: Locale = "uz",
): string {
  const d = toDate(value);
  if (!d) return "—";
  return formatDistanceToNow(d, { addSuffix: true, locale: dfLocale(locale) });
}

/** Initials for avatar fallbacks, e.g. "Nodir Kamolov" -> "NK". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function fullName(firstName: string, lastName?: string | null): string {
  return [firstName, lastName].filter(Boolean).join(" ").trim();
}
