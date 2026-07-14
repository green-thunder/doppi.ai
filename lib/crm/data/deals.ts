import "server-only";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { db } from "../db";

export const dealSchema = z.object({
  title: z.string().trim().min(1, "Sarlavha majburiy / Title required"),
  amount: z.coerce.number().min(0, "Summa manfiy bo'lishi mumkin emas / Amount must be >= 0").default(0),
  currency: z.string().trim().min(1).default("UZS"),
  stageId: z.string().trim().min(1, "Bosqich majburiy / Stage required"),
  status: z.enum(["OPEN", "WON", "LOST"]).default("OPEN"),
  contactId: z.string().optional(),
  companyId: z.string().optional(),
  ownerId: z.string().optional(),
  expectedCloseDate: z.coerce.date().optional(),
});

export type DealInput = z.infer<typeof dealSchema>;

/** FK ids sanitized to this org, plus the resolved stageId (always a real stage in the org). */
type SanitizedDealRefs = {
  stageId: string;
  contactId?: string;
  companyId?: string;
  ownerId?: string;
};

/**
 * Drop FK ids that don't belong to this org (defense against cross-tenant ids).
 * `stageId` must resolve to a real stage in the org — if the supplied one is
 * missing/foreign, fall back to the first stage (throws only if the org has none).
 */
export async function sanitizeDealRefs(orgId: string, input: DealInput): Promise<SanitizedDealRefs> {
  let contactId = input.contactId || undefined;
  let companyId = input.companyId || undefined;
  let ownerId = input.ownerId || undefined;

  if (contactId) {
    const c = await db.contact.findFirst({ where: { id: contactId, orgId }, select: { id: true } });
    if (!c) contactId = undefined;
  }
  if (companyId) {
    const c = await db.company.findFirst({ where: { id: companyId, orgId }, select: { id: true } });
    if (!c) companyId = undefined;
  }
  if (ownerId) {
    const u = await db.user.findFirst({ where: { id: ownerId, orgId }, select: { id: true } });
    if (!u) ownerId = undefined;
  }

  let stageId = input.stageId || undefined;
  if (stageId) {
    const s = await db.stage.findFirst({ where: { id: stageId, orgId }, select: { id: true } });
    if (!s) stageId = undefined;
  }
  if (!stageId) {
    const first = await db.stage.findFirst({ where: { orgId }, orderBy: { order: "asc" }, select: { id: true } });
    if (!first) throw new Error("No pipeline stages configured for this organization");
    stageId = first.id;
  }

  return { stageId, contactId, companyId, ownerId };
}

const dealDetailInclude = {
  stage: true,
  contact: { select: { id: true, firstName: true, lastName: true } },
  company: { select: { id: true, name: true } },
  owner: { select: { id: true, name: true, avatarColor: true } },
} satisfies Prisma.DealInclude;

export type BoardDeal = Prisma.DealGetPayload<{ include: typeof dealDetailInclude }>;

export async function getBoard(orgId: string) {
  const [stages, deals] = await Promise.all([
    db.stage.findMany({ where: { orgId }, orderBy: { order: "asc" } }),
    db.deal.findMany({
      where: { orgId },
      include: dealDetailInclude,
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  const dealsByStage: Record<string, BoardDeal[]> = {};
  const totals: Record<string, { count: number; sum: number }> = {};
  for (const s of stages) {
    dealsByStage[s.id] = [];
    totals[s.id] = { count: 0, sum: 0 };
  }

  let pipelineValue = 0;
  for (const d of deals) {
    if (!dealsByStage[d.stageId]) {
      dealsByStage[d.stageId] = [];
      totals[d.stageId] = { count: 0, sum: 0 };
    }
    dealsByStage[d.stageId].push(d);
    totals[d.stageId].count += 1;
    totals[d.stageId].sum += d.amount;
    if (d.status === "OPEN") pipelineValue += d.amount;
  }

  return { stages, dealsByStage, totals, pipelineValue };
}

export async function getDeal(orgId: string, id: string) {
  return db.deal.findFirst({
    where: { id, orgId },
    include: {
      stage: true,
      contact: { select: { id: true, firstName: true, lastName: true } },
      company: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true, avatarColor: true } },
      activities: {
        include: { assignee: { select: { id: true, name: true, avatarColor: true } } },
        orderBy: [{ completed: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
        take: 20,
      },
    },
  });
}

/** WON/LOST deals get a closedAt timestamp; OPEN deals clear it. */
function closedAtFor(status: DealInput["status"]): Date | null {
  return status === "WON" || status === "LOST" ? new Date() : null;
}

export async function createDeal(
  orgId: string,
  input: DealInput,
  customFields?: Record<string, unknown>,
) {
  const { stageId, contactId, companyId, ownerId } = await sanitizeDealRefs(orgId, input);
  return db.deal.create({
    data: {
      orgId,
      title: input.title,
      amount: input.amount,
      currency: input.currency,
      status: input.status,
      stageId,
      contactId: contactId ?? null,
      companyId: companyId ?? null,
      ownerId: ownerId ?? null,
      expectedCloseDate: input.expectedCloseDate ?? null,
      closedAt: closedAtFor(input.status),
      ...(customFields !== undefined
        ? { customFields: customFields as Prisma.InputJsonObject }
        : {}),
    },
  });
}

export async function updateDeal(
  orgId: string,
  id: string,
  input: DealInput,
  customFields?: Record<string, unknown>,
) {
  const { stageId, contactId, companyId, ownerId } = await sanitizeDealRefs(orgId, input);
  const result = await db.deal.updateMany({
    where: { id, orgId },
    data: {
      title: input.title,
      amount: input.amount,
      currency: input.currency,
      status: input.status,
      stageId,
      contactId: contactId ?? null,
      companyId: companyId ?? null,
      ownerId: ownerId ?? null,
      expectedCloseDate: input.expectedCloseDate ?? null,
      closedAt: closedAtFor(input.status),
      ...(customFields !== undefined
        ? { customFields: customFields as Prisma.InputJsonObject }
        : {}),
    },
  });
  return result.count > 0;
}

export async function deleteDeal(orgId: string, id: string) {
  const result = await db.deal.deleteMany({ where: { id, orgId } });
  return result.count > 0;
}

/**
 * Move a deal to a stage. Both deal and stage must belong to the org. The target
 * stage's isWon/isLost flags drive the deal's status + closedAt.
 */
export async function moveDeal(orgId: string, dealId: string, stageId: string) {
  const [deal, stage] = await Promise.all([
    db.deal.findFirst({ where: { id: dealId, orgId }, select: { id: true } }),
    db.stage.findFirst({ where: { id: stageId, orgId }, select: { id: true, isWon: true, isLost: true } }),
  ]);
  if (!deal || !stage) return false;

  const status: DealInput["status"] = stage.isWon ? "WON" : stage.isLost ? "LOST" : "OPEN";
  await db.deal.update({
    where: { id: deal.id },
    data: {
      stageId: stage.id,
      status,
      closedAt: status === "OPEN" ? null : new Date(),
    },
  });
  return true;
}
