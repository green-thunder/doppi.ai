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
import { Switch } from "@/components/ui/switch";
import { Field } from "@/components/crm/field";
import { SubmitButton } from "@/components/crm/submit-button";
import { toast } from "@/components/ui/sonner";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import { createStageAction, updateStageAction } from "./actions";

type StageValue = {
  id: string;
  name: string;
  color: string;
  isWon: boolean;
  isLost: boolean;
};

export function StageDialog({
  mode,
  stage,
  trigger,
  open: openProp,
  onOpenChange,
}: {
  mode: "create" | "edit";
  stage?: StageValue;
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
        {open && <StageBody mode={mode} stage={stage} onDone={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function StageBody({
  mode,
  stage,
  onDone,
}: {
  mode: "create" | "edit";
  stage?: StageValue;
  onDone: () => void;
}) {
  const { t, tr } = useCrmI18n();
  const action = mode === "create" ? createStageAction : updateStageAction;
  const [state, formAction] = useActionState(action, null);

  const [isWon, setIsWon] = React.useState(stage?.isWon ?? false);
  const [isLost, setIsLost] = React.useState(stage?.isLost ?? false);

  React.useEffect(() => {
    if (state?.ok) {
      toast.success(mode === "create" ? t.toast.created : t.toast.updated);
      onDone();
    }
  }, [state, mode, onDone, t]);

  const fe = state?.fieldErrors;

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {mode === "create" ? tr("Yangi bosqich", "New stage") : tr("Bosqichni tahrirlash", "Edit stage")}
        </DialogTitle>
      </DialogHeader>
      <form action={formAction} className="flex flex-col gap-4">
        {mode === "edit" && stage && <input type="hidden" name="id" value={stage.id} />}
        <input type="hidden" name="isWon" value={isWon ? "on" : "false"} />
        <input type="hidden" name="isLost" value={isLost ? "on" : "false"} />

        <Field label={t.common.name} htmlFor="name" required error={fe?.name}>
          <Input id="name" name="name" defaultValue={stage?.name} required />
        </Field>

        <Field label={tr("Rang", "Color")} htmlFor="color">
          <input
            id="color"
            name="color"
            type="color"
            defaultValue={stage?.color ?? "#E6A92C"}
            className="h-10 w-full cursor-pointer rounded-xl border border-border bg-background/60 p-1"
          />
        </Field>

        <label className="flex items-center justify-between gap-4 rounded-xl border border-border px-3.5 py-2.5">
          <span className="text-sm text-foreground">{tr("G'alaba bosqichi", "Won stage")}</span>
          <Switch
            checked={isWon}
            onCheckedChange={(v) => {
              setIsWon(v);
              if (v) setIsLost(false);
            }}
          />
        </label>

        <label className="flex items-center justify-between gap-4 rounded-xl border border-border px-3.5 py-2.5">
          <span className="text-sm text-foreground">{tr("Yo'qotish bosqichi", "Lost stage")}</span>
          <Switch
            checked={isLost}
            onCheckedChange={(v) => {
              setIsLost(v);
              if (v) setIsWon(false);
            }}
          />
        </label>

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
