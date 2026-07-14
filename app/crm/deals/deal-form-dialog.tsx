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
import { Field } from "@/components/crm/field";
import { SelectField } from "@/components/crm/select-field";
import { SubmitButton } from "@/components/crm/submit-button";
import { CustomFieldInputs } from "@/components/crm/custom-field-inputs";
import { toast } from "@/components/ui/sonner";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import { CURRENCIES } from "@/lib/crm/constants";
import type { Option } from "@/lib/crm/types";
import { createDealAction, updateDealAction } from "./actions";

export type DealValue = {
  id: string;
  title: string;
  amount: number;
  currency: string;
  stageId: string;
  status: string;
  contactId: string | null;
  companyId: string | null;
  ownerId: string | null;
  /** ISO string or null; sliced to yyyy-mm-dd for the date input. */
  expectedCloseDate: string | null;
  customFields?: Record<string, unknown> | null;
};

export function DealFormDialog({
  mode,
  deal,
  stageOptions,
  contactOptions,
  companyOptions,
  memberOptions,
  defaultCurrency,
  trigger,
  open: openProp,
  onOpenChange,
}: {
  mode: "create" | "edit";
  deal?: DealValue;
  stageOptions: Option[];
  contactOptions: Option[];
  companyOptions: Option[];
  memberOptions: Option[];
  defaultCurrency: string;
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
          <DealFormBody
            mode={mode}
            deal={deal}
            stageOptions={stageOptions}
            contactOptions={contactOptions}
            companyOptions={companyOptions}
            memberOptions={memberOptions}
            defaultCurrency={defaultCurrency}
            onDone={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function DealFormBody({
  mode,
  deal,
  stageOptions,
  contactOptions,
  companyOptions,
  memberOptions,
  defaultCurrency,
  onDone,
}: {
  mode: "create" | "edit";
  deal?: DealValue;
  stageOptions: Option[];
  contactOptions: Option[];
  companyOptions: Option[];
  memberOptions: Option[];
  defaultCurrency: string;
  onDone: () => void;
}) {
  const { t, tr } = useCrmI18n();
  const action = mode === "create" ? createDealAction : updateDealAction;
  const [state, formAction] = useActionState(action, null);

  React.useEffect(() => {
    if (state?.ok) {
      toast.success(mode === "create" ? t.toast.created : t.toast.updated);
      onDone();
    }
  }, [state, mode, onDone, t]);

  const currencyOptions: Option[] = CURRENCIES.map((c) => ({ value: c, label: c }));
  const statusOptions: Option[] = [
    { value: "OPEN", label: t.dealStatus.OPEN },
    { value: "WON", label: t.dealStatus.WON },
    { value: "LOST", label: t.dealStatus.LOST },
  ];

  const fe = state?.fieldErrors;
  const defaultStageId = deal?.stageId ?? stageOptions[0]?.value;
  const expectedCloseDate = deal?.expectedCloseDate ? deal.expectedCloseDate.slice(0, 10) : "";

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {mode === "create"
            ? tr("Yangi bitim", "New deal")
            : tr("Bitimni tahrirlash", "Edit deal")}
        </DialogTitle>
      </DialogHeader>
      <form action={formAction} className="grid gap-4 sm:grid-cols-2">
        {mode === "edit" && deal && <input type="hidden" name="id" value={deal.id} />}

        <Field
          className="sm:col-span-2"
          label={tr("Sarlavha", "Title")}
          htmlFor="title"
          required
          error={fe?.title}
        >
          <Input id="title" name="title" defaultValue={deal?.title} required />
        </Field>

        <Field label={tr("Summa", "Amount")} htmlFor="amount" error={fe?.amount}>
          <Input
            id="amount"
            name="amount"
            type="number"
            min={0}
            step="any"
            defaultValue={deal?.amount ?? 0}
          />
        </Field>
        <Field label={tr("Valyuta", "Currency")} htmlFor="currency">
          <SelectField
            name="currency"
            id="currency"
            options={currencyOptions}
            defaultValue={deal?.currency ?? defaultCurrency}
          />
        </Field>

        <Field label={t.nav.pipeline} htmlFor="stageId" required error={fe?.stageId}>
          <SelectField
            name="stageId"
            id="stageId"
            options={stageOptions}
            defaultValue={defaultStageId}
            placeholder={tr("Bosqichni tanlang", "Select stage")}
          />
        </Field>
        <Field label={t.common.status} htmlFor="status" error={fe?.status}>
          <SelectField
            name="status"
            id="status"
            options={statusOptions}
            defaultValue={deal?.status ?? "OPEN"}
          />
        </Field>

        <Field label={t.nav.contacts} htmlFor="contactId">
          <SelectField
            name="contactId"
            id="contactId"
            options={contactOptions}
            defaultValue={deal?.contactId}
            placeholder={tr("Tanlang", "Select")}
            clearable
            clearLabel={t.common.none}
          />
        </Field>
        <Field label={t.nav.companies} htmlFor="companyId">
          <SelectField
            name="companyId"
            id="companyId"
            options={companyOptions}
            defaultValue={deal?.companyId}
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
            defaultValue={deal?.ownerId}
            placeholder={t.common.unassigned}
            clearable
            clearLabel={t.common.unassigned}
          />
        </Field>
        <Field
          label={tr("Yopilish sanasi", "Expected close date")}
          htmlFor="expectedCloseDate"
          error={fe?.expectedCloseDate}
        >
          <Input
            id="expectedCloseDate"
            name="expectedCloseDate"
            type="date"
            defaultValue={expectedCloseDate}
          />
        </Field>

        <CustomFieldInputs entity="deal" values={deal?.customFields} />

        {state?.error && <p className="text-sm text-red-400 sm:col-span-2">{state.error}</p>}

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
