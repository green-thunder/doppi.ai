"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/crm/db";
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/crm/auth";
import { defaultStages } from "@/lib/crm/constants";
import { LOCALE_COOKIE, type Locale } from "@/lib/crm/i18n";
import { toFieldErrors, type FormState } from "@/lib/crm/forms";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Ism kamida 2 ta belgi / Name too short"),
  email: z.email("Email noto'g'ri / Invalid email"),
  password: z.string().min(8, "Parol kamida 8 ta belgi / Password min 8 chars"),
  companyName: z.string().trim().min(2, "Kompaniya nomini kiriting / Enter company name"),
  locale: z.enum(["uz", "en"]).catch("uz"),
});

const loginSchema = z.object({
  email: z.email("Email noto'g'ri / Invalid email"),
  password: z.string().min(1, "Parolni kiriting / Enter password"),
});

function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base || "org"}-${suffix}`;
}

async function setLocaleCookie(locale: Locale) {
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}

export async function registerAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    companyName: formData.get("companyName"),
    locale: formData.get("locale") ?? "uz",
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  const { name, companyName, password, locale } = parsed.data;
  const email = parsed.data.email.toLowerCase().trim();

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return {
      ok: false,
      fieldErrors: { email: "Bu email band / Email already registered" },
    };
  }

  const passwordHash = await hashPassword(password);

  const org = await db.organization.create({
    data: {
      name: companyName,
      slug: slugify(companyName),
      users: {
        create: {
          name,
          email,
          passwordHash,
          role: "OWNER",
          locale,
          lastLoginAt: new Date(),
        },
      },
      stages: {
        create: defaultStages(locale).map((s, i) => ({ ...s, order: i })),
      },
    },
    include: { users: true },
  });

  await createSession(org.users[0].id);
  await setLocaleCookie(locale);
  redirect("/crm");
}

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await db.user.findUnique({ where: { email } });

  // Same generic error whether the email or password is wrong (no user enumeration).
  const genericError = {
    ok: false as const,
    error: "Email yoki parol noto'g'ri / Wrong email or password",
  };

  if (!user || !user.active) return genericError;

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) return genericError;

  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await createSession(user.id);
  await setLocaleCookie(user.locale === "en" ? "en" : "uz");
  redirect("/crm");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
