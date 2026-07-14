import { requireUser } from "@/lib/crm/auth";
import { getT } from "@/lib/crm/i18n-server";
import { isAdmin } from "@/lib/crm/rbac";
import { PageHeader } from "@/components/crm/page-header";
import { SettingsTabs } from "./settings-tabs";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const { dict: t, tr } = await getT();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title={t.nav.settings}
        subtitle={tr(
          "Tashkilot va profil sozlamalari",
          "Organization and profile settings",
        )}
      />
      <SettingsTabs isAdmin={isAdmin(user.role)} />
      {children}
    </div>
  );
}
