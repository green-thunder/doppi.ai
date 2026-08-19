import type { Lang } from "@/lib/content";

export type { Lang };

export const LANGS = ["uz", "en"] as const;

/**
 * The URL of the current page in the other language. Uzbek is served from the
 * root ("/", "/privacy"), English from the /en prefix ("/en", "/en/privacy"),
 * so switching is a pure path transform — no state, no storage.
 */
export function altPath(pathname: string, to: Lang): string {
  const base = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  if (to === "uz") return base;
  return base === "/" ? "/en" : `/en${base}`;
}
