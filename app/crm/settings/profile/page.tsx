import { KeyRound, UserCircle } from "lucide-react";
import { requireUser } from "@/lib/crm/auth";
import { getT } from "@/lib/crm/i18n-server";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { ProfileForm } from "../profile-form";
import { PasswordForm } from "../password-form";

export default async function ProfileSettingsPage() {
  const user = await requireUser();
  const { dict: t, tr } = await getT();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-5 sm:p-6">
        <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <UserCircle className="size-4" />
          {tr("Mening profilim", "My profile")}
          <StatusPill tone="gold" className="ml-auto normal-case">
            {t.role[user.role]}
          </StatusPill>
        </h2>
        <ProfileForm
          name={user.name}
          email={user.email}
          locale={user.locale}
          avatarColor={user.avatarColor}
        />
      </Card>

      <Card className="h-fit p-5 sm:p-6">
        <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <KeyRound className="size-4" />
          {tr("Parolni o'zgartirish", "Change password")}
        </h2>
        <PasswordForm />
      </Card>
    </div>
  );
}
