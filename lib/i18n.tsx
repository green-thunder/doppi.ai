"use client";

import * as React from "react";
import { content, type Lang, type SiteCopy } from "@/lib/content";

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: SiteCopy;
}

const I18nContext = React.createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "doppi-lang";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("uz");

  // Hydrate from localStorage on mount (default stays UZ for SSR parity).
  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === "uz" || stored === "en") setLangState(stored);
    } catch {
      /* ignore */
    }
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = React.useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = React.useCallback(() => {
    setLang(lang === "uz" ? "en" : "uz");
  }, [lang, setLang]);

  const value = React.useMemo<I18nContextValue>(
    () => ({ lang, setLang, toggle, t: content[lang] }),
    [lang, setLang, toggle],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

/** Convenience hook: returns the copy tree for the active language. */
export function useCopy(): SiteCopy {
  return useI18n().t;
}
