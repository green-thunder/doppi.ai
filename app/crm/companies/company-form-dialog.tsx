"use client";

import * as React from "react";
import { useActionState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/crm/field";
import { SelectField } from "@/components/crm/select-field";
import { SubmitButton } from "@/components/crm/submit-button";
import { CustomFieldInputs } from "@/components/crm/custom-field-inputs";
import { toast } from "@/components/ui/sonner";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import { INDUSTRIES } from "@/lib/crm/constants";
import type { Option } from "@/lib/crm/types";
import { createCompanyAction, updateCompanyAction } from "./actions";

type CompanyValue = {
  id: string;
  name: string;
  website: string | null;
  industry: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  ownerId: string | null;
  customFields?: Record<string, unknown> | null;
};

export function CompanyFormDialog({
  mode,
  company,
  memberOptions,
  trigger,
  open: openProp,
  onOpenChange,
}: {
  mode: "create" | "edit";
  company?: CompanyValue;
  memberOptions: Option[];
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [openUn, setOpenUn] = React.useState(false);
  const open = openProp ?? openUn;
  const setOpen = onOpenChange ?? setOpenUn;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl">
        {open && (
          <CompanyFormBody
            mode={mode}
            company={company}
            memberOptions={memberOptions}
            onDone={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function CompanyFormBody({
  mode,
  company,
  memberOptions,
  onDone,
}: {
  mode: "create" | "edit";
  company?: CompanyValue;
  memberOptions: Option[];
  onDone: () => void;
}) {
  const { t, tr } = useCrmI18n();
  const action = mode === "create" ? createCompanyAction : updateCompanyAction;
  const [state, formAction] = useActionState(action, null);

  React.useEffect(() => {
    if (state?.ok) {
      toast.success(mode === "create" ? t.toast.created : t.toast.updated);
      onDone();
    }
  }, [state, mode, onDone, t]);

  const industryOptions: Option[] = INDUSTRIES.map((i) => ({ value: i, label: i }));
  const fe = state?.fieldErrors;

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {mode === "create"
            ? tr("Yangi kompaniya", "New company")
            : tr("Kompaniyani tahrirlash", "Edit company")}
        </DialogTitle>
      </DialogHeader>
      <form action={formAction} className="grid gap-4 sm:grid-cols-2">
        {mode === "edit" && company && <input type="hidden" name="id" value={company.id} />}

        <Field
          className="sm:col-span-2"
          label={t.common.name}
          htmlFor="name"
          required
          error={fe?.name}
        >
          <Input id="name" name="name" defaultValue={company?.name} required />
        </Field>

        <Field label={tr("Soha", "Industry")} htmlFor="industry">
          <SelectField
            name="industry"
            id="industry"
            options={industryOptions}
            defaultValue={company?.industry}
            placeholder={tr("Tanlang", "Select")}
            clearable
            clearLabel={t.common.none}
          />
        </Field>
        <Field label={tr("Vebsayt", "Website")} htmlFor="website" error={fe?.website}>
          <Input id="website" name="website" defaultValue={company?.website ?? ""} placeholder="https://" />
        </Field>

        <Field label={t.common.phone} htmlFor="phone" error={fe?.phone}>
          <Input id="phone" name="phone" defaultValue={company?.phone ?? ""} placeholder="+998 90 123 45 67" />
        </Field>
        <Field label={t.common.email} htmlFor="email" error={fe?.email}>
          <Input id="email" name="email" type="email" defaultValue={company?.email ?? ""} />
        </Field>

        <Field className="sm:col-span-2" label={tr("Manzil", "Address")} htmlFor="address" error={fe?.address}>
          <Input id="address" name="address" defaultValue={company?.address ?? ""} />
        </Field>

        <Field label={t.common.owner} htmlFor="ownerId">
          <SelectField
            name="ownerId"
            id="ownerId"
            options={memberOptions}
            defaultValue={company?.ownerId}
            placeholder={t.common.unassigned}
            clearable
            clearLabel={t.common.unassigned}
          />
        </Field>

        <Field className="sm:col-span-2" label={tr("Izohlar", "Notes")} htmlFor="notes" error={fe?.notes}>
          <Textarea id="notes" name="notes" defaultValue={company?.notes ?? ""} />
        </Field>

        <CustomFieldInputs entity="company" values={company?.customFields} />

        {state?.error && (
          <p className="text-sm text-red-400 sm:col-span-2">{state.error}</p>
        )}

        <DialogFooter className="sm:col-span-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {t.action.cancel}
            </Button>
          </DialogClose>
          <SubmitButton pendingText={t.common.saving}>
            {mode === "create" ? t.action.create : t.action.saveChanges}
          </SubmitButton>
        </DialogFooter>
      </form>
    </>
  );
}
