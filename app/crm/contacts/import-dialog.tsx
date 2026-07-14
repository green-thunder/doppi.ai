"use client";

import * as React from "react";
import { useActionState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/ui/input";
import { SubmitButton } from "@/components/crm/submit-button";
import { toast } from "@/components/ui/sonner";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import { cn } from "@/lib/utils";
import { importContactsAction } from "./actions";

export function ImportDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        {/* Body unmounts on close so useFormState resets between opens. */}
        {open && <ImportBody onDone={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function ImportBody({ onDone }: { onDone: () => void }) {
  const { t, tr } = useCrmI18n();
  const [state, formAction] = useActionState(importContactsAction, null);

  React.useEffect(() => {
    if (state?.ok) {
      const n = state.message ?? "0";
      toast.success(tr(`${n} kontakt import qilindi`, `Imported ${n} contacts`));
      onDone();
    }
  }, [state, onDone, tr]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{tr("Kontaktlarni import qilish", "Import contacts")}</DialogTitle>
        <DialogDescription>
          {tr(
            "CSV faylni yuklang. Ustunlar: firstName, lastName, email, phone, position, company, tags",
            "Upload a CSV file. Columns: firstName, lastName, email, phone, position, company, tags",
          )}
        </DialogDescription>
      </DialogHeader>

      <form action={formAction} className="grid gap-4">
        <input
          type="file"
          name="file"
          accept=".csv,text/csv"
          required
          className={cn(
            inputClass,
            "h-auto cursor-pointer py-2 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-foreground/[0.06] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-foreground/[0.1]",
          )}
        />
        <p className="text-xs text-muted-foreground">
          {tr(
            "Har bir qatorda kamida ism (firstName) bo'lishi kerak. Maksimal 1000 qator.",
            "Each row needs at least a first name. Up to 1000 rows.",
          )}
        </p>

        {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {t.action.cancel}
            </Button>
          </DialogClose>
          <SubmitButton pendingText={tr("Import qilinmoqda...", "Importing...")}>
            {tr("Import", "Import")}
          </SubmitButton>
        </DialogFooter>
      </form>
    </>
  );
}
