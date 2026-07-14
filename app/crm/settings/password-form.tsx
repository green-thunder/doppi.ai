"use client";

import * as React from "react";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/crm/field";
import { SubmitButton } from "@/components/crm/submit-button";
import { toast } from "@/components/ui/sonner";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import { changePasswordAction } from "./actions";

export function PasswordForm() {
  const { t, tr } = useCrmI18n();
  const [state, formAction] = useActionState(changePasswordAction, null);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state?.ok) {
      toast.success(t.toast.saved);
      formRef.current?.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const fe = state?.fieldErrors;

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <Field
        label={tr("Joriy parol", "Current password")}
        htmlFor="currentPassword"
        required
        error={fe?.currentPassword}
      >
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
        />
      </Field>
      <Field
        label={tr("Yangi parol", "New password")}
        htmlFor="newPassword"
        required
        error={fe?.newPassword}
        hint={tr("Kamida 8 ta belgi", "At least 8 characters")}
      >
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          autoComplete="new-password"
        />
      </Field>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <div>
        <SubmitButton pendingText={t.common.saving}>
          {tr("Parolni yangilash", "Update password")}
        </SubmitButton>
      </div>
    </form>
  );
}
