import { Building2 } from "lucide-react";
import { requireAdmin } from "@/lib/crm/auth";
import { getT } from "@/lib/crm/i18n-server";
import { formatDate } from "@/lib/crm/format";
import { Card } from "@/components/ui/card";
import { DetailList, DetailRow } from "@/components/crm/detail-list";
import { OrgForm } from "./org-form";

export default async function SettingsGeneralPage() {
  const user = await requireAdmin();
  const { locale, tr } = await getT();
  const org = user.org;

  return (
    <div className="space-y-6">
      <Card className="p-5 sm:p-6">
        <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {tr("Tashkilot", "Organization")}
        </h2>
        <OrgForm name={org.name} currency={org.currency} />
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="mb-1 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {tr("Ma'lumot", "Details")}
        </h2>
        <DetailList>
          <DetailRow label={tr("Manzil (slug)", "Slug")} icon={<Building2 className="size-4" />}>
            <span className="font-mono text-xs text-muted-foreground">{org.slug}</span>
          </DetailRow>
          <DetailRow label={tr("Yaratilgan sana", "Created")}>
            {formatDate(org.createdAt, locale)}
          </DetailRow>
        </DetailList>
      </Card>
    </div>
  );
}
