"use client";

import * as React from "react";
import { Pencil } from "lucide-react";
import { ConfirmDelete } from "@/components/crm/confirm-delete";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import type { Option } from "@/lib/crm/types";
import { RuleDialog, type RuleValue } from "./rule-dialog";
import { deleteRuleAction, toggleRuleAction } from "./actions";

const iconBtn =
  "inline-flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function RuleRowActions({
  rule,
  stageOptions,
  memberOptions,
}: {
  rule: RuleValue;
  stageOptions: Option[];
  memberOptions: Option[];
}) {
  const { t, tr } = useCrmI18n();
  const [pending, startTransition] = React.useTransition();
  const [active, setActive] = React.useState(rule.active);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const onToggle = (value: boolean) => {
    setActive(value);
    startTransition(async () => {
      await toggleRuleAction(rule.id, value);
      toast.success(value ? tr("Qoida yoqildi", "Rule enabled") : tr("Qoida o'chirildi", "Rule disabled"));
    });
  };

  return (
    <div className="flex items-center gap-1.5">
      <Switch
        checked={active}
        disabled={pending}
        onCheckedChange={onToggle}
        aria-label={tr("Faollik holati", "Toggle active")}
      />

      <button
        type="button"
        className={iconBtn}
        onClick={() => setEditOpen(true)}
        aria-label={t.action.edit}
      >
        <Pencil className="size-4" />
      </button>

      <ConfirmDelete
        action={deleteRuleAction}
        id={rule.id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        description={t.common.deleteConfirm}
      />
      <Button
        variant="secondary"
        size="sm"
        className="!size-8 !p-0 text-red-400"
        onClick={() => setDeleteOpen(true)}
        aria-label={t.action.delete}
      >
        <span className="text-lg leading-none">×</span>
      </Button>

      <RuleDialog
        mode="edit"
        rule={rule}
        stageOptions={stageOptions}
        memberOptions={memberOptions}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
