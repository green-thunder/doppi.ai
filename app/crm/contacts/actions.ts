"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { db } from "@/lib/crm/db";
import { parseCsv } from "@/lib/crm/csv";
import {
  contactSchema,
  createContact,
  deleteContact,
  updateContact,
} from "@/lib/crm/data/contacts";
import { extractCustomFields, listFields } from "@/lib/crm/data/custom-fields";
import { runAutomations } from "@/lib/crm/data/automations";
import {
  optionalString,
  requiredString,
  toFieldErrors,
  type FormState,
} from "@/lib/crm/forms";

function parseTags(v: FormDataEntryValue | null): string[] {
  return (v ?? "")
    .toString()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildInput(fd: FormData) {
  return {
    firstName: requiredString(fd.get("firstName")),
    lastName: optionalString(fd.get("lastName")),
    email: optionalString(fd.get("email")),
    phone: optionalString(fd.get("phone")),
    position: optionalString(fd.get("position")),
    companyId: optionalString(fd.get("companyId")),
    ownerId: optionalString(fd.get("ownerId")),
    source: (fd.get("source") ?? "MANUAL").toString(),
    tags: parseTags(fd.get("tags")),
    notes: optionalString(fd.get("notes")),
  };
}

export async function createContactAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = contactSchema.safeParse(buildInput(formData));
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error) };

  const customFields = extractCustomFields(await listFields(user.orgId, "CONTACT"), formData);
  const contact = await createContact(user.orgId, parsed.data, customFields);
  await runAutomations(user.orgId, "CONTACT_CREATED", {
    contactId: contact.id,
    ownerId: contact.ownerId ?? undefined,
    createdById: user.id,
  });
  revalidatePath("/crm/contacts");
  return { ok: true, message: "created" };
}

export async function updateContactAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const id = requiredString(formData.get("id"));
  if (!id) return { ok: false, error: "Missing id" };

  const parsed = contactSchema.safeParse(buildInput(formData));
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error) };

  const customFields = extractCustomFields(await listFields(user.orgId, "CONTACT"), formData);
  const ok = await updateContact(user.orgId, id, parsed.data, customFields);
  if (!ok) return { ok: false, error: "Not found" };

  revalidatePath("/crm/contacts");
  revalidatePath(`/crm/contacts/${id}`);
  return { ok: true, message: "updated" };
}

export async function deleteContactAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = requiredString(formData.get("id"));
  if (id) {
    await deleteContact(user.orgId, id);
    revalidatePath("/crm/contacts");
  }
  redirect("/crm/contacts");
}

/**
 * Build a case-insensitive accessor over one parsed CSV row. `get(...aliases)`
 * returns the first present, non-empty (trimmed) value among the aliases.
 */
function rowLookup(row: Record<string, string>) {
  const lower: Record<string, string> = {};
  for (const key of Object.keys(row)) lower[key.trim().toLowerCase()] = row[key];
  return (...aliases: string[]): string => {
    for (const alias of aliases) {
      const v = lower[alias.toLowerCase()];
      if (v != null && v.trim() !== "") return v.trim();
    }
    return "";
  };
}

/** Import contacts from an uploaded CSV file (capped at 1000 rows). */
export async function importContactsAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Fayl tanlanmagan / No file selected" };
  }

  const text = await file.text();
  const rows = parseCsv(text).slice(0, 1000);

  // Find-or-create companies by name, memoized per batch so a repeated company
  // name doesn't spawn duplicate rows.
  const companyIds = new Map<string, string>();
  async function resolveCompanyId(name: string): Promise<string> {
    const key = name.toLowerCase();
    const cached = companyIds.get(key);
    if (cached) return cached;
    const existing = await db.company.findFirst({
      where: { orgId: user.orgId, name: { equals: name, mode: "insensitive" } },
      select: { id: true },
    });
    const id =
      existing?.id ??
      (await db.company.create({ data: { orgId: user.orgId, name } })).id;
    companyIds.set(key, id);
    return id;
  }

  let count = 0;
  for (const row of rows) {
    const get = rowLookup(row);

    const firstName = get("firstName", "First name", "Ism");
    if (!firstName) continue; // Skip rows without a first name.

    const lastName = get("lastName", "Last name", "Familiya");
    const email = get("email", "Email", "E-mail");
    const phone = get("phone", "Phone", "Telefon");
    const position = get("position", "Position", "Lavozim");
    const companyName = get("company", "Company", "Kompaniya");
    const tagsRaw = get("tags", "Tags", "Teglar");
    const tags = tagsRaw
      ? tagsRaw.split(/[;,]/).map((s) => s.trim()).filter(Boolean)
      : [];

    const companyId = companyName ? await resolveCompanyId(companyName) : null;

    await db.contact.create({
      data: {
        orgId: user.orgId,
        firstName,
        lastName: lastName || null,
        email: email || null,
        phone: phone || null,
        position: position || null,
        source: "IMPORT",
        tags,
        companyId,
      },
    });
    count += 1;
  }

  revalidatePath("/crm/contacts");
  return { ok: true, message: String(count) };
}
