import { UserPlus, Users } from "lucide-react";
import { requireAdmin } from "@/lib/crm/auth";
import { getT } from "@/lib/crm/i18n-server";
import { listMembers } from "@/lib/crm/data/team";
import { listPendingInvitations } from "@/lib/crm/data/invitations";
import { formatDate, fromNow } from "@/lib/crm/format";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InitialsAvatar } from "@/components/ui/avatar";
import { StatusPill } from "@/components/ui/status-pill";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/crm/empty-state";
import { InviteDialog } from "../invite-dialog";
import { MemberRowActions } from "../member-row-actions";
import { InvitationsList, type PendingInvite } from "../invitations-list";

export default async function TeamPage() {
  const user = await requireAdmin();
  const { locale, dict: t, tr } = await getT();

  const [members, pending] = await Promise.all([
    listMembers(user.orgId),
    listPendingInvitations(user.orgId),
  ]);
  const activeCount = members.filter((m) => m.active).length;

  const pendingInvites: PendingInvite[] = pending.map((inv) => ({
    id: inv.id,
    email: inv.email,
    role: inv.role,
    expiresLabel: tr(
      `${fromNow(inv.expiresAt, locale)} tugaydi`,
      `expires ${fromNow(inv.expiresAt, locale)}`,
    ),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">{t.nav.team}</h2>
          <p className="text-sm text-muted-foreground">
            {tr(
              `${members.length} a'zo · ${activeCount} faol`,
              `${members.length} member${members.length === 1 ? "" : "s"} · ${activeCount} active`,
            )}
          </p>
        </div>
        <InviteDialog
          trigger={
            <Button size="sm">
              <UserPlus className="size-4" />
              {t.action.invite}
            </Button>
          }
        />
      </div>

      <Card className="overflow-hidden">
        {members.length === 0 ? (
          <EmptyState
            icon={<Users className="size-6" />}
            title={tr("Hali a'zo yo'q", "No members yet")}
            description={tr("Birinchi a'zoni taklif qiling", "Invite your first member")}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.common.name}</TableHead>
                <TableHead className="hidden sm:table-cell">{t.common.email}</TableHead>
                <TableHead>{tr("Rol", "Role")}</TableHead>
                <TableHead className="hidden md:table-cell">{t.common.status}</TableHead>
                <TableHead className="hidden lg:table-cell">
                  {tr("Oxirgi kirish", "Last login")}
                </TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => {
                const isSelf = m.id === user.id;
                return (
                  <TableRow key={m.id}>
                    <TableCell>
                      <span className="flex items-center gap-3">
                        <InitialsAvatar
                          name={m.name}
                          color={m.avatarColor}
                          className="size-8"
                        />
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-foreground">
                            {m.name}
                            {isSelf && (
                              <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                                {tr("(siz)", "(you)")}
                              </span>
                            )}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground sm:hidden">
                            {m.email}
                          </span>
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {m.email}
                    </TableCell>
                    <TableCell>
                      <StatusPill tone={m.role === "OWNER" ? "gold" : "gray"}>
                        {t.role[m.role]}
                      </StatusPill>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <StatusPill tone={m.active ? "green" : "red"}>
                        {m.active ? tr("Faol", "Active") : tr("Faolsiz", "Inactive")}
                      </StatusPill>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {m.lastLoginAt ? fromNow(m.lastLoginAt, locale) : formatDate(m.createdAt, locale)}
                    </TableCell>
                    <TableCell>
                      <MemberRowActions
                        member={{ id: m.id, role: m.role, active: m.active }}
                        currentUserId={user.id}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {pendingInvites.length > 0 && (
        <div>
          <h3 className="mb-2 px-1 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {tr("Kutilayotgan takliflar", "Pending invitations")} ({pendingInvites.length})
          </h3>
          <Card className="overflow-hidden">
            <InvitationsList invites={pendingInvites} />
          </Card>
        </div>
      )}
    </div>
  );
}
