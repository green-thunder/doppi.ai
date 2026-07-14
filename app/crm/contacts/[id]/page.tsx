import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Mail,
  Pencil,
  Phone,
  Tag,
  UserCircle,
} from "lucide-react";
import { requireUser } from "@/lib/crm/auth";
import { getT } from "@/lib/crm/i18n-server";
import { getContact } from "@/lib/crm/data/contacts";
import { asCustomFields, listFields } from "@/lib/crm/data/custom-fields";
import { getCompanyOptions, getMemberOptions } from "@/lib/crm/data/lookups";
import { formatDate, formatMoney, fullName } from "@/lib/crm/format";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InitialsAvatar } from "@/components/ui/avatar";
import { StatusPill } from "@/components/ui/status-pill";
import { DetailList, DetailRow } from "@/components/crm/detail-list";
import { CustomFieldValues } from "@/components/crm/custom-field-values";
import { ConfirmDelete } from "@/components/crm/confirm-delete";
import { EmptyState } from "@/components/crm/empty-state";
import { ContactFormDialog } from "../contact-form-dialog";
import { deleteContactAction } from "../actions";

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const { locale, dict: t, tr } = await getT();

  const contact = await getContact(user.orgId, id);
  if (!contact) notFound();

  const [companyOptions, memberOptions, fieldDefs] = await Promise.all([
    getCompanyOptions(user.orgId),
    getMemberOptions(user.orgId),
    listFields(user.orgId, "CONTACT"),
  ]);

  const name = fullName(contact.firstName, contact.lastName);
  const customValues = asCustomFields(contact.customFields);

  return (
    <div className="space-y-6">
      <Link
        href="/crm/contacts"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t.nav.contacts}
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <InitialsAvatar
            name={name}
            color={contact.owner?.avatarColor ?? "#E6A92C"}
            className="size-14"
          />
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {[contact.position, contact.company?.name].filter(Boolean).join(" · ") || "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ContactFormDialog
            mode="edit"
            contact={{
              id: contact.id,
              firstName: contact.firstName,
              lastName: contact.lastName,
              email: contact.email,
              phone: contact.phone,
              position: contact.position,
              source: contact.source,
              tags: contact.tags,
              notes: contact.notes,
              companyId: contact.companyId,
              ownerId: contact.ownerId,
              customFields: customValues,
            }}
            companyOptions={companyOptions}
            memberOptions={memberOptions}
            trigger={
              <Button variant="secondary" size="sm">
                <Pencil className="size-4" />
                {t.action.edit}
              </Button>
            }
          />
          <ConfirmDelete action={deleteContactAction} id={contact.id} />
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
              <DetailRow label={t.common.email} icon={<Mail className="size-4" />}>
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="hover:text-gold-300">
                    {contact.email}
                  </a>
                ) : (
                  "—"
                )}
              </DetailRow>
              <DetailRow label={t.common.phone} icon={<Phone className="size-4" />}>
                {contact.phone ? (
                  <a href={`tel:${contact.phone}`} className="hover:text-gold-300">
                    {contact.phone}
                  </a>
                ) : (
                  "—"
                )}
              </DetailRow>
              <DetailRow label={tr("Lavozim", "Position")} icon={<Briefcase className="size-4" />}>
                {contact.position ?? "—"}
              </DetailRow>
              <DetailRow label={t.nav.companies} icon={<Building2 className="size-4" />}>
                {contact.company ? (
                  <Link href={`/crm/companies/${contact.company.id}`} className="hover:text-gold-300">
                    {contact.company.name}
                  </Link>
                ) : (
                  "—"
                )}
              </DetailRow>
              <DetailRow label={t.common.owner} icon={<UserCircle className="size-4" />}>
                {contact.owner?.name ?? t.common.unassigned}
              </DetailRow>
              <DetailRow label={tr("Manba", "Source")} icon={<Tag className="size-4" />}>
                <StatusPill tone="gold">{t.source[contact.source]}</StatusPill>
              </DetailRow>
              <CustomFieldValues defs={fieldDefs} values={customValues} locale={locale} />
            </DetailList>

            {contact.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {contact.tags.map((tag) => (
                  <StatusPill key={tag} tone="gray">
                    {tag}
                  </StatusPill>
                ))}
              </div>
            )}

            {contact.notes && (
              <p className="mt-4 whitespace-pre-wrap border-t border-border pt-4 text-sm text-muted-foreground">
                {contact.notes}
              </p>
            )}
          </Card>
        </div>

        {/* Right — related deals + activities */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t.nav.deals} ({contact.deals.length})
            </h2>
            {contact.deals.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">{t.common.empty}</p>
            ) : (
              <ul className="divide-y divide-border">
                {contact.deals.map((deal) => (
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

          <Card className="p-5">
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t.nav.activities} ({contact.activities.length})
            </h2>
            {contact.activities.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">{t.common.empty}</p>
            ) : (
              <ul className="divide-y divide-border">
                {contact.activities.map((a) => (
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
