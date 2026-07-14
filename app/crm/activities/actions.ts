"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import {
  activitySchema,
  createActivity,
  deleteActivity,
  toggleActivity,
  updateActivity,
} from "@/lib/crm/data/activities";
import {
  optionalString,
  requiredString,
  toFieldErrors,
  type FormState,
} from "@/lib/crm/forms";

function buildInput(fd: FormData) {
  return {
    type: (fd.get("type") ?? "TASK").toString(),
    subject: requiredString(fd.get("subject")),
    notes: optionalString(fd.get("notes")),
    dueDate: optionalString(fd.get("dueDate")),
    assigneeId: optionalString(fd.get("assigneeId")),
    contactId: optionalString(fd.get("contactId")),
    dealId: optionalString(fd.get("dealId")),
  };
}

export async function createActivityAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = activitySchema.safeParse(buildInput(formData));
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error) };

  await createActivity(user.orgId, parsed.data);
  revalidatePath("/crm/activities");
  return { ok: true, message: "created" };
}

export async function updateActivityAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const id = requiredString(formData.get("id"));
  if (!id) return { ok: false, error: "Missing id" };

  const parsed = activitySchema.safeParse(buildInput(formData));
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error) };

  const ok = await updateActivity(user.orgId, id, parsed.data);
  if (!ok) return { ok: false, error: "Not found" };

  revalidatePath("/crm/activities");
  return { ok: true, message: "updated" };
}

export async function deleteActivityAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = requiredString(formData.get("id"));
  if (id) {
    await deleteActivity(user.orgId, id);
    revalidatePath("/crm/activities");
  }
  redirect("/crm/activities");
}

export async function toggleActivityAction(id: string, completed: boolean): Promise<void> {
  const user = await requireUser();
  await toggleActivity(user.orgId, id, completed);
  revalidatePath("/crm/activities");
}
