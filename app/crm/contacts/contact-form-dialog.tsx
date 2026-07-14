"use client";

import * as React from "react";
import { useActionState } from "react";
import { Plus } from "lucide-react";
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
import { LEAD_SOURCES } from "@/lib/crm/constants";
import type { Option } from "@/lib/crm/types";
import { createContactAction, updateContactAction } from "./actions";

type ContactValue = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  position: string | null;
  source: string;
  tags: string[];
  notes: string | null;
  companyId: string | null;
  ownerId: string | null;
  customFields?: Record<string, unknown> | null;
};

export function ContactFormDialog({
  mode,
  contact,
  companyOptions,
  memberOptions,
  trigger,
  open: openProp,
  onOpenChange,
}: {
  mode: "create" | "edit";
  contact?: ContactValue;
  companyOptions: Option[];
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
          <ContactFormBody
            mode={mode}
            contact={contact}
            companyOptions={companyOptions}
            memberOptions={memberOptions}
            onDone={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ContactFormBody({
  mode,
  contact,
  companyOptions,
  memberOptions,
  onDone,
}: {
  mode: "create" | "edit";
  contact?: ContactValue;
  companyOptions: Option[];
  memberOptions: Option[];
  onDone: () => void;
}) {
  const { t, tr } = useCrmI18n();
  const action = mode === "create" ? createContactAction : updateContactAction;
  const [state, formAction] = useActionState(action, null);

  React.useEffect(() => {
    if (state?.ok) {
      toast.success(mode === "create" ? t.toast.created : t.toast.updated);
      onDone();
    }
  }, [state, mode, onDone, t]);

  const sourceOptions: Option[] = LEAD_SOURCES.map((s) => ({ value: s, label: t.source[s] }));
  const fe = state?.fieldErrors;

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {mode === "create"
            ? tr("Yangi kontakt", "New contact")
            : tr("Kontaktni tahrirlash", "Edit contact")}
        </DialogTitle>
      </DialogHeader>
      <form action={formAction} className="grid gap-4 sm:grid-cols-2">
        {mode === "edit" && contact && <input type="hidden" name="id" value={contact.id} />}

        <Field label={tr("Ism", "First name")} htmlFor="firstName" required error={fe?.firstName}>
          <Input id="firstName" name="firstName" defaultValue={contact?.firstName} required />
        </Field>
        <Field label={tr("Familiya", "Last name")} htmlFor="lastName" error={fe?.lastName}>
          <Input id="lastName" name="lastName" defaultValue={contact?.lastName ?? ""} />
        </Field>

        <Field label={t.common.email} htmlFor="email" error={fe?.email}>
          <Input id="email" name="email" type="email" defaultValue={contact?.email ?? ""} />
        </Field>
        <Field label={t.common.phone} htmlFor="phone" error={fe?.phone}>
          <Input id="phone" name="phone" defaultValue={contact?.phone ?? ""} placeholder="+998 90 123 45 67" />
        </Field>

        <Field label={tr("Lavozim", "Position")} htmlFor="position" error={fe?.position}>
          <Input id="position" name="position" defaultValue={contact?.position ?? ""} />
        </Field>
        <Field label={tr("Manba", "Source")} htmlFor="source">
          <SelectField
            name="source"
            id="source"
            options={sourceOptions}
            defaultValue={contact?.source ?? "MANUAL"}
          />
        </Field>

        <Field label={t.nav.companies} htmlFor="companyId">
          <SelectField
            name="companyId"
            id="companyId"
            options={companyOptions}
            defaultValue={contact?.companyId}
            placeholder={tr("Tanlang", "Select")}
            clearable
            clearLabel={t.common.none}
          />
        </Field>
        <Field label={t.common.owner} htmlFor="ownerId">
          <SelectField
            name="ownerId"
            id="ownerId"
            options={memberOptions}
            defaultValue={contact?.ownerId}
            placeholder={t.common.unassigned}
            clearable
            clearLabel={t.common.unassigned}
          />
        </Field>

        <Field
          className="sm:col-span-2"
          label={tr("Teglar", "Tags")}
          htmlFor="tags"
          hint={tr("Vergul bilan ajrating", "Separate with commas")}
        >
          <Input id="tags" name="tags" defaultValue={contact?.tags?.join(", ") ?? ""} placeholder="VIP, hot lead" />
        </Field>

        <Field className="sm:col-span-2" label={tr("Izohlar", "Notes")} htmlFor="notes" error={fe?.notes}>
          <Textarea id="notes" name="notes" defaultValue={contact?.notes ?? ""} />
        </Field>

        <CustomFieldInputs entity="contact" values={contact?.customFields} />

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
