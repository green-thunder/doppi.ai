import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  CircleDollarSign,
  Clock,
  GitBranch,
  Pencil,
  Tag,
  UserCircle,
  UserSquare,
} from "lucide-react";
import { requireUser } from "@/lib/crm/auth";
import { getT } from "@/lib/crm/i18n-server";
import { getDeal } from "@/lib/crm/data/deals";
import { asCustomFields, listFields } from "@/lib/crm/data/custom-fields";
import {
  getCompanyOptions,
  getContactOptions,
  getMemberOptions,
  getStageOptions,
} from "@/lib/crm/data/lookups";
import { formatDate, formatMoney, fullName } from "@/lib/crm/format";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { DetailList, DetailRow } from "@/components/crm/detail-list";
import { CustomFieldValues } from "@/components/crm/custom-field-values";
import { ConfirmDelete } from "@/components/crm/confirm-delete";
import { DealFormDialog, type DealValue } from "../deal-form-dialog";
import { deleteDealAction } from "../actions";

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const { locale, dict: t, tr } = await getT();

  const deal = await getDeal(user.orgId, id);
  if (!deal) notFound();

  const [stageOptions, contactOptions, companyOptions, memberOptions, fieldDefs] =
    await Promise.all([
      getStageOptions(user.orgId),
      getContactOptions(user.orgId),
      getCompanyOptions(user.orgId),
      getMemberOptions(user.orgId),
      listFields(user.orgId, "DEAL"),
    ]);

  const contactName = deal.contact ? fullName(deal.contact.firstName, deal.contact.lastName) : null;
  const customValues = asCustomFields(deal.customFields);

  const editValue: DealValue = {
    id: deal.id,
    title: deal.title,
    amount: deal.amount,
    currency: deal.currency,
    stageId: deal.stageId,
    status: deal.status,
    contactId: deal.contactId,
    companyId: deal.companyId,
    ownerId: deal.ownerId,
    expectedCloseDate: deal.expectedCloseDate ? deal.expectedCloseDate.toISOString() : null,
    customFields: customValues,
  };

  return (
    <div className="space-y-6">
      <Link
        href="/crm/deals"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t.nav.deals}
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill color={deal.stage.color}>{deal.stage.name}</StatusPill>
            <StatusPill
              tone={deal.status === "WON" ? "green" : deal.status === "LOST" ? "red" : "gold"}
            >
              {t.dealStatus[deal.status]}
            </StatusPill>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground">
            {deal.title}
          </h1>
          <p className="mt-1 text-lg font-semibold text-gold-300">
            {formatMoney(deal.amount, deal.currency, locale)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DealFormDialog
            mode="edit"
            deal={editValue}
            stageOptions={stageOptions}
            contactOptions={contactOptions}
            companyOptions={companyOptions}
            memberOptions={memberOptions}
            defaultCurrency={user.org.currency}
            trigger={
              <Button variant="secondary" size="sm">
                <Pencil className="size-4" />
                {t.action.edit}
              </Button>
            }
          />
          <ConfirmDelete action={deleteDealAction} id={deal.id} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left — details */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="p-5">
            <h2 className="mb-1 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {tr("Ma'lumot", "Details")}
            </h2>
            <DetailList>
              <DetailRow label={tr("Summa", "Amount")} icon={<CircleDollarSign className="size-4" />}>
                {formatMoney(deal.amount, deal.currency, locale)}
              </DetailRow>
              <DetailRow label={t.nav.pipeline} icon={<GitBranch className="size-4" />}>
                <StatusPill color={deal.stage.color}>{deal.stage.name}</StatusPill>
              </DetailRow>
              <DetailRow label={t.common.status} icon={<Tag className="size-4" />}>
                <StatusPill
                  tone={deal.status === "WON" ? "green" : deal.status === "LOST" ? "red" : "gold"}
                >
                  {t.dealStatus[deal.status]}
                </StatusPill>
              </DetailRow>
              <DetailRow label={t.nav.contacts} icon={<UserSquare className="size-4" />}>
                {deal.contact ? (
                  <Link href={`/crm/contacts/${deal.contact.id}`} className="hover:text-gold-300">
                    {contactName}
                  </Link>
                ) : (
                  "—"
                )}
              </DetailRow>
              <DetailRow label={t.nav.companies} icon={<Building2 className="size-4" />}>
                {deal.company ? (
                  <Link href={`/crm/companies/${deal.company.id}`} className="hover:text-gold-300">
                    {deal.company.name}
                  </Link>
                ) : (
                  "—"
                )}
              </DetailRow>
              <DetailRow label={t.common.owner} icon={<UserCircle className="size-4" />}>
                {deal.owner?.name ?? t.common.unassigned}
              </DetailRow>
              <DetailRow
                label={tr("Yopilish sanasi", "Expected close")}
                icon={<CalendarClock className="size-4" />}
              >
                {deal.expectedCloseDate ? formatDate(deal.expectedCloseDate, locale) : "—"}
              </DetailRow>
              <DetailRow label={t.common.createdAt} icon={<Clock className="size-4" />}>
                {formatDate(deal.createdAt, locale)}
              </DetailRow>
              <CustomFieldValues defs={fieldDefs} values={customValues} locale={locale} />
            </DetailList>
          </Card>
        </div>

        {/* Right — related activities */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t.nav.activities} ({deal.activities.length})
            </h2>
            {deal.activities.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">{t.common.empty}</p>
            ) : (
              <ul className="divide-y divide-border">
                {deal.activities.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                    <span className="flex items-center gap-2">
                      <StatusPill tone={a.completed ? "green" : "gray"}>
                        {t.activityType[a.type]}
                      </StatusPill>
                      <span
                        className={
                          a.completed ? "text-muted-foreground line-through" : "text-foreground"
                        }
                      >
                        {a.subject}
                      </span>
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {a.dueDate ? formatDate(a.dueDate, locale) : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
