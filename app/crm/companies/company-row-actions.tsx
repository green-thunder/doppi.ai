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
import { CompanyFormDialog } from "./company-form-dialog";
import { deleteCompanyAction } from "./actions";

type CompanyValue = React.ComponentProps<typeof CompanyFormDialog>["company"];

export function CompanyRowActions({
  company,
  memberOptions,
}: {
  company: NonNullable<CompanyValue>;
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

      <CompanyFormDialog
        mode="edit"
        company={company}
        memberOptions={memberOptions}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <ConfirmDelete
        action={deleteCompanyAction}
        id={company.id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
