"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { ConfirmDelete } from "@/components/crm/confirm-delete";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import { StageDialog } from "./stage-dialog";
import { deleteStageAction, moveStageAction } from "./actions";

type StageValue = {
  id: string;
  name: string;
  color: string;
  isWon: boolean;
  isLost: boolean;
  dealCount: number;
};

const iconBtn =
  "inline-flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function StageRowActions({
  stage,
  isFirst,
  isLast,
}: {
  stage: StageValue;
  isFirst: boolean;
  isLast: boolean;
}) {
  const { t, tr } = useCrmI18n();
  const [pending, startTransition] = React.useTransition();
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const move = (dir: "up" | "down") => {
    startTransition(async () => {
      await moveStageAction(stage.id, dir);
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
        action={deleteStageAction}
        id={stage.id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        description={
          stage.dealCount > 0
            ? tr(
                `Bu bosqichda ${stage.dealCount} ta bitim bor. Avval ularni boshqa bosqichga o'tkazing.`,
                `This stage has ${stage.dealCount} deal(s). Move them to another stage first.`,
              )
            : t.common.deleteConfirm
        }
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

      <StageDialog mode="edit" stage={stage} open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
}
