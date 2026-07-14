"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDelete } from "@/components/crm/confirm-delete";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import type { Option } from "@/lib/crm/types";
import { ContactFormDialog } from "./contact-form-dialog";
import { deleteContactAction } from "./actions";

type ContactValue = React.ComponentProps<typeof ContactFormDialog>["contact"];

export function ContactRowActions({
  contact,
  companyOptions,
  memberOptions,
}: {
  contact: NonNullable<ContactValue>;
  companyOptions: Option[];
  memberOptions: Option[];
}) {
  const { t } = useCrmI18n();
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <>
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

      <ContactFormDialog
        mode="edit"
        contact={contact}
        companyOptions={companyOptions}
        memberOptions={memberOptions}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <ConfirmDelete
        action={deleteContactAction}
        id={contact.id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
