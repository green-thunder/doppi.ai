"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import {
  companySchema,
  createCompany,
  deleteCompany,
  updateCompany,
} from "@/lib/crm/data/companies";
import { extractCustomFields, listFields } from "@/lib/crm/data/custom-fields";
import {
  optionalString,
  requiredString,
  toFieldErrors,
  type FormState,
} from "@/lib/crm/forms";

function buildInput(fd: FormData) {
  return {
    name: requiredString(fd.get("name")),
    website: optionalString(fd.get("website")),
    industry: optionalString(fd.get("industry")),
    phone: optionalString(fd.get("phone")),
    email: optionalString(fd.get("email")),
    address: optionalString(fd.get("address")),
    notes: optionalString(fd.get("notes")),
    ownerId: optionalString(fd.get("ownerId")),
  };
}

export async function createCompanyAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = companySchema.safeParse(buildInput(formData));
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error) };

  const customFields = extractCustomFields(await listFields(user.orgId, "COMPANY"), formData);
  await createCompany(user.orgId, parsed.data, customFields);
  revalidatePath("/crm/companies");
  return { ok: true, message: "created" };
}

export async function updateCompanyAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const id = requiredString(formData.get("id"));
  if (!id) return { ok: false, error: "Missing id" };

  const parsed = companySchema.safeParse(buildInput(formData));
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error) };

  const customFields = extractCustomFields(await listFields(user.orgId, "COMPANY"), formData);
  const ok = await updateCompany(user.orgId, id, parsed.data, customFields);
  if (!ok) return { ok: false, error: "Not found" };

  revalidatePath("/crm/companies");
  revalidatePath(`/crm/companies/${id}`);
  return { ok: true, message: "updated" };
}

export async function deleteCompanyAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = requiredString(formData.get("id"));
  if (id) {
    await deleteCompany(user.orgId, id);
    revalidatePath("/crm/companies");
  }
  redirect("/crm/companies");
}
