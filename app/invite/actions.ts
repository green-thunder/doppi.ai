"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession } from "@/lib/crm/auth";
import { hashPassword } from "@/lib/crm/password";
import { acceptInvitation } from "@/lib/crm/data/invitations";
import { LOCALE_COOKIE, isLocale } from "@/lib/crm/i18n";
import { requiredString, toFieldErrors, type FormState } from "@/lib/crm/forms";

const acceptSchema = z.object({
  token: z.string().min(1),
  name: z.string().trim().min(2, "Ism kamida 2 ta belgi / Name too short"),
  password: z.string().min(8, "Parol kamida 8 ta belgi / Password min 8 chars"),
});

export async function acceptInvitationAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const localeRaw = requiredString(formData.get("locale"));
  const locale = isLocale(localeRaw) ? localeRaw : "uz";

  const parsed = acceptSchema.safeParse({
    token: requiredString(formData.get("token")),
    name: requiredString(formData.get("name")),
    password: requiredString(formData.get("password")),
  });
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error) };

  const passwordHash = await hashPassword(parsed.data.password);
  const result = await acceptInvitation(parsed.data.token, {
    name: parsed.data.name,
    passwordHash,
    locale,
  });

  if (!result.ok) {
    const messages: Record<string, string> = {
      invalid:
        locale === "en" ? "This invitation is invalid" : "Bu taklif yaroqsiz",
      expired:
        locale === "en" ? "This invitation has expired" : "Taklif muddati tugagan",
      accepted:
        locale === "en" ? "This invitation was already used" : "Taklif allaqachon ishlatilgan",
      email_taken:
        locale === "en" ? "This email is already registered" : "Bu email allaqachon ro'yxatdan o'tgan",
    };
    return { ok: false, error: messages[result.error] };
  }

  await createSession(result.userId);
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  redirect("/crm");
}
