"use client";

import * as React from "react";
import { MoreHorizontal, ShieldCheck, User as UserIcon, UserCheck, UserX } from "lucide-react";
import type { Role } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import { changeRoleAction, setMemberActiveAction } from "./actions";

export function MemberRowActions({
  member,
  currentUserId,
}: {
  member: { id: string; role: Role; active: boolean };
  currentUserId: string;
}) {
  const { t, tr } = useCrmI18n();
  const [pending, startTransition] = React.useTransition();

  // OWNER rows and the current user's own row have no available actions.
  if (member.role === "OWNER" || member.id === currentUserId) {
    return null;
  }

  const setRole = (role: "ADMIN" | "AGENT") => {
    startTransition(async () => {
      await changeRoleAction(member.id, role);
      toast.success(t.toast.saved);
    });
  };

  const setActive = (active: boolean) => {
    startTransition(async () => {
      await setMemberActiveAction(member.id, active);
      toast.success(t.toast.saved);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={pending}
        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      >
        <MoreHorizontal className="size-4" />
        <span className="sr-only">{t.common.actions}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{tr("Rolni o'zgartirish", "Change role")}</DropdownMenuLabel>
        <DropdownMenuItem
          disabled={member.role === "ADMIN"}
          onSelect={(e) => {
            e.preventDefault();
            setRole("ADMIN");
          }}
        >
          <ShieldCheck className="size-4" />
          {t.role.ADMIN}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={member.role === "AGENT"}
          onSelect={(e) => {
            e.preventDefault();
            setRole("AGENT");
          }}
        >
          <UserIcon className="size-4" />
          {t.role.AGENT}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {member.active ? (
          <DropdownMenuItem
            destructive
            onSelect={(e) => {
              e.preventDefault();
              setActive(false);
            }}
          >
            <UserX className="size-4" />
            {tr("Faolsizlantirish", "Deactivate")}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setActive(true);
            }}
          >
            <UserCheck className="size-4" />
            {tr("Faollashtirish", "Activate")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
