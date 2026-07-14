import type { FieldType } from "@prisma/client";
import { DetailRow } from "@/components/crm/detail-list";
import { displayCustomValue, type FieldDef } from "@/lib/crm/data/custom-fields";
import type { Locale } from "@/lib/crm/i18n";

/**
 * Renders a DetailRow per custom field definition, resolving each value from the
 * record's `customFields`. Server component (no hooks) — drop it inside an
 * existing <DetailList>. Returns null when the org has no custom fields.
 */
export function CustomFieldValues({
  defs,
  values,
  locale,
}: {
  defs: Pick<FieldDef, "id" | "key" | "label" | "type">[];
  values: Record<string, unknown>;
  locale: Locale;
}) {
  if (!defs || defs.length === 0) return null;

  return (
    <>
      {defs.map((def) => (
        <DetailRow key={def.id} label={def.label}>
          {displayCustomValue(def.type as FieldType, values?.[def.key], locale)}
        </DetailRow>
      ))}
    </>
  );
}
