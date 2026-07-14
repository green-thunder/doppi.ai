import "server-only";
import { db } from "../db";

/** First instant of the current month (org-local approximation, server tz). */
function startOfMonth(now = new Date()): Date {
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
}

/**
 * Everything the CRM home dashboard needs, in a single tenant-scoped round of
 * queries. Returns plain numbers/arrays (no Prisma types leak into the page).
 */
export async function getDashboard(orgId: string) {
  const monthStart = startOfMonth();

  const [
    contactsCount,
    companiesCount,
    openDealsCount,
    pipelineAgg,
    wonMonthAgg,
    wonCount,
    lostCount,
    stages,
    activities,
    contacts,
  ] = await Promise.all([
    db.contact.count({ where: { orgId } }),
    db.company.count({ where: { orgId } }),
    db.deal.count({ where: { orgId, status: "OPEN" } }),
    db.deal.aggregate({ where: { orgId, status: "OPEN" }, _sum: { amount: true } }),
    db.deal.aggregate({
      where: { orgId, status: "WON", closedAt: { gte: monthStart } },
      _sum: { amount: true },
    }),
    db.deal.count({ where: { orgId, status: "WON" } }),
    db.deal.count({ where: { orgId, status: "LOST" } }),
    db.stage.findMany({
      where: { orgId },
      orderBy: { order: "asc" },
      select: { id: true, name: true, color: true },
    }),
    db.activity.findMany({
      where: { orgId, completed: false },
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
      take: 6,
      select: {
        id: true,
        type: true,
        subject: true,
        dueDate: true,
        contact: { select: { firstName: true, lastName: true } },
        deal: { select: { title: true } },
        assignee: { select: { name: true, avatarColor: true } },
      },
    }),
    db.contact.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        company: { select: { name: true } },
        owner: { select: { name: true, avatarColor: true } },
      },
    }),
  ]);

  // Per-stage OPEN totals (count + summed amount), preserving stage order.
  const stageAgg = await Promise.all(
    stages.map(async (s) => {
      const [count, agg] = await Promise.all([
        db.deal.count({ where: { orgId, stageId: s.id, status: "OPEN" } }),
        db.deal.aggregate({
          where: { orgId, stageId: s.id, status: "OPEN" },
          _sum: { amount: true },
        }),
      ]);
      return {
        id: s.id,
        name: s.name,
        color: s.color,
        count,
        value: agg._sum.amount ?? 0,
      };
    }),
  );

  const pipelineValue = pipelineAgg._sum.amount ?? 0;
  const wonValueMonth = wonMonthAgg._sum.amount ?? 0;
  const decided = wonCount + lostCount;
  const winRate = decided > 0 ? wonCount / decided : 0;

  return {
    contactsCount,
    companiesCount,
    openDealsCount,
    pipelineValue,
    wonValueMonth,
    wonCount,
    lostCount,
    winRate,
    dealsByStage: stageAgg,
    upcomingActivities: activities,
    recentContacts: contacts,
  };
}

export type DashboardData = Awaited<ReturnType<typeof getDashboard>>;
