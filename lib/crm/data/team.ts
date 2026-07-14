import "server-only";
import { db } from "../db";

/**
 * Members of an org for the Team settings page. Ordered so OWNER surfaces first
 * (via a Postgres enum order on `role`), then alphabetically by name.
 */
export async function listMembers(orgId: string) {
  return db.user.findMany({
    where: { orgId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarColor: true,
      active: true,
      lastLoginAt: true,
      createdAt: true,
    },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });
}

/** How many OWNERs the org has — used to guard against removing the last owner. */
export async function countOwners(orgId: string): Promise<number> {
  return db.user.count({ where: { orgId, role: "OWNER" } });
}

/** Whether an email is already taken by ANY user (emails are globally unique). */
export async function emailExists(email: string): Promise<boolean> {
  const existing = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return Boolean(existing);
}

/** A single member scoped to the org (defends against cross-tenant ids). */
export async function getMember(orgId: string, id: string) {
  return db.user.findFirst({
    where: { id, orgId },
    select: { id: true, name: true, email: true, role: true, active: true },
  });
}
