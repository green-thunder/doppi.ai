"use client";

import * as React from "react";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/crm/field";
import { SelectField } from "@/components/crm/select-field";
import { SubmitButton } from "@/components/crm/submit-button";
import { toast } from "@/components/ui/sonner";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import { CURRENCIES } from "@/lib/crm/constants";
import type { Option } from "@/lib/crm/types";
import { updateOrgAction } from "./actions";

export function OrgForm({
  name,
  currency,
}: {
  name: string;
  currency: string;
}) {
  const { t, tr } = useCrmI18n();
  const [state, formAction] = useActionState(updateOrgAction, null);

  React.useEffect(() => {
    if (state?.ok) toast.success(t.toast.saved);
  }, [state, t]);

  const currencyOptions: Option[] = CURRENCIES.map((c) => ({ value: c, label: c }));
  const fe = state?.fieldErrors;

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <Field
        className="sm:col-span-2"
        label={tr("Tashkilot nomi", "Organization name")}
        htmlFor="name"
        required
        error={fe?.name}
      >
        <Input id="name" name="name" defaultValue={name} required />
      </Field>

      <Field label={tr("Valyuta", "Currency")} htmlFor="currency" error={fe?.currency}>
        <SelectField
          name="currency"
          id="currency"
          options={currencyOptions}
          defaultValue={currency}
        />
      </Field>

      {state?.error && (
        <p className="text-sm text-red-400 sm:col-span-2">{state.error}</p>
      )}

      <div className="sm:col-span-2">
        <SubmitButton pendingText={t.common.saving}>{t.action.saveChanges}</SubmitButton>
      </div>
    </form>
  );
}
