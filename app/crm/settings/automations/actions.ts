"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/crm/auth";
import { requiredString, toFieldErrors, type FormState } from "@/lib/crm/forms";
import {
  createRule,
  deleteRule,
  ruleSchema,
  toggleRule,
  updateRule,
} from "@/lib/crm/data/automations";

/**
 * Assemble the rule input from FormData. Every config field is always present in
 * the form; we only fold the ones relevant to the chosen trigger/action into the
 * stored JSON so irrelevant selections never leak into a rule.
 */
function buildRuleInput(fd: FormData) {
  const trigger = requiredString(fd.get("trigger"));
  const action = requiredString(fd.get("action"));

  const stageId = requiredString(fd.get("stageId"));
  const subject = requiredString(fd.get("subject"));
  const assigneeId = requiredString(fd.get("assigneeId"));
  const tag = requiredString(fd.get("tag"));

  const triggerConfig: { stageId?: string } = {};
  if (trigger === "DEAL_STAGE_CHANGED" && stageId) triggerConfig.stageId = stageId;

  const actionConfig: { subject?: string; assigneeId?: string; tag?: string } = {};
  if (action === "CREATE_TASK") {
    if (subject) actionConfig.subject = subject;
    if (assigneeId) actionConfig.assigneeId = assigneeId;
  } else if (action === "ASSIGN_OWNER") {
    if (assigneeId) actionConfig.assigneeId = assigneeId;
  } else if (action === "ADD_TAG") {
    if (tag) actionConfig.tag = tag;
  }

  return {
    name: requiredString(fd.get("name")),
    trigger,
    action,
    triggerConfig,
    actionConfig,
  };
}

export async function createRuleAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireAdmin();
  const parsed = ruleSchema.safeParse(buildRuleInput(formData));
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error) };

  await createRule(user.orgId, parsed.data);
  revalidatePath("/crm/settings/automations");
  return { ok: true, message: "created" };
}

export async function updateRuleAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireAdmin();
  const id = requiredString(formData.get("id"));
  if (!id) return { ok: false, error: "Missing id" };

  const parsed = ruleSchema.safeParse(buildRuleInput(formData));
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error) };

  const ok = await updateRule(user.orgId, id, parsed.data);
  if (!ok) return { ok: false, error: "Not found" };

  revalidatePath("/crm/settings/automations");
  return { ok: true, message: "updated" };
}

export async function deleteRuleAction(formData: FormData): Promise<void> {
  const user = await requireAdmin();
  const id = requiredString(formData.get("id"));
  if (id) {
    await deleteRule(user.orgId, id);
    revalidatePath("/crm/settings/automations");
  }
  redirect("/crm/settings/automations");
}

export async function toggleRuleAction(id: string, active: boolean): Promise<void> {
  const user = await requireAdmin();
  if (!id) return;
  await toggleRule(user.orgId, id, active);
  revalidatePath("/crm/settings/automations");
}
