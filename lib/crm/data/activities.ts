import "server-only";
import { z } from "zod";
import type { ActivityType, Prisma } from "@prisma/client";
import { db } from "../db";
import type { Option } from "../types";

export const PAGE_SIZE = 15;

export type ActivityFilter = "upcoming" | "completed" | "all";

export const activitySchema = z.object({
  type: z.enum(["CALL", "MEETING", "EMAIL", "TASK", "NOTE"]).catch("TASK"),
  subject: z.string().trim().min(1, "Mavzu majburiy / Subject required"),
  notes: z.string().trim().max(2000).optional(),
  dueDate: z.coerce.date().optional(),
  assigneeId: z.string().optional(),
  contactId: z.string().optional(),
  dealId: z.string().optional(),
});

export type ActivityInput = z.infer<typeof activitySchema>;

/** Drop FK ids that don't belong to this org (defense against cross-tenant ids). */
async function sanitizeRefs(orgId: string, input: ActivityInput) {
  let assigneeId = input.assigneeId || undefined;
  let contactId = input.contactId || undefined;
  let dealId = input.dealId || undefined;
  if (assigneeId) {
    const u = await db.user.findFirst({ where: { id: assigneeId, orgId }, select: { id: true } });
    if (!u) assigneeId = undefined;
  }
  if (contactId) {
    const c = await db.contact.findFirst({ where: { id: contactId, orgId }, select: { id: true } });
    if (!c) contactId = undefined;
  }
  if (dealId) {
    const d = await db.deal.findFirst({ where: { id: dealId, orgId }, select: { id: true } });
    if (!d) dealId = undefined;
  }
  return { assigneeId, contactId, dealId };
}

const activityInclude = {
  contact: { select: { id: true, firstName: true, lastName: true } },
  deal: { select: { id: true, title: true } },
  assignee: { select: { id: true, name: true, avatarColor: true } },
} satisfies Prisma.ActivityInclude;

export async function listActivities(
  orgId: string,
  {
    filter = "upcoming",
    q,
    page = 1,
    assigneeId,
    type,
  }: {
    filter?: ActivityFilter;
    q?: string;
    page?: number;
    assigneeId?: string;
    type?: ActivityType;
  },
) {
  const where: Prisma.ActivityWhereInput = {
    orgId,
    ...(filter === "upcoming" ? { completed: false } : {}),
    ...(filter === "completed" ? { completed: true } : {}),
    ...(assigneeId ? { assigneeId } : {}),
    ...(type ? { type } : {}),
    ...(q ? { subject: { contains: q, mode: "insensitive" } } : {}),
  };

  const orderBy: Prisma.ActivityOrderByWithRelationInput[] =
    filter === "upcoming"
      ? [{ dueDate: "asc" }, { createdAt: "desc" }]
      : filter === "completed"
        ? [{ completedAt: "desc" }]
        : [{ createdAt: "desc" }];

  const [items, total] = await Promise.all([
    db.activity.findMany({
      where,
      include: activityInclude,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.activity.count({ where }),
  ]);

  return { items, total, page, pageSize: PAGE_SIZE, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getActivity(orgId: string, id: string) {
  return db.activity.findFirst({
    where: { id, orgId },
    include: activityInclude,
  });
}

/** Deal picker options for activity forms. */
export async function getDealOptions(orgId: string): Promise<Option[]> {
  const rows = await db.deal.findMany({
    where: { orgId },
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((d) => ({ value: d.id, label: d.title }));
}

export async function createActivity(orgId: string, input: ActivityInput) {
  const { assigneeId, contactId, dealId } = await sanitizeRefs(orgId, input);
  return db.activity.create({
    data: {
      orgId,
      type: input.type,
      subject: input.subject,
      notes: input.notes || null,
      dueDate: input.dueDate ?? null,
      assigneeId: assigneeId ?? null,
      contactId: contactId ?? null,
      dealId: dealId ?? null,
    },
  });
}

export async function updateActivity(orgId: string, id: string, input: ActivityInput) {
  const { assigneeId, contactId, dealId } = await sanitizeRefs(orgId, input);
  const result = await db.activity.updateMany({
    where: { id, orgId },
    data: {
      type: input.type,
      subject: input.subject,
      notes: input.notes || null,
      dueDate: input.dueDate ?? null,
      assigneeId: assigneeId ?? null,
      contactId: contactId ?? null,
      dealId: dealId ?? null,
    },
  });
  return result.count > 0;
}

export async function deleteActivity(orgId: string, id: string) {
  const result = await db.activity.deleteMany({ where: { id, orgId } });
  return result.count > 0;
}

/** Mark an activity done/undone, stamping completedAt accordingly. */
export async function toggleActivity(orgId: string, id: string, completed: boolean) {
  const result = await db.activity.updateMany({
    where: { id, orgId },
    data: { completed, completedAt: completed ? new Date() : null },
  });
  return result.count > 0;
}
