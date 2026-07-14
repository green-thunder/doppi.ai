import Link from "next/link";
import { CheckSquare, Plus } from "lucide-react";
import type { ActivityType } from "@prisma/client";
import { requireUser } from "@/lib/crm/auth";
import { getT } from "@/lib/crm/i18n-server";
import {
  listActivities,
  getDealOptions,
  type ActivityFilter,
} from "@/lib/crm/data/activities";
import { listViews } from "@/lib/crm/data/saved-views";
import { getContactOptions, getMemberOptions } from "@/lib/crm/data/lookups";
import { ACTIVITY_TYPES } from "@/lib/crm/constants";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/crm/page-header";
import { SearchInput } from "@/components/crm/search-input";
import { FilterBar, type FilterConfig } from "@/components/crm/filter-bar";
import { EmptyState } from "@/components/crm/empty-state";
import { Pagination } from "@/components/crm/pagination";
import { cn } from "@/lib/utils";
import { ActivityFormDialog } from "./activity-form-dialog";
import { ActivityList } from "./activity-list";

const FILTERS: ActivityFilter[] = ["upcoming", "all", "completed"];

function normalizeFilter(v: string | undefined): ActivityFilter {
  return v === "all" || v === "completed" ? v : "upcoming";
}

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    filter?: string;
    q?: string;
    page?: string;
    assigneeId?: string;
    type?: string;
  }>;
}) {
  const user = await requireUser();
  const { dict: t, tr } = await getT();
  const sp = await searchParams;
  const filter = normalizeFilter(sp.filter);
  const q = sp.q?.trim() || undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const assigneeId = sp.assigneeId || undefined;
  const type =
    sp.type && (ACTIVITY_TYPES as string[]).includes(sp.type)
      ? (sp.type as ActivityType)
      : undefined;

  const [{ items, total, pageCount }, memberOptions, contactOptions, dealOptions, views] =
    await Promise.all([
      listActivities(user.orgId, { filter, q, page, assigneeId, type }),
      getMemberOptions(user.orgId),
      getContactOptions(user.orgId),
      getDealOptions(user.orgId),
      listViews(user.orgId, "ACTIVITY", user.id),
    ]);

  const filterConfig: FilterConfig[] = [
    { key: "assigneeId", label: tr("Mas'ul", "Assignee"), options: memberOptions },
    {
      key: "type",
      label: tr("Turi", "Type"),
      options: ACTIVITY_TYPES.map((ty) => ({ value: ty, label: t.activityType[ty] })),
    },
  ];
  const viewChips = views.map((v) => ({
    id: v.id,
    name: v.name,
    filters: (v.filters ?? {}) as Record<string, string>,
  }));

  const listItems = items.map((a) => ({
    id: a.id,
    type: a.type,
    subject: a.subject,
    notes: a.notes,
    dueDate: a.dueDate ? a.dueDate.toISOString() : null,
    completed: a.completed,
    contact: a.contact
      ? { firstName: a.contact.firstName, lastName: a.contact.lastName }
      : null,
    deal: a.deal ? { title: a.deal.title } : null,
    assignee: a.assignee
      ? { name: a.assignee.name, avatarColor: a.assignee.avatarColor }
      : null,
    assigneeId: a.assigneeId,
    contactId: a.contactId,
    dealId: a.dealId,
  }));

  const filterLabel: Record<ActivityFilter, string> = {
    upcoming: tr("Rejadagi", "Upcoming"),
    all: t.common.all,
    completed: tr("Bajarilgan", "Completed"),
  };

  const filterHref = (f: ActivityFilter) => {
    const params = new URLSearchParams();
    params.set("filter", f);
    if (q) params.set("q", q);
    if (assigneeId) params.set("assigneeId", assigneeId);
    if (type) params.set("type", type);
    return `/crm/activities?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.nav.activities}
        subtitle={tr(
          `${total} ta vazifa`,
          `${total} activit${total === 1 ? "y" : "ies"}`,
        )}
      >
        <ActivityFormDialog
          mode="create"
          memberOptions={memberOptions}
          contactOptions={contactOptions}
          dealOptions={dealOptions}
          trigger={
            <Button>
              <Plus className="size-4" />
              {tr("Yangi vazifa", "New activity")}
            </Button>
          }
        />
      </PageHeader>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1">
          {FILTERS.map((f) => (
            <Link
              key={f}
              href={filterHref(f)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                filter === f
                  ? "bg-gold-500/15 text-gold-300"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {filterLabel[f]}
            </Link>
          ))}
        </div>
        <div className="max-w-sm sm:w-72">
          <SearchInput placeholder={tr("Vazifalarni qidirish...", "Search activities...")} />
        </div>
      </div>

      <FilterBar entity="ACTIVITY" filters={filterConfig} views={viewChips} />

      {listItems.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="size-6" />}
          title={q ? t.common.noResults : tr("Hali vazifa yo'q", "No activities yet")}
          description={
            q
              ? tr("Boshqa so'z bilan qidiring", "Try a different search")
              : tr("Birinchi vazifangizni qo'shing", "Add your first activity")
          }
        />
      ) : (
        <ActivityList
          items={listItems}
          memberOptions={memberOptions}
          contactOptions={contactOptions}
          dealOptions={dealOptions}
        />
      )}

      <Pagination page={page} pageCount={pageCount} />
    </div>
  );
}
