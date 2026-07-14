"use client";

import * as React from "react";
import type { FieldType } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Field } from "@/components/crm/field";
import { SelectField } from "@/components/crm/select-field";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import type { Option } from "@/lib/crm/types";

type FieldDef = {
  id: string;
  key: string;
  label: string;
  type: FieldType;
  options: string[];
  order: number;
};

type EntitySlug = "contact" | "company" | "deal";

/**
 * Renders the org's custom-field inputs inside a form. Fetches the field
 * definitions client-side from /api/crm/fields/:entity so list pages never have
 * to know about them. Each input is named `cf_<key>` so the server action can
 * pick it up. Renders nothing while loading or when the org has no custom fields.
 */
export function CustomFieldInputs({
  entity,
  values,
}: {
  entity: EntitySlug;
  values?: Record<string, unknown> | null;
}) {
  const { tr } = useCrmI18n();
  const [defs, setDefs] = React.useState<FieldDef[] | null>(null);

  React.useEffect(() => {
    let active = true;
    fetch(`/api/crm/fields/${entity}`)
      .then((r) => (r.ok ? (r.json() as Promise<FieldDef[]>) : []))
      .then((data) => {
        if (active) setDefs(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setDefs([]);
      });
    return () => {
      active = false;
    };
  }, [entity]);

  if (!defs || defs.length === 0) return null;

  return (
    <div className="grid gap-4 border-t border-border pt-4 sm:col-span-2 sm:grid-cols-2">
      <h3 className="font-display text-sm font-semibold text-muted-foreground sm:col-span-2">
        {tr("Qo'shimcha maydonlar", "Custom fields")}
      </h3>
      {defs.map((def) => (
        <CustomFieldInput key={def.id} def={def} value={values?.[def.key]} />
      ))}
    </div>
  );
}

function CustomFieldInput({ def, value }: { def: FieldDef; value: unknown }) {
  const { t, tr } = useCrmI18n();
  const name = `cf_${def.key}`;

  if (def.type === "BOOLEAN") {
    return <BooleanField def={def} name={name} value={value} />;
  }

  if (def.type === "SELECT") {
    const options: Option[] = def.options.map((o) => ({ value: o, label: o }));
    return (
      <Field label={def.label} htmlFor={name}>
        <SelectField
          name={name}
          id={name}
          options={options}
          defaultValue={value != null ? String(value) : undefined}
          placeholder={tr("Tanlang", "Select")}
          clearable
          clearLabel={t.common.none}
        />
      </Field>
    );
  }

  if (def.type === "NUMBER") {
    return (
      <Field label={def.label} htmlFor={name}>
        <Input
          id={name}
          name={name}
          type="number"
          step="any"
          defaultValue={value != null ? String(value) : ""}
        />
      </Field>
    );
  }

  if (def.type === "DATE") {
    return (
      <Field label={def.label} htmlFor={name}>
        <Input
          id={name}
          name={name}
          type="date"
          defaultValue={value != null ? String(value).slice(0, 10) : ""}
        />
      </Field>
    );
  }

  // TEXT
  return (
    <Field label={def.label} htmlFor={name}>
      <Input id={name} name={name} defaultValue={value != null ? String(value) : ""} />
    </Field>
  );
}

/** Switch backed by a hidden `cf_<key>` input carrying "on"/"false". */
function BooleanField({
  def,
  name,
  value,
}: {
  def: FieldDef;
  name: string;
  value: unknown;
}) {
  const { t } = useCrmI18n();
  const [on, setOn] = React.useState<boolean>(value === true || value === "true" || value === "on");

  return (
    <Field label={def.label}>
      <input type="hidden" name={name} value={on ? "on" : "false"} />
      <label className="flex h-10 items-center justify-between gap-4 rounded-xl border border-border px-3.5">
        <span className="text-sm text-muted-foreground">{on ? t.common.yes : t.common.no}</span>
        <Switch checked={on} onCheckedChange={setOn} />
      </label>
    </Field>
  );
}
