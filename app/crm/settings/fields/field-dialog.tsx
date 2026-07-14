"use client";

import * as React from "react";
import { useActionState } from "react";
import type { CustomEntity, FieldType } from "@prisma/client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/crm/field";
import { SelectField } from "@/components/crm/select-field";
import { SubmitButton } from "@/components/crm/submit-button";
import { toast } from "@/components/ui/sonner";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import type { Option } from "@/lib/crm/types";
import { createFieldAction, updateFieldAction } from "./actions";

export type FieldValue = {
  id: string;
  label: string;
  type: FieldType;
  options: string[];
};

export function FieldDialog({
  mode,
  entity,
  field,
  trigger,
  open: openProp,
  onOpenChange,
}: {
  mode: "create" | "edit";
  /** Required in create mode — which entity the new field belongs to. */
  entity?: CustomEntity;
  field?: FieldValue;
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
      <DialogContent className="max-w-md">
        {open && (
          <FieldBody mode={mode} entity={entity} field={field} onDone={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function FieldBody({
  mode,
  entity,
  field,
  onDone,
}: {
  mode: "create" | "edit";
  entity?: CustomEntity;
  field?: FieldValue;
  onDone: () => void;
}) {
  const { t, tr } = useCrmI18n();
  const action = mode === "create" ? createFieldAction : updateFieldAction;
  const [state, formAction] = useActionState(action, null);

  const [type, setType] = React.useState<string>(field?.type ?? "TEXT");

  React.useEffect(() => {
    if (state?.ok) {
      toast.success(mode === "create" ? t.toast.created : t.toast.updated);
      onDone();
    }
  }, [state, mode, onDone, t]);

  const typeOptions: Option[] = [
    { value: "TEXT", label: tr("Matn", "Text") },
    { value: "NUMBER", label: tr("Raqam", "Number") },
    { value: "DATE", label: tr("Sana", "Date") },
    { value: "SELECT", label: tr("Tanlov ro'yxati", "Select") },
    { value: "BOOLEAN", label: tr("Ha/Yo'q", "Yes/No") },
  ];

  const fe = state?.fieldErrors;

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {mode === "create"
            ? tr("Yangi maydon", "New field")
            : tr("Maydonni tahrirlash", "Edit field")}
        </DialogTitle>
      </DialogHeader>
      <form action={formAction} className="flex flex-col gap-4">
        {mode === "edit" && field && <input type="hidden" name="id" value={field.id} />}
        {mode === "create" && entity && <input type="hidden" name="entity" value={entity} />}

        <Field label={tr("Nomi", "Label")} htmlFor="label" required error={fe?.label}>
          <Input id="label" name="label" defaultValue={field?.label} required />
        </Field>

        <Field label={tr("Turi", "Type")} htmlFor="type" error={fe?.type}>
          <SelectField
            name="type"
            id="type"
            options={typeOptions}
            defaultValue={field?.type ?? "TEXT"}
            onValueChange={setType}
          />
        </Field>

        {type === "SELECT" && (
          <Field
            label={tr("Variantlar", "Options")}
            htmlFor="options"
            hint={tr("Har birini yangi qatordan yozing", "One per line")}
            error={fe?.options}
          >
            <Textarea
              id="options"
              name="options"
              defaultValue={field?.options?.join("\n") ?? ""}
              placeholder={tr("Yuqori\nO'rta\nPast", "High\nMedium\nLow")}
            />
          </Field>
        )}

        {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

        <DialogFooter>
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
