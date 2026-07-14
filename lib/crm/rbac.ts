import type { Role } from "@prisma/client";

/** OWNER and ADMIN can manage members, stages, and every record in the org. */
export function isAdmin(role: Role): boolean {
  return role === "OWNER" || role === "ADMIN";
}

/** Only the OWNER can change org-wide settings and remove admins. */
export function isOwner(role: Role): boolean {
  return role === "OWNER";
}

export function canManageMembers(role: Role): boolean {
  return isAdmin(role);
}

export function canManageStages(role: Role): boolean {
  return isAdmin(role);
}

export function canManageOrg(role: Role): boolean {
  return isOwner(role);
}

/**
 * Whether `actor` may edit/delete a record owned by `ownerId`.
 * Admins can touch anything; agents only their own (or unowned) records.
 */
export function canMutateRecord(
  actor: { id: string; role: Role },
  ownerId: string | null | undefined,
): boolean {
  if (isAdmin(actor.role)) return true;
  return !ownerId || ownerId === actor.id;
}
