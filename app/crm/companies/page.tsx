import Link from "next/link";
import { Building2, Download, Plus } from "lucide-react";
import { requireUser } from "@/lib/crm/auth";
import { getT } from "@/lib/crm/i18n-server";
import { listCompanies } from "@/lib/crm/data/companies";
import { listViews } from "@/lib/crm/data/saved-views";
import { getMemberOptions } from "@/lib/crm/data/lookups";
import { INDUSTRIES } from "@/lib/crm/constants";
import { formatDate } from "@/lib/crm/format";
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
import { CompanyFormDialog } from "./company-form-dialog";
import { CompanyRowActions } from "./company-row-actions";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; ownerId?: string; industry?: string }>;
}) {
  const user = await requireUser();
  const { locale, dict: t, tr } = await getT();
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const ownerId = sp.ownerId || undefined;
  const industry = sp.industry || undefined;

  const [{ items, total, pageCount }, memberOptions, views] = await Promise.all([
    listCompanies(user.orgId, { q, page, ownerId, industry }),
    getMemberOptions(user.orgId),
    listViews(user.orgId, "COMPANY", user.id),
  ]);

  const filterConfig: FilterConfig[] = [
    { key: "ownerId", label: t.common.owner, options: memberOptions },
    {
      key: "industry",
      label: tr("Soha", "Industry"),
      options: INDUSTRIES.map((i) => ({ value: i, label: i })),
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
        title={t.nav.companies}
        subtitle={tr(
          `${total} ta kompaniya`,
          `${total} compan${total === 1 ? "y" : "ies"}`,
        )}
      >
        <Button asChild variant="secondary">
          <a href="/api/crm/export/companies" download>
            <Download className="size-4" />
            {tr("Eksport", "Export")}
          </a>
        </Button>
        <CompanyFormDialog
          mode="create"
          memberOptions={memberOptions}
          trigger={
            <Button>
              <Plus className="size-4" />
              {tr("Yangi kompaniya", "New company")}
            </Button>
          }
        />
      </PageHeader>

      <div className="space-y-4">
        <div className="max-w-sm">
          <SearchInput placeholder={tr("Kompaniyalarni qidirish...", "Search companies...")} />
        </div>
        <FilterBar entity="COMPANY" filters={filterConfig} views={viewChips} />
      </div>

      <Card className="overflow-hidden">
        {items.length === 0 ? (
          <EmptyState
            icon={<Building2 className="size-6" />}
            title={q ? t.common.noResults : tr("Hali kompaniya yo'q", "No companies yet")}
            description={
              q
                ? tr("Boshqa so'z bilan qidiring", "Try a different search")
                : tr("Birinchi kompaniyangizni qo'shing", "Add your first company")
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.common.name}</TableHead>
                <TableHead className="hidden md:table-cell">{tr("Soha", "Industry")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t.common.phone}</TableHead>
                <TableHead className="hidden sm:table-cell">{t.common.owner}</TableHead>
                <TableHead className="hidden lg:table-cell">{t.nav.contacts}</TableHead>
                <TableHead className="hidden lg:table-cell">{t.common.createdAt}</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link
                      href={`/crm/companies/${c.id}`}
                      className="flex items-center gap-3 hover:text-gold-300"
                    >
                      <InitialsAvatar
                        name={c.name}
                        color={c.owner?.avatarColor ?? "#E6A92C"}
                        className="size-8"
                      />
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-foreground">
                          {c.name}
                        </span>
                        {c.website && (
                          <span className="block truncate text-xs text-muted-foreground">
                            {c.website}
                          </span>
                        )}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {c.industry ?? "—"}
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
                    {c._count.contacts}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {formatDate(c.createdAt, locale)}
                  </TableCell>
                  <TableCell>
                    <CompanyRowActions
                      company={{
                        id: c.id,
                        name: c.name,
                        website: c.website,
                        industry: c.industry,
                        phone: c.phone,
                        email: c.email,
                        address: c.address,
                        notes: c.notes,
                        ownerId: c.ownerId,
                        customFields: c.customFields as Record<string, unknown>,
                      }}
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
