"use client";

import { useActionState } from "react";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/crm/field";
import { SubmitButton } from "@/components/crm/submit-button";
import { AuthCard, AuthError } from "@/components/auth/auth-card";
import { acceptInvitationAction } from "../actions";

export function AcceptForm({
  token,
  email,
  name,
  orgName,
}: {
  token: string;
  email: string;
  name: string;
  orgName: string;
}) {
  const { t, tr, locale } = useCrmI18n();
  const [state, action] = useActionState(acceptInvitationAction, null);

  return (
    <AuthCard
      title={tr("Jamoaga qo'shiling", "Join the team")}
      subtitle={tr(
        `Sizni "${orgName}" jamoasiga taklif qilishdi`,
        `You've been invited to "${orgName}"`,
      )}
    >
      <AuthError message={state?.error} />
      <form action={action} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="locale" value={locale} />

        <Field label={t.common.email} htmlFor="email">
          <Input id="email" value={email} readOnly disabled className="opacity-70" />
        </Field>
        <Field label={t.auth.fullName} htmlFor="name" required error={state?.fieldErrors?.name}>
          <Input id="name" name="name" defaultValue={name} required autoComplete="name" />
        </Field>
        <Field
          label={t.auth.password}
          htmlFor="password"
          required
          error={state?.fieldErrors?.password}
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
          {tr("Qo'shilish", "Join")}
        </SubmitButton>
      </form>
    </AuthCard>
  );
}
