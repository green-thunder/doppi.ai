import "server-only";
import { z } from "zod";
import type { LeadSource, Prisma } from "@prisma/client";
import { db } from "../db";

export const PAGE_SIZE = 12;

export const contactSchema = z.object({
  firstName: z.string().trim().min(1, "Ism majburiy / First name required"),
  lastName: z.string().trim().optional(),
  email: z.email("Email noto'g'ri / Invalid email").optional(),
  phone: z.string().trim().max(40).optional(),
  position: z.string().trim().max(120).optional(),
  companyId: z.string().optional(),
  ownerId: z.string().optional(),
  source: z.enum(["WEBSITE", "MANUAL", "REFERRAL", "SOCIAL", "IMPORT", "OTHER"]).catch("MANUAL"),
  tags: z.array(z.string()).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Drop FK ids that don't belong to this org (defense against cross-tenant ids). */
async function sanitizeRefs(orgId: string, input: ContactInput) {
  let companyId = input.companyId || undefined;
  let ownerId = input.ownerId || undefined;
  if (companyId) {
    const c = await db.company.findFirst({ where: { id: companyId, orgId }, select: { id: true } });
    if (!c) companyId = undefined;
  }
  if (ownerId) {
    const u = await db.user.findFirst({ where: { id: ownerId, orgId }, select: { id: true } });
    if (!u) ownerId = undefined;
  }
  return { companyId, ownerId };
}

export async function listContacts(
  orgId: string,
  {
    q,
    page = 1,
    ownerId,
    source,
  }: { q?: string; page?: number; ownerId?: string; source?: LeadSource },
) {
  const where: Prisma.ContactWhereInput = {
    orgId,
    ...(ownerId ? { ownerId } : {}),
    ...(source ? { source } : {}),
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
  };

  const [items, total] = await Promise.all([
    db.contact.findMany({
      where,
      include: {
        company: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true, avatarColor: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.contact.count({ where }),
  ]);

  return { items, total, page, pageSize: PAGE_SIZE, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getContact(orgId: string, id: string) {
  return db.contact.findFirst({
    where: { id, orgId },
    include: {
      company: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true, avatarColor: true } },
      deals: {
        include: { stage: { select: { name: true, color: true } } },
        orderBy: { createdAt: "desc" },
      },
      activities: {
        include: { assignee: { select: { id: true, name: true, avatarColor: true } } },
        orderBy: [{ completed: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
        take: 20,
      },
    },
  });
}

export async function createContact(
  orgId: string,
  input: ContactInput,
  customFields?: Record<string, unknown>,
) {
  const { companyId, ownerId } = await sanitizeRefs(orgId, input);
  return db.contact.create({
    data: {
      orgId,
      firstName: input.firstName,
      lastName: input.lastName || null,
      email: input.email || null,
      phone: input.phone || null,
      position: input.position || null,
      source: input.source,
      tags: input.tags ?? [],
      notes: input.notes || null,
      companyId: companyId ?? null,
      ownerId: ownerId ?? null,
      ...(customFields !== undefined
        ? { customFields: customFields as Prisma.InputJsonObject }
        : {}),
    },
  });
}

export async function updateContact(
  orgId: string,
  id: string,
  input: ContactInput,
  customFields?: Record<string, unknown>,
) {
  const { companyId, ownerId } = await sanitizeRefs(orgId, input);
  const result = await db.contact.updateMany({
    where: { id, orgId },
    data: {
      firstName: input.firstName,
      lastName: input.lastName || null,
      email: input.email || null,
      phone: input.phone || null,
      position: input.position || null,
      source: input.source,
      tags: input.tags ?? [],
      notes: input.notes || null,
      companyId: companyId ?? null,
      ownerId: ownerId ?? null,
      ...(customFields !== undefined
        ? { customFields: customFields as Prisma.InputJsonObject }
        : {}),
    },
  });
  return result.count > 0;
}

export async function deleteContact(orgId: string, id: string) {
  const result = await db.contact.deleteMany({ where: { id, orgId } });
  return result.count > 0;
}
