"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import type { FieldType } from "@prisma/client";
import { ConfirmDelete } from "@/components/crm/confirm-delete";
import { Button } from "@/components/ui/button";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import { FieldDialog, type FieldValue } from "./field-dialog";
import { deleteFieldAction, moveFieldAction } from "./actions";

const iconBtn =
  "inline-flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function FieldRowActions({
  field,
  isFirst,
  isLast,
}: {
  field: FieldValue & { type: FieldType };
  isFirst: boolean;
  isLast: boolean;
}) {
  const { t, tr } = useCrmI18n();
  const [pending, startTransition] = React.useTransition();
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const move = (dir: "up" | "down") => {
    startTransition(async () => {
      await moveFieldAction(field.id, dir);
    });
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        className={iconBtn}
        disabled={isFirst || pending}
        onClick={() => move("up")}
        aria-label={tr("Yuqoriga", "Move up")}
      >
        <ChevronUp className="size-4" />
      </button>
      <button
        type="button"
        className={iconBtn}
        disabled={isLast || pending}
        onClick={() => move("down")}
        aria-label={tr("Pastga", "Move down")}
      >
        <ChevronDown className="size-4" />
      </button>

      <button
        type="button"
        className={iconBtn}
        onClick={() => setEditOpen(true)}
        aria-label={t.action.edit}
      >
        <Pencil className="size-4" />
      </button>

      <ConfirmDelete
        action={deleteFieldAction}
        id={field.id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        description={tr(
          "Bu maydon o'chiriladi. Saqlangan qiymatlar ko'rinmay qoladi.",
          "This field will be removed. Saved values will no longer be shown.",
        )}
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

      <FieldDialog mode="edit" field={field} open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
}
