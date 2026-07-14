import "server-only";
import { z } from "zod";
import type {
  AutomationAction,
  AutomationRule,
  AutomationTrigger,
  Prisma,
} from "@prisma/client";
import { db } from "../db";

// ── Schema ───────────────────────────────────────────────────────────────────

/** Trigger/action enum values, kept in sync with the Prisma enums. */
const TRIGGERS = [
  "DEAL_STAGE_CHANGED",
  "DEAL_WON",
  "DEAL_LOST",
  "CONTACT_CREATED",
  "WEBSITE_LEAD",
] as const;

const ACTIONS = ["CREATE_TASK", "ASSIGN_OWNER", "ADD_TAG"] as const;

/**
 * An automation rule. `triggerConfig` narrows a trigger (e.g. only a specific
 * pipeline stage); `actionConfig` parameterizes the action (task subject,
 * assignee, tag). `active` is never set here — new rules default to active and
 * the state is flipped via {@link toggleRule}.
 */
export const ruleSchema = z.object({
  name: z.string().trim().min(1, "Nom majburiy / Name required").max(120),
  trigger: z.enum(TRIGGERS),
  action: z.enum(ACTIONS),
  triggerConfig: z.object({ stageId: z.string().optional() }).catch({}),
  actionConfig: z
    .object({
      subject: z.string().optional(),
      assigneeId: z.string().optional(),
      tag: z.string().optional(),
    })
    .catch({}),
});

export type RuleInput = z.infer<typeof ruleSchema>;

// ── CRUD ─────────────────────────────────────────────────────────────────────

/** All rules for an org, oldest first. */
export async function listRules(orgId: string) {
  return db.automationRule.findMany({
    where: { orgId },
    orderBy: { createdAt: "asc" },
  });
}

export async function getRule(orgId: string, id: string) {
  return db.automationRule.findFirst({ where: { id, orgId } });
}

export async function createRule(orgId: string, input: RuleInput) {
  return db.automationRule.create({
    data: {
      orgId,
      name: input.name,
      trigger: input.trigger,
      action: input.action,
      triggerConfig: input.triggerConfig as Prisma.InputJsonValue,
      actionConfig: input.actionConfig as Prisma.InputJsonValue,
      // `active` intentionally omitted — Prisma defaults it to true.
    },
  });
}

export async function updateRule(orgId: string, id: string, input: RuleInput) {
  const result = await db.automationRule.updateMany({
    where: { id, orgId },
    data: {
      name: input.name,
      trigger: input.trigger,
      action: input.action,
      triggerConfig: input.triggerConfig as Prisma.InputJsonValue,
      actionConfig: input.actionConfig as Prisma.InputJsonValue,
      // `active` is left untouched — toggled separately via toggleRule.
    },
  });
  return result.count > 0;
}

export async function deleteRule(orgId: string, id: string) {
  const result = await db.automationRule.deleteMany({ where: { id, orgId } });
  return result.count > 0;
}

export async function toggleRule(orgId: string, id: string, active: boolean) {
  const result = await db.automationRule.updateMany({
    where: { id, orgId },
    data: { active },
  });
  return result.count > 0;
}

// ── Engine ───────────────────────────────────────────────────────────────────

/**
 * Context passed to {@link runAutomations}. Every id is optional; each action
 * uses only the ids it needs and validates them against `orgId` before use.
 */
export type AutomationContext = {
  dealId?: string;
  contactId?: string;
  companyId?: string;
  stageId?: string;
  ownerId?: string;
  createdById?: string;
};

