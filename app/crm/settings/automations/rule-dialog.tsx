"use client";

import * as React from "react";
import { useActionState } from "react";
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
import { Field } from "@/components/crm/field";
import { SelectField } from "@/components/crm/select-field";
import { SubmitButton } from "@/components/crm/submit-button";
import { toast } from "@/components/ui/sonner";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import type { Option } from "@/lib/crm/types";
import { createRuleAction, updateRuleAction } from "./actions";

/** A rule flattened for the form: config JSON is spread into discrete fields. */
export type RuleValue = {
  id: string;
  name: string;
  trigger: string;
  action: string;
  active: boolean;
  stageId?: string;
  subject?: string;
  assigneeId?: string;
  tag?: string;
};

export function RuleDialog({
  mode,
  rule,
  stageOptions,
  memberOptions,
  trigger,
  open: openProp,
  onOpenChange,
}: {
  mode: "create" | "edit";
  rule?: RuleValue;
  stageOptions: Option[];
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
      <DialogContent className="max-w-md">
        {open && (
          <RuleBody
            mode={mode}
            rule={rule}
            stageOptions={stageOptions}
            memberOptions={memberOptions}
            onDone={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function RuleBody({
  mode,
  rule,
  stageOptions,
  memberOptions,
  onDone,
}: {
  mode: "create" | "edit";
  rule?: RuleValue;
  stageOptions: Option[];
  memberOptions: Option[];
  onDone: () => void;
}) {
  const { t, tr } = useCrmI18n();
  const action = mode === "create" ? createRuleAction : updateRuleAction;
  const [state, formAction] = useActionState(action, null);

  React.useEffect(() => {
    if (state?.ok) {
      toast.success(mode === "create" ? t.toast.created : t.toast.updated);
      onDone();
    }
  }, [state, mode, onDone, t]);

  const fe = state?.fieldErrors;

  const triggerOptions: Option[] = [
    { value: "DEAL_STAGE_CHANGED", label: tr("Bitim bosqichi o'zgarganda", "Deal stage changed") },
    { value: "DEAL_WON", label: tr("Bitim yutilganda", "Deal won") },
    { value: "DEAL_LOST", label: tr("Bitim yo'qotilganda", "Deal lost") },
    { value: "CONTACT_CREATED", label: tr("Kontakt yaratilganda", "Contact created") },
    { value: "WEBSITE_LEAD", label: tr("Veb-saytdan lead kelganda", "Website lead") },
  ];

  const actionOptions: Option[] = [
    { value: "CREATE_TASK", label: tr("Vazifa yaratish", "Create task") },
    { value: "ASSIGN_OWNER", label: tr("Egasini tayinlash", "Assign owner") },
    { value: "ADD_TAG", label: tr("Teg qo'shish", "Add tag") },
  ];

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {mode === "create"
            ? tr("Yangi qoida", "New rule")
            : tr("Qoidani tahrirlash", "Edit rule")}
        </DialogTitle>
      </DialogHeader>

      <form action={formAction} className="flex flex-col gap-4">
        {mode === "edit" && rule && <input type="hidden" name="id" value={rule.id} />}

        <Field label={t.common.name} htmlFor="name" required error={fe?.name}>
          <Input
            id="name"
            name="name"
            defaultValue={rule?.name}
            placeholder={tr("Masalan: Yutilgan bitimlar", "e.g. Won deals follow-up")}
            required
          />
        </Field>

        <Field
          label={tr("Trigger", "Trigger")}
          htmlFor="trigger"
          error={fe?.trigger}
          hint={tr("Qoida qachon ishga tushadi", "When the rule fires")}
        >
          <SelectField
            id="trigger"
            name="trigger"
            options={triggerOptions}
            defaultValue={rule?.trigger ?? "DEAL_STAGE_CHANGED"}
            placeholder={tr("Tanlang", "Select")}
          />
        </Field>

        <Field
          label={tr("Bosqich", "Stage")}
          hint={tr(
            "Faqat “bosqich o'zgarganda” uchun — bo'sh = har qanday bosqich",
            "Only for “deal stage changed” — empty = any stage",
          )}
        >
          <SelectField
            name="stageId"
            options={stageOptions}
            defaultValue={rule?.stageId}
            clearable
            placeholder={tr("Har qanday bosqich", "Any stage")}
          />
        </Field>

        <Field
          label={tr("Amal", "Action")}
          htmlFor="action"
          error={fe?.action}
          hint={tr("Nima bajarilsin", "What happens")}
        >
          <SelectField
            id="action"
            name="action"
            options={actionOptions}
            defaultValue={rule?.action ?? "CREATE_TASK"}
            placeholder={tr("Tanlang", "Select")}
          />
        </Field>

        <Field
          label={tr("Vazifa mavzusi", "Task subject")}
          htmlFor="subject"
          hint={tr("“Vazifa yaratish” uchun", "For “create task”")}
        >
          <Input
            id="subject"
            name="subject"
            defaultValue={rule?.subject}
            placeholder={tr("Masalan: Mijoz bilan bog'laning", "e.g. Follow up with customer")}
          />
        </Field>

        <Field
          label={tr("Mas'ul xodim", "Assignee / owner")}
          hint={tr(
            "“Vazifa” va “egasini tayinlash” uchun",
            "For “create task” and “assign owner”",
          )}
        >
          <SelectField
            name="assigneeId"
            options={memberOptions}
            defaultValue={rule?.assigneeId}
            clearable
            placeholder={tr("Xodim tanlang", "Select member")}
          />
        </Field>

        <Field
          label={tr("Teg", "Tag")}
          htmlFor="tag"
          hint={tr("“Teg qo'shish” uchun", "For “add tag”")}
        >
          <Input id="tag" name="tag" defaultValue={rule?.tag} placeholder="VIP" />
        </Field>

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
