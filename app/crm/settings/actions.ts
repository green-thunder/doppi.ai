"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import type { Role } from "@prisma/client";
import { requireAdmin, requireUser } from "@/lib/crm/auth";
import { hashPassword, verifyPassword } from "@/lib/crm/password";
import { db } from "@/lib/crm/db";
import {
  countOwners,
  emailExists,
  getMember,
} from "@/lib/crm/data/team";
import { createInvitation, revokeInvitation } from "@/lib/crm/data/invitations";
import { sendInviteEmail } from "@/lib/crm/email";
import {
  createStage,
  deleteStage,
  moveStage,
  stageSchema,
  StageHasDealsError,
  updateStage,
} from "@/lib/crm/data/stages";
import { ASSIGNABLE_ROLES, AVATAR_COLORS, CURRENCIES } from "@/lib/crm/constants";
import {
  requiredString,
  toFieldErrors,
  type FormState,
} from "@/lib/crm/forms";
import { isLocale } from "@/lib/crm/i18n";

// ── Organization ─────────────────────────────────────────────────────────────

const orgSchema = z.object({
  name: z.string().trim().min(1, "Nom majburiy / Name required").max(120),
  currency: z.enum(CURRENCIES).catch("UZS"),
});

export async function updateOrgAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireAdmin();
  const parsed = orgSchema.safeParse({
    name: requiredString(formData.get("name")),
    currency: (formData.get("currency") ?? "UZS").toString(),
  });
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error) };

  await db.organization.update({
    where: { id: user.orgId },
    data: { name: parsed.data.name, currency: parsed.data.currency },
  });
  revalidatePath("/crm/settings");
  return { ok: true, message: "saved" };
}

// ── Team / members ───────────────────────────────────────────────────────────

const inviteSchema = z.object({
  name: z.string().trim().min(1, "Ism majburiy / Name required").max(120),
  email: z.email("Email noto'g'ri / Invalid email"),
  role: z.enum(["ADMIN", "AGENT"]).catch("AGENT"),
});

/** Absolute base URL of the app, from the incoming request (or APP_URL env). */
async function appBaseUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * Invite a teammate by email. Creates a pending Invitation with a one-time
 * token; the invitee sets their own password via the accept link. Emails the
 * link when Resend is configured, and always returns it so the admin can share
 * it manually. No password is set by the admin.
 */
export async function inviteMemberAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireAdmin();
  const roleValue = (formData.get("role") ?? "AGENT").toString();
  const parsed = inviteSchema.safeParse({
    name: requiredString(formData.get("name")),
    email: requiredString(formData.get("email")).toLowerCase(),
    role: (ASSIGNABLE_ROLES as string[]).includes(roleValue) ? roleValue : "AGENT",
  });
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error) };

  // Email must not already belong to an existing user.
  if (await emailExists(parsed.data.email)) {
    return {
      ok: false,
      fieldErrors: {
        email: user.locale === "en" ? "Email already in use" : "Bu email band",
      },
    };
  }

  const { token } = await createInvitation(user.orgId, {
    email: parsed.data.email,
    name: parsed.data.name,
    role: parsed.data.role as Role,
    invitedById: user.id,
  });

  const acceptUrl = `${await appBaseUrl()}/invite/${token}`;
  await sendInviteEmail({
    to: parsed.data.email,
    inviterName: user.name,
    orgName: user.org.name,
    acceptUrl,
  });

  revalidatePath("/crm/settings/team");
  // `message` carries the accept link so the dialog can display / copy it.
  return { ok: true, message: acceptUrl };
}

export async function revokeInvitationAction(invitationId: string): Promise<void> {
  const actor = await requireAdmin();
  if (!invitationId) return;
  await revokeInvitation(actor.orgId, invitationId);
  revalidatePath("/crm/settings/team");
}

export async function changeRoleAction(
  userId: string,
  role: "ADMIN" | "AGENT",
): Promise<void> {
  const actor = await requireAdmin();
  if (!userId || userId === actor.id) return; // never change your own role here
  if (role !== "ADMIN" && role !== "AGENT") return;

  const target = await getMember(actor.orgId, userId);
  if (!target) return;
  if (target.role === "OWNER") return; // owner role is immutable via this action

  await db.user.updateMany({
    where: { id: userId, orgId: actor.orgId },
    data: { role: role as Role },
  });
  revalidatePath("/crm/settings/team");
}

