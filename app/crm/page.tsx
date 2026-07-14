import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  Handshake,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { requireUser } from "@/lib/crm/auth";
import { getT } from "@/lib/crm/i18n-server";
import { getDashboard } from "@/lib/crm/data/dashboard";
import {
  formatDate,
  formatMoneyCompact,
  formatNumber,
  fromNow,
  fullName,
} from "@/lib/crm/format";
import { Card } from "@/components/ui/card";
import { InitialsAvatar } from "@/components/ui/avatar";
import { StatCard } from "./_dashboard/stat-card";
import { StageBarChart, type StageBar } from "./_dashboard/charts";

export default async function DashboardPage() {
  const user = await requireUser();
  const { locale, dict: t, tr } = await getT();
  const currency = user.org.currency;

  const d = await getDashboard(user.orgId);

  const winRatePct = `${Math.round(d.winRate * 100)}%`;

  const stageData: StageBar[] = d.dealsByStage.map((s) => ({
    label: s.name,
    value: s.value,
    valueLabel: formatMoneyCompact(s.value, currency, locale),
    count: s.count,
    color: s.color,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-medium text-gold-400">
            <Sparkles className="size-4" />
            {t.nav.dashboard}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-foreground">
            {tr("Xush kelibsiz", "Welcome back")}, {user.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.org.name}</p>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          accent="gold"
          icon={<TrendingUp className="size-5" />}
          label={tr("Voronka qiymati", "Pipeline value")}
          value={formatMoneyCompact(d.pipelineValue, currency, locale)}
          hint={tr(
            `${d.openDealsCount} ta ochiq bitim`,
            `across ${d.openDealsCount} open deal${d.openDealsCount === 1 ? "" : "s"}`,
          )}
        />
        <StatCard
          accent="green"
          icon={<Trophy className="size-5" />}
          label={tr("Shu oy yutilgan", "Won this month")}
          value={formatMoneyCompact(d.wonValueMonth, currency, locale)}
          hint={tr(
            `Jami ${formatNumber(d.wonCount, locale)} ta g'alaba`,
            `${formatNumber(d.wonCount, locale)} wins all-time`,
          )}
        />
        <StatCard
          accent="blue"
          icon={<Handshake className="size-5" />}
          label={tr("Ochiq bitimlar", "Open deals")}
          value={formatNumber(d.openDealsCount, locale)}
          hint={tr(
            `${formatNumber(d.contactsCount, locale)} kontakt · ${formatNumber(d.companiesCount, locale)} kompaniya`,
            `${formatNumber(d.contactsCount, locale)} contacts · ${formatNumber(d.companiesCount, locale)} companies`,
          )}
        />
        <StatCard
          accent="gold"
          icon={<Target className="size-5" />}
          label={tr("G'alaba darajasi", "Win rate")}
          value={winRatePct}
          hint={tr(
            `${d.wonCount} yutilgan / ${d.lostCount} yo'qotilgan`,
            `${d.wonCount} won / ${d.lostCount} lost`,
          )}
        />
      </div>

      {/* Pipeline chart + upcoming activities */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: pipeline by stage */}
        <Card className="p-5 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-semibold text-foreground">
                {tr("Bosqichlar bo'yicha voronka", "Pipeline by stage")}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {tr("Ochiq bitimlar qiymati", "Open deal value")}
              </p>
            </div>
            <Link
              href="/crm/deals"
              className="inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground hover:text-gold-300"
            >
              {t.action.viewAll}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <StageBarChart data={stageData} emptyLabel={t.common.empty} />
        </Card>

        {/* Right: upcoming activities */}
        <Card className="flex flex-col p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
              <CalendarClock className="size-4 text-gold-400" />
              {tr("Yaqin vazifalar", "Upcoming tasks")}
            </h2>
            <Link
              href="/crm/activities"
              className="inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground hover:text-gold-300"
            >
              {t.action.viewAll}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          {d.upcomingActivities.length === 0 ? (
            <p className="flex-1 py-8 text-center text-sm text-muted-foreground">
              {t.common.empty}
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {d.upcomingActivities.map((a) => {
                const related =
                  a.deal?.title ??
                  (a.contact ? fullName(a.contact.firstName, a.contact.lastName) : null);
                return (
                  <li key={a.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    {a.assignee ? (
                      <InitialsAvatar
                        name={a.assignee.name}
                        color={a.assignee.avatarColor}
                        className="size-8"
                      />
                    ) : (
                      <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-foreground/[0.06] text-xs text-muted-foreground">
                        {t.activityType[a.type].slice(0, 1)}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{a.subject}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {[t.activityType[a.type], related].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {a.dueDate ? formatDate(a.dueDate, locale) : "—"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      {/* Recent contacts */}
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-base font-semibold text-foreground">
            {tr("So'nggi kontaktlar", "Recent contacts")}
          </h2>
          <Link
            href="/crm/contacts"
            className="inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground hover:text-gold-300"
          >
            {t.action.viewAll}
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        {d.recentContacts.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {tr("Hali kontakt yo'q", "No contacts yet")}
          </p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {d.recentContacts.map((c) => {
              const name = fullName(c.firstName, c.lastName);
              return (
                <li key={c.id}>
                  <Link
                    href={`/crm/contacts/${c.id}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card/40 p-3 transition-colors hover:border-gold-500/30 hover:bg-gold-500/[0.04]"
                  >
                    <InitialsAvatar
                      name={name}
                      color={c.owner?.avatarColor ?? "#E6A92C"}
                      className="size-9"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {c.company?.name ?? tr("Kompaniyasiz", "No company")}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {fromNow(c.createdAt, locale)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
