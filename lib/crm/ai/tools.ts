import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import type { Prisma } from "@prisma/client";
import { db } from "../db";
import { getDashboard } from "../data/dashboard";
import { fullName } from "../format";

// Read-only tools the CRM assistant may call. CRITICAL: `orgId` is supplied by
// the server from the authenticated session — never by the model — so every
// query is tenant-scoped and the assistant can only ever see its own org's data.

export const CRM_TOOLS: Anthropic.Tool[] = [
  {
    name: "get_pipeline_summary",
    description:
      "Get an overview of the whole CRM: total open pipeline value, deals won this month, counts of contacts/companies/open deals, win rate, and a breakdown of deal value by pipeline stage. Use for questions like 'how are we doing', 'pipeline value', 'win rate', 'deals by stage'.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "search_contacts",
    description:
      "Search contacts by name, email, phone, or company name. Returns matching contacts with their company and owner. Use for questions about specific people or leads.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free-text search across name/email/phone/company." },
        limit: { type: "integer", description: "Max results (default 10, max 25)." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "search_deals",
    description:
      "List/search deals (opportunities). Filter by free-text title, status (OPEN/WON/LOST), or minimum amount. Returns title, amount, currency, stage, status, related contact/company, and owner. Use for questions about deals, biggest deals, open/won/lost deals.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free-text search across the deal title." },
        status: { type: "string", enum: ["OPEN", "WON", "LOST"], description: "Filter by deal status." },
        minAmount: { type: "number", description: "Only deals with amount >= this value." },
        limit: { type: "integer", description: "Max results (default 10, max 25)." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "search_companies",
    description:
      "Search companies by name, website, industry, or phone. Returns matching companies with contact/deal counts and owner. Use for questions about companies/accounts.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free-text search across company fields." },
        limit: { type: "integer", description: "Max results (default 10, max 25)." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "list_activities",
    description:
      "List tasks/activities. filter='upcoming' (not completed), 'completed', or 'all'. Returns type, subject, due date, related contact/deal, assignee, and completion state. Use for questions about tasks, follow-ups, overdue items.",
    input_schema: {
      type: "object",
      properties: {
        filter: { type: "string", enum: ["upcoming", "completed", "all"], description: "Which activities (default upcoming)." },
        limit: { type: "integer", description: "Max results (default 10, max 25)." },
      },
      additionalProperties: false,
    },
  },
];

const clampLimit = (v: unknown, def = 10) => {
  const n = typeof v === "number" ? Math.floor(v) : def;
  return Math.max(1, Math.min(25, isFinite(n) ? n : def));
};

const asStr = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Execute a tool call, always scoped to `orgId`. Returns JSON-serializable data. */
export async function runTool(
  orgId: string,
  name: string,
  input: Record<string, unknown>,
): Promise<unknown> {
  switch (name) {
    case "get_pipeline_summary": {
      const d = await getDashboard(orgId);
      return {
        pipelineValue: d.pipelineValue,
        wonValueThisMonth: d.wonValueMonth,
        openDeals: d.openDealsCount,
        wonCountAllTime: d.wonCount,
        lostCountAllTime: d.lostCount,
        winRate: Math.round(d.winRate * 100) / 100,
        contacts: d.contactsCount,
        companies: d.companiesCount,
        dealsByStage: d.dealsByStage.map((s) => ({ stage: s.name, count: s.count, value: s.value })),
      };
    }

    case "search_contacts": {
      const q = asStr(input.query);
      const rows = await db.contact.findMany({
        where: {
          orgId,
          ...(q
            ? {
                OR: [
                  { firstName: { contains: q, mode: "insensitive" } },
                  { lastName: { contains: q, mode: "insensitive" } },
                  { email: { contains: q, mode: "insensitive" } },
                  { phone: { contains: q } },
                  { company: { name: { contains: q, mode: "insensitive" } } },
                ],
              }
            : {}),
        },
        include: { company: { select: { name: true } }, owner: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: clampLimit(input.limit),
      });
      return rows.map((c) => ({
        name: fullName(c.firstName, c.lastName),
        email: c.email,
        phone: c.phone,
        position: c.position,
        company: c.company?.name ?? null,
        source: c.source,
        owner: c.owner?.name ?? null,
      }));
    }

    case "search_deals": {
      const q = asStr(input.query);
      const status = ["OPEN", "WON", "LOST"].includes(String(input.status)) ? (input.status as string) : undefined;
      const minAmount = typeof input.minAmount === "number" ? input.minAmount : undefined;
      const where: Prisma.DealWhereInput = {
        orgId,
        ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
        ...(status ? { status: status as Prisma.DealWhereInput["status"] } : {}),
        ...(minAmount != null ? { amount: { gte: minAmount } } : {}),
      };
      const rows = await db.deal.findMany({
        where,
        include: {
          stage: { select: { name: true } },
          contact: { select: { firstName: true, lastName: true } },
          company: { select: { name: true } },
          owner: { select: { name: true } },
        },
        orderBy: { amount: "desc" },
        take: clampLimit(input.limit),
      });
      return rows.map((d) => ({
        title: d.title,
        amount: d.amount,
        currency: d.currency,
        status: d.status,
        stage: d.stage.name,
        contact: d.contact ? fullName(d.contact.firstName, d.contact.lastName) : null,
        company: d.company?.name ?? null,
        owner: d.owner?.name ?? null,
        expectedCloseDate: d.expectedCloseDate?.toISOString().slice(0, 10) ?? null,
      }));
    }

    case "search_companies": {
      const q = asStr(input.query);
      const rows = await db.company.findMany({
        where: {
          orgId,
          ...(q
            ? {
                OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { website: { contains: q, mode: "insensitive" } },
                  { industry: { contains: q, mode: "insensitive" } },
                  { phone: { contains: q } },
                ],
              }
            : {}),
        },
        include: {
          owner: { select: { name: true } },
          _count: { select: { contacts: true, deals: true } },
        },
        orderBy: { createdAt: "desc" },
        take: clampLimit(input.limit),
      });
      return rows.map((c) => ({
        name: c.name,
        industry: c.industry,
        website: c.website,
        phone: c.phone,
        owner: c.owner?.name ?? null,
        contacts: c._count.contacts,
        deals: c._count.deals,
      }));
    }

    case "list_activities": {
      const filter = ["upcoming", "completed", "all"].includes(String(input.filter))
        ? (input.filter as string)
        : "upcoming";
      const rows = await db.activity.findMany({
        where: {
          orgId,
          ...(filter === "upcoming" ? { completed: false } : {}),
          ...(filter === "completed" ? { completed: true } : {}),
        },
        include: {
          contact: { select: { firstName: true, lastName: true } },
          deal: { select: { title: true } },
          assignee: { select: { name: true } },
        },
        orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
        take: clampLimit(input.limit),
      });
      return rows.map((a) => ({
        type: a.type,
        subject: a.subject,
        dueDate: a.dueDate?.toISOString().slice(0, 10) ?? null,
        completed: a.completed,
        contact: a.contact ? fullName(a.contact.firstName, a.contact.lastName) : null,
        deal: a.deal?.title ?? null,
        assignee: a.assignee?.name ?? null,
      }));
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}
