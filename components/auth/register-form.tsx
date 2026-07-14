"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/app/(auth)/actions";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/crm/field";
import { SubmitButton } from "@/components/crm/submit-button";
import { AuthCard, AuthError } from "./auth-card";

export function RegisterForm() {
  const { t, tr, locale } = useCrmI18n();
  const [state, action] = useActionState(registerAction, null);

  return (
    <AuthCard
      title={t.auth.getStarted}
      subtitle={tr(
        "Bepul akkaunt yarating va CRM'ni boshlang",
        "Create a free account and start your CRM",
      )}
      footer={
        <>
          {t.auth.haveAccount}{" "}
          <Link href="/login" className="font-medium text-gold-400 hover:text-gold-300">
            {t.auth.signIn}
          </Link>
        </>
      }
    >
      <AuthError message={state?.error} />
      <form action={action} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="locale" value={locale} />
        <Field label={t.auth.fullName} htmlFor="name" error={state?.fieldErrors?.name} required>
          <Input id="name" name="name" required autoComplete="name" placeholder="Nodir Kamolov" />
        </Field>
        <Field
          label={t.auth.companyName}
          htmlFor="companyName"
          error={state?.fieldErrors?.companyName}
          required
        >
          <Input
            id="companyName"
            name="companyName"
            required
            autoComplete="organization"
            placeholder="Acme LLC"
          />
        </Field>
        <Field label={t.auth.email} htmlFor="email" error={state?.fieldErrors?.email} required>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.uz"
          />
        </Field>
        <Field
          label={t.auth.password}
          htmlFor="password"
          error={state?.fieldErrors?.password}
          required
          hint={tr("Kamida 8 ta belgi", "At least 8 characters")}
        >
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
          />
        </Field>
        <SubmitButton size="lg" className="mt-2 w-full" pendingText={t.auth.creating}>
          {t.auth.createAccount}
        </SubmitButton>
      </form>
    </AuthCard>
  );
}