/** Read a string field from a stored JSON config, or undefined. */
function readString(config: Prisma.JsonValue | null, key: string): string | undefined {
  if (!config || typeof config !== "object" || Array.isArray(config)) return undefined;
  const v = (config as Record<string, unknown>)[key];
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

/** True when the user id belongs to this org (defense against cross-tenant ids). */
async function userInOrg(orgId: string, userId: string): Promise<boolean> {
  const u = await db.user.findFirst({ where: { id: userId, orgId }, select: { id: true } });
  return !!u;
}

async function contactInOrg(orgId: string, contactId: string): Promise<boolean> {
  const c = await db.contact.findFirst({ where: { id: contactId, orgId }, select: { id: true } });
  return !!c;
}

async function dealInOrg(orgId: string, dealId: string): Promise<boolean> {
  const d = await db.deal.findFirst({ where: { id: dealId, orgId }, select: { id: true } });
  return !!d;
}

/** Execute a single rule's action. Every FK id is org-validated before use. */
async function executeAction(
  orgId: string,
  action: AutomationAction,
  config: Prisma.JsonValue | null,
  ctx: AutomationContext,
): Promise<void> {
  const cfgAssigneeId = readString(config, "assigneeId");
  const subject = readString(config, "subject");
  const tag = readString(config, "tag");

  switch (action) {
    case "CREATE_TASK": {
      // Prefer the configured assignee (if valid), otherwise the ctx owner.
      let assigneeId: string | undefined;
      if (cfgAssigneeId && (await userInOrg(orgId, cfgAssigneeId))) {
        assigneeId = cfgAssigneeId;
      } else if (ctx.ownerId && (await userInOrg(orgId, ctx.ownerId))) {
        assigneeId = ctx.ownerId;
      }

      const contactId =
        ctx.contactId && (await contactInOrg(orgId, ctx.contactId)) ? ctx.contactId : undefined;
      const dealId =
        ctx.dealId && (await dealInOrg(orgId, ctx.dealId)) ? ctx.dealId : undefined;
      const createdById =
        ctx.createdById && (await userInOrg(orgId, ctx.createdById)) ? ctx.createdById : undefined;

      await db.activity.create({
        data: {
          orgId,
          type: "TASK",
          subject: subject || "Follow up",
          assigneeId: assigneeId ?? null,
          contactId: contactId ?? null,
          dealId: dealId ?? null,
          createdById: createdById ?? null,
        },
      });
      break;
    }

    case "ASSIGN_OWNER": {
      if (!cfgAssigneeId || !(await userInOrg(orgId, cfgAssigneeId))) break;
      if (ctx.dealId) {
        await db.deal.updateMany({
          where: { id: ctx.dealId, orgId },
          data: { ownerId: cfgAssigneeId },
        });
      } else if (ctx.contactId) {
        await db.contact.updateMany({
          where: { id: ctx.contactId, orgId },
          data: { ownerId: cfgAssigneeId },
        });
      }
      break;
    }

    case "ADD_TAG": {
      if (!ctx.contactId || !tag) break;
      const contact = await db.contact.findFirst({
        where: { id: ctx.contactId, orgId },
        select: { id: true, tags: true },
      });
      if (!contact || contact.tags.includes(tag)) break;
      await db.contact.updateMany({
        where: { id: ctx.contactId, orgId },
        data: { tags: [...contact.tags, tag] },
      });
      break;
    }
  }
}

/**
 * Run every active rule for `orgId` matching `trigger`. For DEAL_STAGE_CHANGED
 * rules that pin a stage, only fire when `ctx.stageId` matches. Each rule runs
 * inside its own try/catch so one failure never breaks the others, and the whole
 * function is guarded so it never throws out to the caller (fire-and-forget).
 */
export async function runAutomations(
  orgId: string,
  trigger: AutomationTrigger,
  ctx: AutomationContext,
): Promise<void> {
  try {
    const rules = await db.automationRule.findMany({
      where: { orgId, trigger, active: true },
    });

    for (const rule of rules as AutomationRule[]) {
      try {
        if (trigger === "DEAL_STAGE_CHANGED") {
          const wantStage = readString(rule.triggerConfig, "stageId");
          // A pinned stage only fires on that stage; no pin => any stage change.
          if (wantStage && ctx.stageId !== wantStage) continue;
        }
        await executeAction(orgId, rule.action, rule.actionConfig, ctx);
      } catch {
        // Swallow per-rule errors — a bad rule must not break sibling rules.
      }
    }
  } catch {
    // Never throw out of runAutomations; automations are best-effort side effects.
  }
}
