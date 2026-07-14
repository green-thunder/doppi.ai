"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { CustomEntity } from "@prisma/client";
import { requireAdmin } from "@/lib/crm/auth";
import {
  createField,
  deleteField,
  fieldSchema,
  moveField,
  updateField,
} from "@/lib/crm/data/custom-fields";
import { requiredString, toFieldErrors, type FormState } from "@/lib/crm/forms";

const ENTITY_MAP: Record<string, CustomEntity> = {
  CONTACT: "CONTACT",
  COMPANY: "COMPANY",
  DEAL: "DEAL",
};

/** Split a textarea (one option per line, commas also allowed) into a clean list. */
function parseOptions(v: FormDataEntryValue | null): string[] {
  return (v ?? "")
    .toString()
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildInput(fd: FormData) {
  return {
    label: requiredString(fd.get("label")),
    type: (fd.get("type") ?? "TEXT").toString(),
    options: parseOptions(fd.get("options")),
  };
}

export async function createFieldAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireAdmin();
  const entity = ENTITY_MAP[requiredString(formData.get("entity"))];
  if (!entity) return { ok: false, error: "Invalid entity" };

  const parsed = fieldSchema.safeParse(buildInput(formData));
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error) };

  await createField(user.orgId, entity, parsed.data);
  revalidatePath("/crm/settings/fields");
  return { ok: true, message: "created" };
}

export async function updateFieldAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireAdmin();
  const id = requiredString(formData.get("id"));
  if (!id) return { ok: false, error: "Missing id" };

  const parsed = fieldSchema.safeParse(buildInput(formData));
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error) };

  const ok = await updateField(user.orgId, id, parsed.data);
  if (!ok) return { ok: false, error: "Not found" };

  revalidatePath("/crm/settings/fields");
  return { ok: true, message: "updated" };
}

export async function deleteFieldAction(formData: FormData): Promise<void> {
  const user = await requireAdmin();
  const id = requiredString(formData.get("id"));
  if (id) {
    await deleteField(user.orgId, id);
    revalidatePath("/crm/settings/fields");
  }
  redirect("/crm/settings/fields");
}

export async function moveFieldAction(id: string, dir: "up" | "down"): Promise<void> {
  const user = await requireAdmin();
  if (!id || (dir !== "up" && dir !== "down")) return;
  await moveField(user.orgId, id, dir);
  revalidatePath("/crm/settings/fields");
}
