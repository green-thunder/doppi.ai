import "server-only";
import { createHash, randomBytes } from "node:crypto";
import type { Role } from "@prisma/client";
import { db } from "../db";

const INVITE_DAYS = 7;

export function hashInviteToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Create (or replace) a pending invitation for an email in an org. Returns the
 * raw token to embed in the accept link (only its sha256 is stored).
 */
export async function createInvitation(
  orgId: string,
  input: { email: string; name: string; role: Role; invitedById?: string },
): Promise<{ token: string; id: string }> {
  // Supersede any earlier un-accepted invite for the same email in this org.
  await db.invitation.deleteMany({
    where: { orgId, email: input.email, acceptedAt: null },
  });

  const token = randomBytes(24).toString("hex");
  const inv = await db.invitation.create({
    data: {
      orgId,
      email: input.email,
      name: input.name,
      role: input.role,
      invitedById: input.invitedById,
      tokenHash: hashInviteToken(token),
      expiresAt: new Date(Date.now() + INVITE_DAYS * 86_400_000),
    },
  });
  return { token, id: inv.id };
}

export type InvitationState = "pending" | "expired" | "accepted";

export async function getInvitationByToken(token: string) {
  const inv = await db.invitation.findUnique({
    where: { tokenHash: hashInviteToken(token) },
    include: { org: { select: { id: true, name: true } } },
  });
  if (!inv) return null;
  const state: InvitationState = inv.acceptedAt
    ? "accepted"
    : inv.expiresAt < new Date()
      ? "expired"
      : "pending";
  return { ...inv, state };
}

export async function listPendingInvitations(orgId: string) {
  return db.invitation.findMany({
    where: { orgId, acceptedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
}

export async function revokeInvitation(orgId: string, id: string): Promise<boolean> {
  const r = await db.invitation.deleteMany({ where: { id, orgId, acceptedAt: null } });
  return r.count > 0;
}

type AcceptResult =
  | { ok: true; userId: string; orgId: string }
  | { ok: false; error: "invalid" | "expired" | "accepted" | "email_taken" };

/** Redeem an invitation: create the user, mark it accepted (transactional). */
export async function acceptInvitation(
  token: string,
  input: { name: string; passwordHash: string; locale: string },
): Promise<AcceptResult> {
  const inv = await db.invitation.findUnique({ where: { tokenHash: hashInviteToken(token) } });
  if (!inv) return { ok: false, error: "invalid" };
  if (inv.acceptedAt) return { ok: false, error: "accepted" };
  if (inv.expiresAt < new Date()) return { ok: false, error: "expired" };

  const existing = await db.user.findUnique({ where: { email: inv.email }, select: { id: true } });
  if (existing) return { ok: false, error: "email_taken" };

  const user = await db.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        orgId: inv.orgId,
        email: inv.email,
        name: input.name || inv.name,
        passwordHash: input.passwordHash,
        role: inv.role,
        locale: input.locale,
        lastLoginAt: new Date(),
      },
    });
    await tx.invitation.update({ where: { id: inv.id }, data: { acceptedAt: new Date() } });
    return created;
  });

  return { ok: true, userId: user.id, orgId: inv.orgId };
}
