import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Organization, Role, User } from "@prisma/client";
import { db } from "./db";
import { isAdmin } from "./rbac";

export { hashPassword, verifyPassword } from "./password";

const SESSION_COOKIE = "doppi_session";
const SESSION_DAYS = 30;

/** A logged-in user with their organization eagerly loaded. */
export type SessionUser = User & { org: Organization };

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// ── Sessions ─────────────────────────────────────────────────────────────────

/** Create a DB-backed session and set the httpOnly cookie. */
export async function createSession(userId: string, userAgent?: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await db.session.create({
    data: { userId, tokenHash: hashToken(token), expiresAt, userAgent },
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

/** Destroy the current session (DB row + cookie). */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  store.delete(SESSION_COOKIE);
}

/**
 * The current user, or null. Memoized per-request via React `cache` so multiple
 * server components resolve it once.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { include: { org: true } } },
  });

  if (!session || session.expiresAt < new Date()) return null;
  if (!session.user.active) return null;
  return session.user;
});

/** Require a logged-in user or redirect to /login. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** Require an admin/owner or redirect back to the dashboard. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (!isAdmin(user.role)) redirect("/crm");
  return user;
}

/** Require one of the given roles or redirect back to the dashboard. */
export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect("/crm");
  return user;
}
