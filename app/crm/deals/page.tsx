import { Download, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { requireUser } from "@/lib/crm/auth";
import { getT } from "@/lib/crm/i18n-server";
import { getBoard } from "@/lib/crm/data/deals";
import {
  getCompanyOptions,
  getContactOptions,
  getMemberOptions,
  getStageOptions,
} from "@/lib/crm/data/lookups";
import { formatMoney, fullName } from "@/lib/crm/format";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/crm/page-header";
import { EmptyState } from "@/components/crm/empty-state";
import { DealFormDialog } from "./deal-form-dialog";
import { DealBoard, type BoardCard, type BoardStage } from "./deal-board";

export default async function DealsPage() {
  const user = await requireUser();
  const { locale, dict: t, tr } = await getT();

  const [{ stages, dealsByStage, totals, pipelineValue }, stageOptions, contactOptions, companyOptions, memberOptions] =
    await Promise.all([
      getBoard(user.orgId),
      getStageOptions(user.orgId),
      getContactOptions(user.orgId),
      getCompanyOptions(user.orgId),
      getMemberOptions(user.orgId),
    ]);

  const boardStages: BoardStage[] = stages.map((s) => ({
    id: s.id,
    name: s.name,
    color: s.color,
    order: s.order,
    isWon: s.isWon,
    isLost: s.isLost,
  }));

  const boardDealsByStage: Record<string, BoardCard[]> = {};
  for (const stageId of Object.keys(dealsByStage)) {
    boardDealsByStage[stageId] = dealsByStage[stageId].map((d) => ({
      id: d.id,
      title: d.title,
      amount: d.amount,
      currency: d.currency,
      stageId: d.stageId,
      status: d.status,
      contactId: d.contactId,
      companyId: d.companyId,
      ownerId: d.ownerId,
      expectedCloseDate: d.expectedCloseDate ? d.expectedCloseDate.toISOString() : null,
      contactName: d.contact ? fullName(d.contact.firstName, d.contact.lastName) : null,
      companyName: d.company?.name ?? null,
      owner: d.owner
        ? { id: d.owner.id, name: d.owner.name, avatarColor: d.owner.avatarColor }
        : null,
      customFields: d.customFields as Record<string, unknown>,
    }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.nav.deals}
        subtitle={`${formatMoney(pipelineValue, user.org.currency, locale)}${tr(
          " ochiq voronka",
          " open pipeline",
        )}`}
      >
        <Button asChild variant="secondary">
          <a href="/api/crm/export/deals" download>
            <Download className="size-4" />
            {tr("Eksport", "Export")}
          </a>
        </Button>
        {boardStages.length > 0 && (
          <DealFormDialog
            mode="create"
            stageOptions={stageOptions}
            contactOptions={contactOptions}
            companyOptions={companyOptions}
            memberOptions={memberOptions}
            defaultCurrency={user.org.currency}
            trigger={
              <Button>
                <Plus className="size-4" />
                {tr("Yangi bitim", "New deal")}
              </Button>
            }
          />
        )}
      </PageHeader>

      {boardStages.length === 0 ? (
        <EmptyState
          icon={<Settings className="size-6" />}
          title={tr("Voronka sozlanmagan", "Pipeline not configured")}
          description={tr(
            "Bitimlar taxtasini ishlatishdan oldin Sozlamalarda bosqichlarni yarating.",
            "Configure your pipeline stages in Settings before using the deals board.",
          )}
          action={
            <Button variant="secondary" asChild>
              <Link href="/crm/settings">
                <Settings className="size-4" />
                {t.nav.settings}
              </Link>
            </Button>
          }
        />
      ) : (
        <DealBoard
          stages={boardStages}
          dealsByStage={boardDealsByStage}
          totals={totals}
          stageOptions={stageOptions}
          contactOptions={contactOptions}
          companyOptions={companyOptions}
          memberOptions={memberOptions}
          defaultCurrency={user.org.currency}
        />
      )}
    </div>
  );
}
