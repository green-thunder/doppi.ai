"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { InitialsAvatar } from "@/components/ui/avatar";
import { Field } from "@/components/crm/field";
import { SelectField } from "@/components/crm/select-field";
import { SubmitButton } from "@/components/crm/submit-button";
import { toast } from "@/components/ui/sonner";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import type { Locale } from "@/lib/crm/i18n";
import type { Option } from "@/lib/crm/types";
import { updateProfileAction } from "./actions";

export function ProfileForm({
  name,
  email,
  locale,
  avatarColor,
}: {
  name: string;
  email: string;
  locale: string;
  avatarColor: string;
}) {
  const { t, tr, setLocale } = useCrmI18n();
  const router = useRouter();
  const [state, formAction] = useActionState(updateProfileAction, null);

  const [color, setColor] = React.useState(avatarColor);
  const [nameValue, setNameValue] = React.useState(name);
  const selectedLocale = React.useRef<Locale>((locale === "en" ? "en" : "uz") as Locale);

  React.useEffect(() => {
    if (state?.ok) {
      toast.success(t.toast.saved);
      setLocale(selectedLocale.current);
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const localeOptions: Option[] = [
    { value: "uz", label: "O'zbekcha" },
    { value: "en", label: "English" },
  ];
  const fe = state?.fieldErrors;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <InitialsAvatar name={nameValue || name} color={color} className="size-14" />
        <div className="min-w-0">
          <p className="truncate font-display font-semibold text-foreground">{nameValue || name}</p>
          <p className="truncate text-sm text-muted-foreground">{email}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t.auth.fullName} htmlFor="name" required error={fe?.name}>
          <Input
            id="name"
            name="name"
            defaultValue={name}
            required
            onChange={(e) => setNameValue(e.target.value)}
          />
        </Field>

        <Field label={tr("Til", "Language")} htmlFor="locale">
          <SelectField
            name="locale"
            id="locale"
            options={localeOptions}
            defaultValue={locale === "en" ? "en" : "uz"}
            onValueChange={(v) => {
              selectedLocale.current = (v === "en" ? "en" : "uz") as Locale;
            }}
          />
        </Field>

        <Field label={tr("Avatar rangi", "Avatar color")} htmlFor="avatarColor">
          <input
            id="avatarColor"
            name="avatarColor"
            type="color"
            defaultValue={avatarColor}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-full cursor-pointer rounded-xl border border-border bg-background/60 p-1"
          />
        </Field>
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <div>
        <SubmitButton pendingText={t.common.saving}>{t.action.saveChanges}</SubmitButton>
      </div>
    </form>
  );
}
