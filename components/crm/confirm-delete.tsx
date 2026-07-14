"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/crm/submit-button";
import { useCrmI18n } from "@/lib/crm/i18n-provider";

/**
 * Reusable delete confirmation. Wraps a server action in a form; the record id
 * is submitted as a hidden `id` field. Can be used uncontrolled (with a
 * `trigger`, or a default Delete button) or controlled (`open`/`onOpenChange`),
 * e.g. when opened from a dropdown menu item.
 */
export function ConfirmDelete({
  action,
  id,
  title,
  description,
  trigger,
  open: openProp,
  onOpenChange,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id?: string;
  title?: string;
  description?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { t } = useCrmI18n();
  const [openUn, setOpenUn] = React.useState(false);
  const open = openProp ?? openUn;
  const setOpen = onOpenChange ?? setOpenUn;

  const triggerNode =
    trigger ??
    (openProp === undefined ? (
      <Button variant="secondary" size="sm">
        <Trash2 className="size-4" />
        {t.action.delete}
      </Button>
    ) : null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerNode && <DialogTrigger asChild>{triggerNode}</DialogTrigger>}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title ?? t.action.delete}</DialogTitle>
          <DialogDescription>{description ?? t.common.deleteConfirm}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">{t.action.cancel}</Button>
          </DialogClose>
          <form action={action}>
            {id && <input type="hidden" name="id" value={id} />}
            <SubmitButton
              variant="primary"
              className="!bg-red-500 !text-white hover:!brightness-110"
              pendingText={t.common.saving}
            >
              <Trash2 className="size-4" />
              {t.action.delete}
            </SubmitButton>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
