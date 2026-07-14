import { Plus } from "lucide-react";
import type { CustomEntity, FieldType } from "@prisma/client";
import { requireAdmin } from "@/lib/crm/auth";
import { getT } from "@/lib/crm/i18n-server";
import { listFields, type FieldDef } from "@/lib/crm/data/custom-fields";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { FieldDialog } from "./field-dialog";
import { FieldRowActions } from "./field-row-actions";

const TYPE_LABELS: Record<FieldType, { uz: string; en: string }> = {
  TEXT: { uz: "Matn", en: "Text" },
  NUMBER: { uz: "Raqam", en: "Number" },
  DATE: { uz: "Sana", en: "Date" },
  SELECT: { uz: "Tanlov", en: "Select" },
  BOOLEAN: { uz: "Ha/Yo'q", en: "Yes/No" },
};

export default async function FieldsSettingsPage() {
  const user = await requireAdmin();
  const { tr } = await getT();

  const [contactFields, companyFields, dealFields] = await Promise.all([
    listFields(user.orgId, "CONTACT"),
    listFields(user.orgId, "COMPANY"),
    listFields(user.orgId, "DEAL"),
  ]);

  const sections: { entity: CustomEntity; title: string; defs: FieldDef[] }[] = [
    { entity: "CONTACT", title: tr("Kontaktlar", "Contacts"), defs: contactFields },
    { entity: "COMPANY", title: tr("Kompaniyalar", "Companies"), defs: companyFields },
    { entity: "DEAL", title: tr("Bitimlar", "Deals"), defs: dealFields },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-base font-semibold text-foreground">
          {tr("Qo'shimcha maydonlar", "Custom fields")}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {tr(
            "Kontakt, kompaniya va bitimlarga o'z maydonlaringizni qo'shing",
            "Add your own fields to contacts, companies and deals",
          )}
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.entity} className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {section.title}
            </h3>
            <FieldDialog
              mode="create"
              entity={section.entity}
              trigger={
                <Button size="sm" variant="secondary">
                  <Plus className="size-4" />
                  {tr("Maydon qo'shish", "Add field")}
                </Button>
              }
            />
          </div>

          {section.defs.length === 0 ? (
            <Card className="px-4 py-6 text-center text-sm text-muted-foreground">
              {tr("Hozircha maydonlar yo'q", "No custom fields yet")}
            </Card>
          ) : (
            <Card className="divide-y divide-border">
              {section.defs.map((def, i) => (
                <div
                  key={def.id}
                  className="flex items-center justify-between gap-4 px-4 py-3.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="truncate font-medium text-foreground">{def.label}</span>
                    <StatusPill tone="gold">
                      {tr(TYPE_LABELS[def.type].uz, TYPE_LABELS[def.type].en)}
                    </StatusPill>
                    {def.type === "SELECT" && def.options.length > 0 && (
                      <span className="hidden truncate text-xs text-muted-foreground sm:inline">
                        {def.options.join(", ")}
                      </span>
                    )}
                  </div>
                  <FieldRowActions
                    field={{
                      id: def.id,
                      label: def.label,
                      type: def.type,
                      options: def.options,
                    }}
                    isFirst={i === 0}
                    isLast={i === section.defs.length - 1}
                  />
                </div>
              ))}
            </Card>
          )}
        </div>
      ))}
    </div>
  );
}
