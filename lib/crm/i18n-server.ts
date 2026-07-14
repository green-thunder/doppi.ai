import "server-only";
import { cookies } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  getDict,
  isLocale,
  tr,
  type Locale,
} from "./i18n";

/**
 * Resolve the active locale on the server from the `doppi_locale` cookie.
 * Falls back to the default (uz). Layouts read this and pass it to the client
 * LocaleProvider so server and client agree on first paint.
 */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Server-side translator bound to the request locale. */
export async function getT() {
  const locale = await getLocale();
  return {
    locale,
    dict: getDict(locale),
    tr: (uz: string, en: string) => tr(locale, uz, en),
  };
}
