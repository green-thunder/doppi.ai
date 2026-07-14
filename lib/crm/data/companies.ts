import "server-only";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { db } from "../db";

export const PAGE_SIZE = 12;

export const companySchema = z.object({
  name: z.string().trim().min(1, "Nomi majburiy / Name required"),
  website: z.string().trim().max(200).optional(),
  industry: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(40).optional(),
  email: z.email("Email noto'g'ri / Invalid email").optional(),
  address: z.string().trim().max(300).optional(),
  notes: z.string().trim().max(2000).optional(),
  ownerId: z.string().optional(),
});

export type CompanyInput = z.infer<typeof companySchema>;

/** Drop FK ids that don't belong to this org (defense against cross-tenant ids). */
async function sanitizeRefs(orgId: string, input: CompanyInput) {
  let ownerId = input.ownerId || undefined;
  if (ownerId) {
    const u = await db.user.findFirst({ where: { id: ownerId, orgId }, select: { id: true } });
    if (!u) ownerId = undefined;
  }
  return { ownerId };
}

export async function listCompanies(
  orgId: string,
  {
    q,
    page = 1,
    ownerId,
    industry,
  }: { q?: string; page?: number; ownerId?: string; industry?: string },
) {
  const where: Prisma.CompanyWhereInput = {
    orgId,
    ...(ownerId ? { ownerId } : {}),
    ...(industry ? { industry } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { website: { contains: q, mode: "insensitive" } },
            { industry: { contains: q, mode: "insensitive" } },
            { phone: { contains: q } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    db.company.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, avatarColor: true } },
        _count: { select: { contacts: true, deals: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.company.count({ where }),
  ]);

  return { items, total, page, pageSize: PAGE_SIZE, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getCompany(orgId: string, id: string) {
  return db.company.findFirst({
    where: { id, orgId },
    include: {
      owner: { select: { id: true, name: true, avatarColor: true } },
      contacts: {
        include: { owner: { select: { id: true, name: true, avatarColor: true } } },
        orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
      },
      deals: {
        include: { stage: { select: { name: true, color: true } } },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { contacts: true, deals: true } },
    },
  });
}

export async function createCompany(
  orgId: string,
  input: CompanyInput,
  customFields?: Record<string, unknown>,
) {
  const { ownerId } = await sanitizeRefs(orgId, input);
  return db.company.create({
    data: {
      orgId,
      name: input.name,
      website: input.website || null,
      industry: input.industry || null,
      phone: input.phone || null,
      email: input.email || null,
      address: input.address || null,
      notes: input.notes || null,
      ownerId: ownerId ?? null,
      ...(customFields !== undefined
        ? { customFields: customFields as Prisma.InputJsonObject }
        : {}),
    },
  });
}

export async function updateCompany(
  orgId: string,
  id: string,
  input: CompanyInput,
  customFields?: Record<string, unknown>,
) {
  const { ownerId } = await sanitizeRefs(orgId, input);
  const result = await db.company.updateMany({
    where: { id, orgId },
    data: {
      name: input.name,
      website: input.website || null,
      industry: input.industry || null,
      phone: input.phone || null,
      email: input.email || null,
      address: input.address || null,
      notes: input.notes || null,
      ownerId: ownerId ?? null,
      ...(customFields !== undefined
        ? { customFields: customFields as Prisma.InputJsonObject }
        : {}),
    },
  });
  return result.count > 0;
}

export async function deleteCompany(orgId: string, id: string) {
  const result = await db.company.deleteMany({ where: { id, orgId } });
  return result.count > 0;
}