export async function setMemberActiveAction(
  userId: string,
  active: boolean,
): Promise<void> {
  const actor = await requireAdmin();
  if (!userId || userId === actor.id) return; // can't deactivate yourself

  const target = await getMember(actor.orgId, userId);
  if (!target) return;
  if (target.role === "OWNER") return; // owners can't be deactivated here

  await db.user.updateMany({
    where: { id: userId, orgId: actor.orgId },
    data: { active },
  });
  revalidatePath("/crm/settings/team");
}

// ── Pipeline stages ──────────────────────────────────────────────────────────

function buildStageInput(fd: FormData) {
  return {
    name: requiredString(fd.get("name")),
    color: requiredString(fd.get("color")) || "#E6A92C",
    isWon: fd.get("isWon") === "on" || fd.get("isWon") === "true",
    isLost: fd.get("isLost") === "on" || fd.get("isLost") === "true",
  };
}

export async function createStageAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireAdmin();
  const parsed = stageSchema.safeParse(buildStageInput(formData));
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error) };

  await createStage(user.orgId, parsed.data);
  revalidatePath("/crm/settings/pipeline");
  return { ok: true, message: "created" };
}

export async function updateStageAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireAdmin();
  const id = requiredString(formData.get("id"));
  if (!id) return { ok: false, error: "Missing id" };

  const parsed = stageSchema.safeParse(buildStageInput(formData));
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error) };

  const ok = await updateStage(user.orgId, id, parsed.data);
  if (!ok) return { ok: false, error: "Not found" };

  revalidatePath("/crm/settings/pipeline");
  return { ok: true, message: "updated" };
}

export async function deleteStageAction(formData: FormData): Promise<void> {
  const user = await requireAdmin();
  const id = requiredString(formData.get("id"));
  if (id) {
    try {
      await deleteStage(user.orgId, id);
    } catch (err) {
      // Blocked because the stage still has deals — leave it in place. The page
      // shows the deal count so the user understands why nothing changed.
      if (!(err instanceof StageHasDealsError)) throw err;
    }
    revalidatePath("/crm/settings/pipeline");
  }
  redirect("/crm/settings/pipeline");
}

export async function moveStageAction(
  id: string,
  dir: "up" | "down",
): Promise<void> {
  const user = await requireAdmin();
  if (!id || (dir !== "up" && dir !== "down")) return;
  await moveStage(user.orgId, id, dir);
  revalidatePath("/crm/settings/pipeline");
}

// ── My profile ───────────────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z.string().trim().min(1, "Ism majburiy / Name required").max(120),
  locale: z.enum(["uz", "en"]).catch("uz"),
  avatarColor: z.string().trim().min(1).max(20).catch("#E6A92C"),
});

export async function updateProfileAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const localeValue = requiredString(formData.get("locale"));
  const parsed = profileSchema.safeParse({
    name: requiredString(formData.get("name")),
    locale: isLocale(localeValue) ? localeValue : "uz",
    avatarColor: requiredString(formData.get("avatarColor")) || "#E6A92C",
  });
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error) };

  await db.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      locale: parsed.data.locale,
      avatarColor: parsed.data.avatarColor,
    },
  });
  revalidatePath("/crm/settings/profile");
  return { ok: true, message: "saved" };
}

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Majburiy / Required"),
  newPassword: z.string().min(8, "Kamida 8 belgi / Min 8 characters"),
});

export async function changePasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = passwordSchema.safeParse({
    currentPassword: requiredString(formData.get("currentPassword")),
    newPassword: requiredString(formData.get("newPassword")),
  });
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error) };

  const record = await db.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true },
  });
  if (!record) return { ok: false, error: "Not found" };

  const valid = await verifyPassword(parsed.data.currentPassword, record.passwordHash);
  if (!valid) {
    return {
      ok: false,
      fieldErrors: {
        currentPassword:
          user.locale === "en" ? "Current password is incorrect" : "Joriy parol noto'g'ri",
      },
    };
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await db.user.update({ where: { id: user.id }, data: { passwordHash } });
  revalidatePath("/crm/settings/profile");
  return { ok: true, message: "saved" };
}
