import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Factory,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Phone,
  UserCircle,
} from "lucide-react";
import { requireUser } from "@/lib/crm/auth";
import { getT } from "@/lib/crm/i18n-server";
import { getCompany } from "@/lib/crm/data/companies";
import { asCustomFields, listFields } from "@/lib/crm/data/custom-fields";
import { getMemberOptions } from "@/lib/crm/data/lookups";
import { formatMoney, fullName } from "@/lib/crm/format";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InitialsAvatar } from "@/components/ui/avatar";
import { StatusPill } from "@/components/ui/status-pill";
import { DetailList, DetailRow } from "@/components/crm/detail-list";
import { CustomFieldValues } from "@/components/crm/custom-field-values";
import { ConfirmDelete } from "@/components/crm/confirm-delete";
import { CompanyFormDialog } from "../company-form-dialog";
import { deleteCompanyAction } from "../actions";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const { locale, dict: t, tr } = await getT();

  const company = await getCompany(user.orgId, id);
  if (!company) notFound();

  const [memberOptions, fieldDefs] = await Promise.all([
    getMemberOptions(user.orgId),
    listFields(user.orgId, "COMPANY"),
  ]);
  const customValues = asCustomFields(company.customFields);

  return (
    <div className="space-y-6">
      <Link
        href="/crm/companies"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t.nav.companies}
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <InitialsAvatar
            name={company.name}
            color={company.owner?.avatarColor ?? "#E6A92C"}
            className="size-14"
          />
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {company.name}
            </h1>
            <p className="text-sm text-muted-foreground">{company.industry ?? "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CompanyFormDialog
            mode="edit"
            company={{
              id: company.id,
              name: company.name,
              website: company.website,
              industry: company.industry,
              phone: company.phone,
              email: company.email,
              address: company.address,
              notes: company.notes,
              ownerId: company.ownerId,
              customFields: customValues,
            }}
            memberOptions={memberOptions}
            trigger={
              <Button variant="secondary" size="sm">
                <Pencil className="size-4" />
                {t.action.edit}
              </Button>
            }
          />
          <ConfirmDelete action={deleteCompanyAction} id={company.id} />
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
              <DetailRow label={tr("Vebsayt", "Website")} icon={<Globe className="size-4" />}>
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-gold-300"
                  >
                    {company.website}
                  </a>
                ) : (
                  "—"
                )}
              </DetailRow>
              <DetailRow label={t.common.phone} icon={<Phone className="size-4" />}>
                {company.phone ? (
                  <a href={`tel:${company.phone}`} className="hover:text-gold-300">
                    {company.phone}
                  </a>
                ) : (
                  "—"
                )}
              </DetailRow>
              <DetailRow label={t.common.email} icon={<Mail className="size-4" />}>
                {company.email ? (
                  <a href={`mailto:${company.email}`} className="hover:text-gold-300">
                    {company.email}
                  </a>
                ) : (
                  "—"
                )}
              </DetailRow>
              <DetailRow label={tr("Manzil", "Address")} icon={<MapPin className="size-4" />}>
                {company.address ?? "—"}
              </DetailRow>
              <DetailRow label={t.common.owner} icon={<UserCircle className="size-4" />}>
                {company.owner?.name ?? t.common.unassigned}
              </DetailRow>
              <DetailRow label={tr("Soha", "Industry")} icon={<Factory className="size-4" />}>
                {company.industry ? (
                  <StatusPill tone="gold">{company.industry}</StatusPill>
                ) : (
                  "—"
                )}
              </DetailRow>
              <CustomFieldValues defs={fieldDefs} values={customValues} locale={locale} />
            </DetailList>

            {company.notes && (
              <p className="mt-4 whitespace-pre-wrap border-t border-border pt-4 text-sm text-muted-foreground">
                {company.notes}
              </p>
            )}
          </Card>
        </div>

        {/* Right — related contacts + deals */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t.nav.contacts} ({company._count.contacts})
            </h2>
            {company.contacts.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">{t.common.empty}</p>
            ) : (
              <ul className="divide-y divide-border">
                {company.contacts.map((contact) => (
                  <li key={contact.id}>
                    <Link
                      href={`/crm/contacts/${contact.id}`}
                      className="flex items-center justify-between gap-3 py-3 hover:text-gold-300"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <InitialsAvatar
                          name={fullName(contact.firstName, contact.lastName)}
                          color={contact.owner?.avatarColor ?? "#E6A92C"}
                          className="size-8"
                        />
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-foreground">
                            {fullName(contact.firstName, contact.lastName)}
                          </span>
                          {contact.position && (
                            <span className="block truncate text-xs text-muted-foreground">
                              {contact.position}
                            </span>
                          )}
                        </span>
                      </span>
                      {contact.email && (
                        <span className="hidden text-sm text-muted-foreground sm:inline">
                          {contact.email}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t.nav.deals} ({company._count.deals})
            </h2>
            {company.deals.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">{t.common.empty}</p>
            ) : (
              <ul className="divide-y divide-border">
                {company.deals.map((deal) => (
                  <li key={deal.id}>
                    <Link
                      href={`/crm/deals/${deal.id}`}
                      className="flex items-center justify-between gap-3 py-3 hover:text-gold-300"
                    >
                      <span className="flex items-center gap-2">
                        <StatusPill color={deal.stage.color}>{deal.stage.name}</StatusPill>
                        <span className="font-medium text-foreground">{deal.title}</span>
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatMoney(deal.amount, deal.currency, locale)}
                      </span>
                    </Link>
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
