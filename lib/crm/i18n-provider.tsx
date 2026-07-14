"use client";

import * as React from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  getDict,
  tr,
  type Dict,
  type Locale,
} from "./i18n";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggle: () => void;
  /** Shared dictionary for the active locale. */
  t: Dict;
  /** Inline translator for module-specific strings. */
  tr: (uz: string, en: string) => string;
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLocale = DEFAULT_LOCALE,
  children,
}: {
  initialLocale?: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = React.useState<Locale>(initialLocale);

  React.useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = React.useCallback((l: Locale) => {
    setLocaleState(l);
    // Persist so server components pick it up on the next navigation / refresh.
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  }, []);

  const value = React.useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      toggle: () => setLocale(locale === "uz" ? "en" : "uz"),
      t: getDict(locale),
      tr: (uz: string, en: string) => tr(locale, uz, en),
    }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useCrmI18n(): LocaleContextValue {
  const ctx = React.useContext(LocaleContext);
  if (!ctx) throw new Error("useCrmI18n must be used within a LocaleProvider");
  return ctx;
}

/** Convenience: the shared dictionary for the active locale. */
export function useT(): Dict {
  return useCrmI18n().t;
}
