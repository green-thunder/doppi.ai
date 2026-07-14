import Link from "next/link";
import { Download, Plus, Upload, Users } from "lucide-react";
import type { LeadSource } from "@prisma/client";
import { requireUser } from "@/lib/crm/auth";
import { getT } from "@/lib/crm/i18n-server";
import { listContacts } from "@/lib/crm/data/contacts";
import { listViews } from "@/lib/crm/data/saved-views";
import { getCompanyOptions, getMemberOptions } from "@/lib/crm/data/lookups";
import { LEAD_SOURCES } from "@/lib/crm/constants";
import { formatDate, fullName } from "@/lib/crm/format";
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
import { PageHeader } from "@/components/crm/page-header";
import { SearchInput } from "@/components/crm/search-input";
import { FilterBar, type FilterConfig } from "@/components/crm/filter-bar";
import { EmptyState } from "@/components/crm/empty-state";
import { Pagination } from "@/components/crm/pagination";
import { ContactFormDialog } from "./contact-form-dialog";
import { ContactRowActions } from "./contact-row-actions";
import { ImportDialog } from "./import-dialog";

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; ownerId?: string; source?: string }>;
}) {
  const user = await requireUser();
  const { locale, dict: t, tr } = await getT();
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const ownerId = sp.ownerId || undefined;
  const source =
    sp.source && (LEAD_SOURCES as string[]).includes(sp.source)
      ? (sp.source as LeadSource)
      : undefined;

  const [{ items, total, pageCount }, companyOptions, memberOptions, views] =
    await Promise.all([
      listContacts(user.orgId, { q, page, ownerId, source }),
      getCompanyOptions(user.orgId),
      getMemberOptions(user.orgId),
      listViews(user.orgId, "CONTACT", user.id),
    ]);

  const filterConfig: FilterConfig[] = [
    { key: "ownerId", label: t.common.owner, options: memberOptions },
    {
      key: "source",
      label: tr("Manba", "Source"),
      options: LEAD_SOURCES.map((s) => ({ value: s, label: t.source[s] })),
    },
  ];
  const viewChips = views.map((v) => ({
    id: v.id,
    name: v.name,
    filters: (v.filters ?? {}) as Record<string, string>,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.nav.contacts}
        subtitle={tr(
          `${total} ta kontakt`,
          `${total} contact${total === 1 ? "" : "s"}`,
        )}
      >
        <Button asChild variant="secondary">
          <a href="/api/crm/export/contacts" download>
            <Download className="size-4" />
            {tr("Eksport", "Export")}
          </a>
        </Button>
        <ImportDialog
          trigger={
            <Button variant="secondary">
              <Upload className="size-4" />
              {tr("Import", "Import")}
            </Button>
          }
        />
        <ContactFormDialog
          mode="create"
          companyOptions={companyOptions}
          memberOptions={memberOptions}
          trigger={
            <Button>
              <Plus className="size-4" />
              {tr("Yangi kontakt", "New contact")}
            </Button>
          }
        />
      </PageHeader>

      <div className="space-y-4">
        <div className="max-w-sm">
          <SearchInput placeholder={tr("Kontaktlarni qidirish...", "Search contacts...")} />
        </div>
        <FilterBar entity="CONTACT" filters={filterConfig} views={viewChips} />
      </div>

      <Card className="overflow-hidden">
        {items.length === 0 ? (
          <EmptyState
            icon={<Users className="size-6" />}
            title={q ? t.common.noResults : tr("Hali kontakt yo'q", "No contacts yet")}
            description={
              q
                ? tr("Boshqa so'z bilan qidiring", "Try a different search")
                : tr("Birinchi kontaktingizni qo'shing", "Add your first contact")
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.common.name}</TableHead>
                <TableHead className="hidden md:table-cell">{t.nav.companies}</TableHead>
                <TableHead className="hidden lg:table-cell">{t.common.phone}</TableHead>
                <TableHead className="hidden sm:table-cell">{t.common.owner}</TableHead>
                <TableHead className="hidden lg:table-cell">{t.common.createdAt}</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link
                      href={`/crm/contacts/${c.id}`}
                      className="flex items-center gap-3 hover:text-gold-300"
                    >
                      <InitialsAvatar
                        name={fullName(c.firstName, c.lastName)}
                        color={c.owner?.avatarColor ?? "#E6A92C"}
                        className="size-8"
                      />
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-foreground">
                          {fullName(c.firstName, c.lastName)}
                        </span>
                        {c.email && (
                          <span className="block truncate text-xs text-muted-foreground">
                            {c.email}
                          </span>
                        )}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {c.company?.name ?? "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {c.phone ?? "—"}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {c.owner ? (
                      <span className="inline-flex items-center gap-2">
                        <InitialsAvatar
                          name={c.owner.name}
                          color={c.owner.avatarColor}
                          className="size-6"
                        />
                        <span className="text-sm text-muted-foreground">{c.owner.name}</span>
                      </span>
                    ) : (
                      <StatusPill tone="gray">{t.common.unassigned}</StatusPill>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {formatDate(c.createdAt, locale)}
                  </TableCell>
                  <TableCell>
                    <ContactRowActions
                      contact={{
                        id: c.id,
                        firstName: c.firstName,
                        lastName: c.lastName,
                        email: c.email,
                        phone: c.phone,
                        position: c.position,
                        source: c.source,
                        tags: c.tags,
                        notes: c.notes,
                        companyId: c.companyId,
                        ownerId: c.ownerId,
                        customFields: c.customFields as Record<string, unknown>,
                      }}
                      companyOptions={companyOptions}
                      memberOptions={memberOptions}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Pagination page={page} pageCount={pageCount} />
    </div>
  );
}
