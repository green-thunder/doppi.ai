"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/app/(auth)/actions";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/crm/field";
import { SubmitButton } from "@/components/crm/submit-button";
import { AuthCard, AuthError } from "./auth-card";

export function LoginForm() {
  const { t, tr } = useCrmI18n();
  const [state, action] = useActionState(loginAction, null);

  return (
    <AuthCard
      title={t.auth.welcomeBack}
      subtitle={tr(
        "Do'ppi CRM hisobingizga kiring",
        "Sign in to your Do'ppi CRM account",
      )}
      footer={
        <>
          {t.auth.noAccount}{" "}
          <Link href="/register" className="font-medium text-gold-400 hover:text-gold-300">
            {t.auth.createAccount}
          </Link>
        </>
      }
    >
      <AuthError message={state?.error} />
      <form action={action} className="mt-6 flex flex-col gap-4">
        <Field label={t.auth.email} htmlFor="email" error={state?.fieldErrors?.email}>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.uz"
          />
        </Field>
        <Field label={t.auth.password} htmlFor="password" error={state?.fieldErrors?.password}>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </Field>
        <SubmitButton size="lg" className="mt-2 w-full" pendingText={t.auth.signingIn}>
          {t.auth.signIn}
        </SubmitButton>
      </form>
    </AuthCard>
  );
}
