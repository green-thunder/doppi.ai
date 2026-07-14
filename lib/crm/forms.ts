import { z } from "zod";

/**
 * Standard return shape for server actions used with `useActionState`.
 * `null` = pristine (never submitted).
 */
export type FormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  message?: string;
} | null;

/** Flatten a ZodError into a { field: message } map (first error per field). */
export function toFieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_";
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

/** Coerce an empty/whitespace form value to `undefined` (for optional fields). */
export function optionalString(v: FormDataEntryValue | null): string | undefined {
  const s = (v ?? "").toString().trim();
  return s.length ? s : undefined;
}

export function requiredString(v: FormDataEntryValue | null): string {
  return (v ?? "").toString().trim();
}

/** Parse a form value into a number, or undefined when blank/invalid. */
export function numberOrUndef(v: FormDataEntryValue | null): number | undefined {
  const s = (v ?? "").toString().trim().replace(/\s/g, "");
  if (!s) return undefined;
  const n = Number(s);
  return isFinite(n) ? n : undefined;
}

/** Parse a date-ish form value into a Date, or undefined when blank/invalid. */
export function dateOrUndef(v: FormDataEntryValue | null): Date | undefined {
  const s = (v ?? "").toString().trim();
  if (!s) return undefined;
  const d = new Date(s);
  return isNaN(d.getTime()) ? undefined : d;
}
