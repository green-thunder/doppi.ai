"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { InitialsAvatar } from "@/components/ui/avatar";
import { StatusPill } from "@/components/ui/status-pill";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDelete } from "@/components/crm/confirm-delete";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import { formatMoneyCompact, fullName } from "@/lib/crm/format";
import { cn } from "@/lib/utils";
import type { Option } from "@/lib/crm/types";
import { DealFormDialog, type DealValue } from "./deal-form-dialog";
import { deleteDealAction, moveDealAction } from "./actions";

export type BoardStage = {
  id: string;
  name: string;
  color: string;
  order: number;
  isWon: boolean;
  isLost: boolean;
};

export type BoardCard = {
  id: string;
  title: string;
  amount: number;
  currency: string;
  stageId: string;
  status: string;
  contactId: string | null;
  companyId: string | null;
  ownerId: string | null;
  expectedCloseDate: string | null;
  contactName: string | null;
  companyName: string | null;
  owner: { id: string; name: string; avatarColor: string } | null;
  customFields?: Record<string, unknown>;
};

export function DealBoard({
  stages,
  dealsByStage,
  totals,
  stageOptions,
  contactOptions,
  companyOptions,
  memberOptions,
  defaultCurrency,
}: {
  stages: BoardStage[];
  dealsByStage: Record<string, BoardCard[]>;
  totals: Record<string, { count: number; sum: number }>;
  stageOptions: Option[];
  contactOptions: Option[];
  companyOptions: Option[];
  memberOptions: Option[];
  defaultCurrency: string;
}) {
  const { tr, locale } = useCrmI18n();
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [overStageId, setOverStageId] = React.useState<string | null>(null);
  const [, startTransition] = React.useTransition();

  const cardById = React.useMemo(() => {
    const map = new Map<string, BoardCard>();
    for (const list of Object.values(dealsByStage)) for (const c of list) map.set(c.id, c);
    return map;
  }, [dealsByStage]);

  const endDrag = () => {
    setDraggingId(null);
    setOverStageId(null);
  };

  const handleDrop = (stageId: string) => {
    const id = draggingId;
    endDrag();
    if (!id) return;
    const card = cardById.get(id);
    if (!card || card.stageId === stageId) return; // no-op on same column
    startTransition(() => {
      void moveDealAction(id, stageId);
    });
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const cards = dealsByStage[stage.id] ?? [];
        const total = totals[stage.id] ?? { count: 0, sum: 0 };
        const isOver = overStageId === stage.id && draggingId !== null && cardById.get(draggingId)?.stageId !== stage.id;
        return (
          <div key={stage.id} className="flex min-w-[280px] max-w-[280px] flex-col gap-3">
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2">
                <StatusPill color={stage.color}>{stage.name}</StatusPill>
                <span className="text-xs font-medium text-muted-foreground">{total.count}</span>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {formatMoneyCompact(total.sum, defaultCurrency, locale)}
              </span>
            </div>

            <div
              onDragOver={(e) => {
                if (!draggingId) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (overStageId !== stage.id) setOverStageId(stage.id);
              }}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(stage.id);
              }}
              className={cn(
                "flex min-h-[72px] flex-col gap-2 rounded-xl p-1 transition-colors",
                isOver && "bg-gold-500/[0.07] ring-1 ring-gold-500/40",
              )}
            >
              {cards.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border px-3 py-8 text-center text-xs text-muted-foreground">
                  {isOver ? tr("Shu yerga tashlang", "Drop here") : tr("Bo'sh", "Empty")}
                </div>
              ) : (
                cards.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    stages={stages}
                    stageOptions={stageOptions}
                    contactOptions={contactOptions}
                    companyOptions={companyOptions}
                    memberOptions={memberOptions}
                    defaultCurrency={defaultCurrency}
                    draggingId={draggingId}
                    onDragStart={setDraggingId}
                    onDragEnd={endDrag}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DealCard({
  deal,
  stages,
  stageOptions,
  contactOptions,
  companyOptions,
  memberOptions,
  defaultCurrency,
  draggingId,
  onDragStart,
  onDragEnd,
}: {
  deal: BoardCard;
  stages: BoardStage[];
  stageOptions: Option[];
  contactOptions: Option[];
  companyOptions: Option[];
  memberOptions: Option[];
  defaultCurrency: string;
  draggingId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}) {
  const { t, tr, locale } = useCrmI18n();
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const subline = [deal.companyName, deal.contactName].filter(Boolean).join(" · ");
  const otherStages = stages.filter((s) => s.id !== deal.stageId);
  const isDragging = draggingId === deal.id;

  const editValue: DealValue = {
    id: deal.id,
    title: deal.title,
    amount: deal.amount,
    currency: deal.currency,
    stageId: deal.stageId,
    status: deal.status,
    contactId: deal.contactId,
    companyId: deal.companyId,
    ownerId: deal.ownerId,
    expectedCloseDate: deal.expectedCloseDate,
    customFields: deal.customFields,
  };

  return (
    <>
      <Card
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", deal.id);
          onDragStart(deal.id);
        }}
        onDragEnd={onDragEnd}
        className={cn(
          "cursor-grab p-3 transition-opacity active:cursor-grabbing",
          isPending && "opacity-50",
          isDragging && "opacity-40 ring-2 ring-gold-500/40",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/crm/deals/${deal.id}`}
            draggable={false}
            className="min-w-0 flex-1 font-medium text-foreground hover:text-gold-300"
          >
            <span className="block truncate">{deal.title}</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="-mr-1 -mt-0.5 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">{t.common.actions}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setEditOpen(true);
                }}
              >
                <Pencil className="size-4" />
                {t.action.edit}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>{tr("Bosqichga o'tkazish", "Move to stage")}</DropdownMenuLabel>
              {otherStages.map((s) => (
                <DropdownMenuItem
                  key={s.id}
                  onSelect={(e) => {
                    e.preventDefault();
                    startTransition(() => {
                      void moveDealAction(deal.id, s.id);
                    });
                  }}
                >
                  <ArrowRight className="size-4" style={{ color: s.color }} />
                  {s.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                destructive
                onSelect={(e) => {
                  e.preventDefault();
                  setDeleteOpen(true);
                }}
              >
                <Trash2 className="size-4" />
                {t.action.delete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="mt-1 text-sm font-semibold text-gold-300">
          {formatMoneyCompact(deal.amount, deal.currency, locale)}
        </p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="min-w-0 truncate text-xs text-muted-foreground">{subline || "—"}</span>
          {deal.owner ? (
            <InitialsAvatar
              name={deal.owner.name}
              color={deal.owner.avatarColor}
              className="size-6 shrink-0"
            />
          ) : null}
        </div>
      </Card>

      <DealFormDialog
        mode="edit"
        deal={editValue}
        stageOptions={stageOptions}
        contactOptions={contactOptions}
        companyOptions={companyOptions}
        memberOptions={memberOptions}
        defaultCurrency={defaultCurrency}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <ConfirmDelete
        action={deleteDealAction}
        id={deal.id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
