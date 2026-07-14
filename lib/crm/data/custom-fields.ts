import "server-only";
import { z } from "zod";
import type { CustomEntity, FieldType, Prisma } from "@prisma/client";
import { db } from "../db";
import { formatDate } from "../format";
import { tr, type Locale } from "../i18n";

/**
 * Definition of a per-org custom field. Values are stored in each record's
 * `customFields` JSON under the field's stable `key`.
 */
export const fieldSchema = z.object({
  label: z.string().trim().min(1, "Nom majburiy / Label required").max(60),
  type: z.enum(["TEXT", "NUMBER", "DATE", "SELECT", "BOOLEAN"]).catch("TEXT"),
  // Choices for SELECT fields; ignored for every other type.
  options: z.array(z.string().trim().min(1)).default([]),
});

export type FieldInput = z.infer<typeof fieldSchema>;

/** A field definition as consumed by clients (form dialogs, detail views). */
export type FieldDef = {
  id: string;
  key: string;
  label: string;
  type: FieldType;
  options: string[];
  order: number;
};

// ── Slug key derivation ────────────────────────────────────────────────────────

/** Turn a human label into a stable, lowercase snake_case key. */
function slugify(label: string): string {
  const base = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);
  return base || "field";
}

// ── Queries (all org-scoped) ───────────────────────────────────────────────────

/** All field definitions for one entity, in display order. */
export async function listFields(orgId: string, entity: CustomEntity): Promise<FieldDef[]> {
  const rows = await db.fieldDefinition.findMany({
    where: { orgId, entity },
    orderBy: { order: "asc" },
    select: { id: true, key: true, label: true, type: true, options: true, order: true },
  });
  return rows;
}

export async function getField(orgId: string, id: string) {
  return db.fieldDefinition.findFirst({ where: { id, orgId } });
}

/**
 * Create a field for `entity`. Derives a stable snake_case key from the label,
 * disambiguated to be unique within the org+entity, and appends it after the
 * existing fields (order = max + 1).
 */
export async function createField(orgId: string, entity: CustomEntity, input: FieldInput) {
  const existing = await db.fieldDefinition.findMany({
    where: { orgId, entity },
    select: { key: true, order: true },
  });

  const taken = new Set(existing.map((e) => e.key));
  const base = slugify(input.label);
  let key = base;
  let n = 2;
  while (taken.has(key)) key = `${base}_${n++}`;

  const maxOrder = existing.reduce((m, e) => Math.max(m, e.order), -1);

  return db.fieldDefinition.create({
    data: {
      orgId,
      entity,
      key,
      label: input.label,
      type: input.type,
      options: input.type === "SELECT" ? input.options : [],
      order: maxOrder + 1,
    },
  });
}

/** Update a field's label/type/options. The key and entity are immutable. */
export async function updateField(orgId: string, id: string, input: FieldInput) {
  const result = await db.fieldDefinition.updateMany({
    where: { id, orgId },
    data: {
      label: input.label,
      type: input.type,
      options: input.type === "SELECT" ? input.options : [],
    },
  });
  return result.count > 0;
}

export async function deleteField(orgId: string, id: string) {
  const result = await db.fieldDefinition.deleteMany({ where: { id, orgId } });
  return result.count > 0;
}

/**
 * Move a field up/down within its entity by swapping `order` with the adjacent
 * field. No-op at the boundary. Wrapped in a transaction so the two rows never
 * collide on the same order.
 */
export async function moveField(orgId: string, id: string, dir: "up" | "down"): Promise<boolean> {
  const current = await db.fieldDefinition.findFirst({
    where: { id, orgId },
    select: { id: true, order: true, entity: true },
  });
  if (!current) return false;

  const neighbor = await db.fieldDefinition.findFirst({
    where:
      dir === "up"
        ? { orgId, entity: current.entity, order: { lt: current.order } }
        : { orgId, entity: current.entity, order: { gt: current.order } },
    orderBy: { order: dir === "up" ? "desc" : "asc" },
    select: { id: true, order: true },
  });
  if (!neighbor) return false;

  await db.$transaction([
    db.fieldDefinition.update({ where: { id: current.id }, data: { order: neighbor.order } }),
    db.fieldDefinition.update({ where: { id: neighbor.id }, data: { order: current.order } }),
  ]);
  return true;
}

// ── Pure value helpers (used by server actions + detail views) ─────────────────

/**
 * Coerce a raw form string into the JS value for a given field type.
 * Returns `undefined` to signal "omit" (blank text/number/date). BOOLEAN always
 * resolves to a concrete true/false.
 */
export function coerceCustomValue(
  type: FieldType,
  raw: string,
): string | number | boolean | null | undefined {
  const s = (raw ?? "").toString();
  switch (type) {
    case "NUMBER": {
      const trimmed = s.trim();
      if (!trimmed) return undefined;
      const num = Number(trimmed);
      return Number.isFinite(num) ? num : null;
    }
    case "DATE": {
      const trimmed = s.trim();
      if (!trimmed) return undefined;
      return trimmed.slice(0, 10); // yyyy-mm-dd
    }
    case "BOOLEAN":
      return s === "on" || s === "true";
    default: {
      // TEXT + SELECT
      const trimmed = s.trim();
      return trimmed ? trimmed : undefined;
    }
  }
}

/**
 * Read `cf_<key>` inputs out of a FormData, coerce each per its definition, and
 * return a plain object holding only the keys that have a value.
 */
export function extractCustomFields(
  defs: Pick<FieldDef, "key" | "type">[],
  formData: FormData,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const def of defs) {
    const raw = formData.get(`cf_${def.key}`);
    const value = coerceCustomValue(def.type, raw == null ? "" : raw.toString());
    if (value !== undefined) out[def.key] = value;
  }
  return out;
}

/** Human-readable string for a stored custom value, for detail views. */
export function displayCustomValue(type: FieldType, value: unknown, locale: Locale): string {
  if (value === null || value === undefined || value === "") return "—";
  switch (type) {
    case "BOOLEAN":
      return value ? tr(locale, "Ha", "Yes") : tr(locale, "Yo'q", "No");
    case "DATE":
      return formatDate(String(value), locale);
    default:
      return String(value);
  }
}

/** Narrow a Prisma JsonValue (a record's `customFields`) into a plain object. */
export function asCustomFields(value: Prisma.JsonValue | null | undefined): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
