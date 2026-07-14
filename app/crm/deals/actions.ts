"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { db } from "@/lib/crm/db";
import {
  createDeal,
  dealSchema,
  deleteDeal,
  moveDeal,
  updateDeal,
} from "@/lib/crm/data/deals";
import { extractCustomFields, listFields } from "@/lib/crm/data/custom-fields";
import { runAutomations } from "@/lib/crm/data/automations";
import {
  dateOrUndef,
  numberOrUndef,
  optionalString,
  requiredString,
  toFieldErrors,
  type FormState,
} from "@/lib/crm/forms";

function buildInput(fd: FormData) {
  return {
    title: requiredString(fd.get("title")),
    amount: numberOrUndef(fd.get("amount")) ?? 0,
    currency: optionalString(fd.get("currency")) ?? "UZS",
    stageId: requiredString(fd.get("stageId")),
    status: (fd.get("status") ?? "OPEN").toString(),
    contactId: optionalString(fd.get("contactId")),
    companyId: optionalString(fd.get("companyId")),
    ownerId: optionalString(fd.get("ownerId")),
    expectedCloseDate: dateOrUndef(fd.get("expectedCloseDate")),
  };
}

export async function createDealAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = dealSchema.safeParse(buildInput(formData));
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error) };

  const customFields = extractCustomFields(await listFields(user.orgId, "DEAL"), formData);
  await createDeal(user.orgId, parsed.data, customFields);
  revalidatePath("/crm/deals");
  return { ok: true, message: "created" };
}

export async function updateDealAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const id = requiredString(formData.get("id"));
  if (!id) return { ok: false, error: "Missing id" };

  const parsed = dealSchema.safeParse(buildInput(formData));
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error) };

  const customFields = extractCustomFields(await listFields(user.orgId, "DEAL"), formData);
  const ok = await updateDeal(user.orgId, id, parsed.data, customFields);
  if (!ok) return { ok: false, error: "Not found" };

  revalidatePath("/crm/deals");
  revalidatePath(`/crm/deals/${id}`);
  return { ok: true, message: "updated" };
}

export async function deleteDealAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = requiredString(formData.get("id"));
  if (id) {
    await deleteDeal(user.orgId, id);
    revalidatePath("/crm/deals");
  }
  redirect("/crm/deals");
}

export async function moveDealAction(dealId: string, stageId: string): Promise<void> {
  const user = await requireUser();
  const ok = await moveDeal(user.orgId, dealId, stageId);
  revalidatePath("/crm/deals");
  if (!ok) return;

  // Fire automation triggers for the stage change (and won/lost, if applicable).
  const [stage, deal] = await Promise.all([
    db.stage.findFirst({
      where: { id: stageId, orgId: user.orgId },
      select: { isWon: true, isLost: true },
    }),
    db.deal.findFirst({
      where: { id: dealId, orgId: user.orgId },
      select: { ownerId: true, contactId: true, companyId: true },
    }),
  ]);
  const ctx = {
    dealId,
    stageId,
    ownerId: deal?.ownerId ?? undefined,
    contactId: deal?.contactId ?? undefined,
    companyId: deal?.companyId ?? undefined,
  };
  await runAutomations(user.orgId, "DEAL_STAGE_CHANGED", ctx);
  if (stage?.isWon) await runAutomations(user.orgId, "DEAL_WON", ctx);
  if (stage?.isLost) await runAutomations(user.orgId, "DEAL_LOST", ctx);
}
