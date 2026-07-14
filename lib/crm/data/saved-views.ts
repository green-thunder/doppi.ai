import "server-only";
import type { Prisma, ViewEntity } from "@prisma/client";
import { db } from "../db";

/**
 * Saved filter sets for a list page. A view is either shared across the org
 * (userId = null) or private to the user who created it. Everything is scoped
 * by orgId so a tenant only ever sees its own views.
 */
export async function listViews(orgId: string, entity: ViewEntity, userId: string) {
  return db.savedView.findMany({
    where: { orgId, entity, OR: [{ userId: null }, { userId }] },
    orderBy: { createdAt: "desc" },
  });
}

export async function createView(
  orgId: string,
  userId: string | null,
  entity: ViewEntity,
  name: string,
  filters: Record<string, string>,
) {
  return db.savedView.create({
    data: {
      orgId,
      userId: userId ?? null,
      entity,
      name,
      filters: filters as Prisma.InputJsonValue,
    },
  });
}

export async function deleteView(orgId: string, id: string) {
  const result = await db.savedView.deleteMany({ where: { id, orgId } });
  return result.count > 0;
}
