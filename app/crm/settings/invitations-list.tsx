"use client";

import * as React from "react";
import { Mail, X } from "lucide-react";
import { StatusPill } from "@/components/ui/status-pill";
import { toast } from "@/components/ui/sonner";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import type { Role } from "@prisma/client";
import { revokeInvitationAction } from "./actions";

export type PendingInvite = {
  id: string;
  email: string;
  role: Role;
  expiresLabel: string;
};

export function InvitationsList({ invites }: { invites: PendingInvite[] }) {
  const { t, tr } = useCrmI18n();
  const [pending, startTransition] = React.useTransition();
  const [busyId, setBusyId] = React.useState<string | null>(null);

  const revoke = (id: string) => {
    setBusyId(id);
    startTransition(async () => {
      await revokeInvitationAction(id);
      toast.success(tr("Taklif bekor qilindi", "Invitation revoked"));
      setBusyId(null);
    });
  };

  if (invites.length === 0) return null;

  return (
    <ul className="divide-y divide-border">
      {invites.map((inv) => (
        <li key={inv.id} className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-gold-500/10 text-gold-400">
              <Mail className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{inv.email}</p>
              <p className="text-xs text-muted-foreground">{inv.expiresLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill tone="gray">{t.role[inv.role]}</StatusPill>
            <button
              type="button"
              disabled={pending && busyId === inv.id}
              onClick={() => revoke(inv.id)}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={t.action.remove}
            >
              <X className="size-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
