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
import { toast } from "@/components/ui/sonner";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import { ACTIVITY_TYPES } from "@/lib/crm/constants";
import type { Option } from "@/lib/crm/types";
import { createActivityAction, updateActivityAction } from "./actions";

type ActivityValue = {
  id: string;
  type: string;
  subject: string;
  notes: string | null;
  dueDate: string | Date | null;
  assigneeId: string | null;
  contactId: string | null;
  dealId: string | null;
};

/** Format a date value to a yyyy-mm-dd string for <input type="date">. */
function toDateInput(value: string | Date | null | undefined): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function ActivityFormDialog({
  mode,
  activity,
  memberOptions,
  contactOptions,
  dealOptions,
  trigger,
  open: openProp,
  onOpenChange,
}: {
  mode: "create" | "edit";
  activity?: ActivityValue;
  memberOptions: Option[];
  contactOptions: Option[];
  dealOptions: Option[];
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
          <ActivityFormBody
            mode={mode}
            activity={activity}
            memberOptions={memberOptions}
            contactOptions={contactOptions}
            dealOptions={dealOptions}
            onDone={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ActivityFormBody({
  mode,
  activity,
  memberOptions,
  contactOptions,
  dealOptions,
  onDone,
}: {
  mode: "create" | "edit";
  activity?: ActivityValue;
  memberOptions: Option[];
  contactOptions: Option[];
  dealOptions: Option[];
  onDone: () => void;
}) {
  const { t, tr } = useCrmI18n();
  const action = mode === "create" ? createActivityAction : updateActivityAction;
  const [state, formAction] = useActionState(action, null);

  React.useEffect(() => {
    if (state?.ok) {
      toast.success(mode === "create" ? t.toast.created : t.toast.updated);
      onDone();
    }
  }, [state, mode, onDone, t]);

  const typeOptions: Option[] = ACTIVITY_TYPES.map((x) => ({
    value: x,
    label: t.activityType[x],
  }));
  const fe = state?.fieldErrors;

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {mode === "create"
            ? tr("Yangi vazifa", "New activity")
            : tr("Vazifani tahrirlash", "Edit activity")}
        </DialogTitle>
      </DialogHeader>
      <form action={formAction} className="grid gap-4 sm:grid-cols-2">
        {mode === "edit" && activity && <input type="hidden" name="id" value={activity.id} />}

        <Field label={tr("Turi", "Type")} htmlFor="type">
          <SelectField
            name="type"
            id="type"
            options={typeOptions}
            defaultValue={activity?.type ?? "TASK"}
          />
        </Field>
        <Field label={t.common.date} htmlFor="dueDate" error={fe?.dueDate}>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={toDateInput(activity?.dueDate)}
          />
        </Field>

        <Field
          className="sm:col-span-2"
          label={tr("Mavzu", "Subject")}
          htmlFor="subject"
          required
          error={fe?.subject}
        >
          <Input id="subject" name="subject" defaultValue={activity?.subject} required />
        </Field>

        <Field label={t.common.owner} htmlFor="assigneeId">
          <SelectField
            name="assigneeId"
            id="assigneeId"
            options={memberOptions}
            defaultValue={activity?.assigneeId}
            placeholder={t.common.unassigned}
            clearable
            clearLabel={t.common.unassigned}
          />
        </Field>
        <Field label={t.nav.contacts} htmlFor="contactId">
          <SelectField
            name="contactId"
            id="contactId"
            options={contactOptions}
            defaultValue={activity?.contactId}
            placeholder={tr("Tanlang", "Select")}
            clearable
            clearLabel={t.common.none}
          />
        </Field>

        <Field className="sm:col-span-2" label={t.nav.deals} htmlFor="dealId">
          <SelectField
            name="dealId"
            id="dealId"
            options={dealOptions}
            defaultValue={activity?.dealId}
            placeholder={tr("Tanlang", "Select")}
            clearable
            clearLabel={t.common.none}
          />
        </Field>

        <Field className="sm:col-span-2" label={tr("Izohlar", "Notes")} htmlFor="notes" error={fe?.notes}>
          <Textarea id="notes" name="notes" defaultValue={activity?.notes ?? ""} />
        </Field>

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
