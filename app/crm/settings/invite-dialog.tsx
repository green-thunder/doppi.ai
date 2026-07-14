"use client";

import * as React from "react";
import { useActionState } from "react";
import { Check, Copy, Mail } from "lucide-react";
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
import { Input, inputClass } from "@/components/ui/input";
import { Field } from "@/components/crm/field";
import { SelectField } from "@/components/crm/select-field";
import { SubmitButton } from "@/components/crm/submit-button";
import { toast } from "@/components/ui/sonner";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import { ASSIGNABLE_ROLES } from "@/lib/crm/constants";
import { cn } from "@/lib/utils";
import type { Option } from "@/lib/crm/types";
import { inviteMemberAction } from "./actions";

export function InviteDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-lg">
        {open && <InviteBody onClose={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function InviteBody({ onClose }: { onClose: () => void }) {
  const { t, tr } = useCrmI18n();
  const [state, formAction] = useActionState(inviteMemberAction, null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (state?.ok) toast.success(tr("Taklif yaratildi", "Invitation created"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const roleOptions: Option[] = ASSIGNABLE_ROLES.map((r) => ({ value: r, label: t.role[r] }));
  const fe = state?.fieldErrors;

  // Success view: show the accept link (works with or without email configured).
  if (state?.ok && state.message) {
    const link = state.message;
    const copy = async () => {
      try {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        toast.error(t.toast.error);
      }
    };
    return (
      <>
        <DialogHeader>
          <DialogTitle>{tr("Taklif tayyor", "Invitation ready")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <Mail className="mt-0.5 size-4 shrink-0 text-gold-400" />
            {tr(
              "Agar email sozlangan bo'lsa, taklif yuborildi. Quyidagi havolani ham ulashishingiz mumkin:",
              "If email is configured, an invite was sent. You can also share this link:",
            )}
          </p>
          <div className="flex items-center gap-2">
            <input readOnly value={link} className={cn(inputClass, "font-mono text-xs")} />
            <Button type="button" variant="secondary" size="icon" onClick={copy}>
              {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {tr("Havola 7 kun amal qiladi.", "This link expires in 7 days.")}
          </p>
        </div>
        <DialogFooter>
          <Button type="button" onClick={onClose}>
            {t.action.close}
          </Button>
        </DialogFooter>
      </>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{tr("Yangi a'zo taklif qilish", "Invite member")}</DialogTitle>
      </DialogHeader>
      <form action={formAction} className="grid gap-4 sm:grid-cols-2">
        <Field
          className="sm:col-span-2"
          label={tr("Ism", "Name")}
          htmlFor="name"
          required
          error={fe?.name}
        >
          <Input id="name" name="name" required />
        </Field>

        <Field
          label={t.common.email}
          htmlFor="email"
          required
          error={fe?.email}
        >
          <Input id="email" name="email" type="email" required />
        </Field>

        <Field label={tr("Rol", "Role")} htmlFor="role" error={fe?.role}>
          <SelectField name="role" id="role" options={roleOptions} defaultValue="AGENT" />
        </Field>

        <p className="text-xs text-muted-foreground sm:col-span-2">
          {tr(
            "Taklif qilingan shaxs havola orqali o'z parolini o'rnatadi.",
            "The invitee sets their own password via the link.",
          )}
        </p>

        {state?.error && <p className="text-sm text-red-400 sm:col-span-2">{state.error}</p>}

        <DialogFooter className="sm:col-span-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {t.action.cancel}
            </Button>
          </DialogClose>
          <SubmitButton pendingText={t.common.saving}>{t.action.invite}</SubmitButton>
        </DialogFooter>
      </form>
    </>
  );
}
