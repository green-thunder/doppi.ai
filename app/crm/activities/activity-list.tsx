"use client";

import * as React from "react";
import {
  CheckSquare,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  StickyNote,
  Trash2,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { InitialsAvatar } from "@/components/ui/avatar";
import { StatusPill } from "@/components/ui/status-pill";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDelete } from "@/components/crm/confirm-delete";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import { formatDate, fullName } from "@/lib/crm/format";
import { cn } from "@/lib/utils";
import type { Option } from "@/lib/crm/types";
import { ActivityFormDialog } from "./activity-form-dialog";
import { deleteActivityAction, toggleActivityAction } from "./actions";

const ICON: Record<string, LucideIcon> = {
  CALL: Phone,
  MEETING: Users,
  EMAIL: Mail,
  TASK: CheckSquare,
  NOTE: StickyNote,
};

type ActivityItem = {
  id: string;
  type: string;
  subject: string;
  notes: string | null;
  dueDate: string | Date | null;
  completed: boolean;
  contact: { firstName: string; lastName: string | null } | null;
  deal: { title: string } | null;
  assignee: { name: string; avatarColor: string } | null;
  assigneeId: string | null;
  contactId: string | null;
  dealId: string | null;
};

export function ActivityList({
  items,
  memberOptions,
  contactOptions,
  dealOptions,
}: {
  items: ActivityItem[];
  memberOptions: Option[];
  contactOptions: Option[];
  dealOptions: Option[];
}) {
  return (
    <Card className="overflow-hidden">
      <ul className="divide-y divide-border">
        {items.map((a) => (
          <ActivityRow
            key={a.id}
            activity={a}
            memberOptions={memberOptions}
            contactOptions={contactOptions}
            dealOptions={dealOptions}
          />
        ))}
      </ul>
    </Card>
  );
}

function ActivityRow({
  activity: a,
  memberOptions,
  contactOptions,
  dealOptions,
}: {
  activity: ActivityItem;
  memberOptions: Option[];
  contactOptions: Option[];
  dealOptions: Option[];
}) {
  const { t, tr, locale } = useCrmI18n();
  const [isPending, startTransition] = React.useTransition();
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const Icon = ICON[a.type] ?? CheckSquare;
  const dueDate = a.dueDate ? new Date(a.dueDate) : null;
  const overdue = !a.completed && dueDate !== null && dueDate.getTime() < Date.now();
  const contactName = a.contact ? fullName(a.contact.firstName, a.contact.lastName) : null;

  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <Checkbox
        checked={a.completed}
        disabled={isPending}
        aria-label={t.action.confirm}
        onCheckedChange={(next) => {
          const value = next === true;
          startTransition(() => {
            void toggleActivityAction(a.id, value);
          });
        }}
      />

      <Icon
        className={cn(
          "size-4 shrink-0",
          a.completed ? "text-muted-foreground" : "text-gold-400",
        )}
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "truncate font-medium",
              a.completed ? "text-muted-foreground line-through" : "text-foreground",
            )}
          >
            {a.subject}
          </span>
          <StatusPill tone={a.completed ? "green" : "gray"}>
            {t.activityType[a.type as keyof typeof t.activityType]}
          </StatusPill>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {contactName && <StatusPill tone="blue">{contactName}</StatusPill>}
          {a.deal && <StatusPill tone="purple">{a.deal.title}</StatusPill>}
        </div>
      </div>

      <div className="hidden shrink-0 sm:block">
        {dueDate ? (
          <span
            className={cn(
              "text-sm",
              overdue ? "font-medium text-red-400" : "text-muted-foreground",
            )}
          >
            {overdue ? `${formatDate(dueDate, locale)} · ${tr("muddati o'tgan", "overdue")}` : formatDate(dueDate, locale)}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </div>

      <div className="hidden shrink-0 sm:block">
        {a.assignee ? (
          <InitialsAvatar
            name={a.assignee.name}
            color={a.assignee.avatarColor}
            className="size-7"
          />
        ) : null}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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

      <ActivityFormDialog
        mode="edit"
        activity={{
          id: a.id,
          type: a.type,
          subject: a.subject,
          notes: a.notes,
          dueDate: a.dueDate,
          assigneeId: a.assigneeId,
          contactId: a.contactId,
          dealId: a.dealId,
        }}
        memberOptions={memberOptions}
        contactOptions={contactOptions}
        dealOptions={dealOptions}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <ConfirmDelete
        action={deleteActivityAction}
        id={a.id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </li>
  );
}
