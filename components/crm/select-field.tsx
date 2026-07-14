"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Option } from "@/lib/crm/types";

const NONE = "__none__";

/**
 * A Radix Select that also submits its value through a hidden input, so it works
 * inside plain <form action={serverAction}> submissions (FormData). Use for every
 * dropdown inside a form. Server-side zod validation enforces `required`.
 */
export function SelectField({
  name,
  options,
  defaultValue,
  placeholder,
  clearable,
  clearLabel = "—",
  id,
  disabled,
  onValueChange,
}: {
  name: string;
  options: Option[];
  defaultValue?: string | null;
  placeholder?: string;
  clearable?: boolean;
  clearLabel?: string;
  id?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
}) {
  const [value, setValue] = React.useState<string>(defaultValue || "");
  const submitValue = value === NONE ? "" : value;

  const handle = (v: string) => {
    setValue(v);
    onValueChange?.(v === NONE ? "" : v);
  };

  return (
    <>
      <input type="hidden" name={name} value={submitValue} />
      <Select value={value} onValueChange={handle} disabled={disabled}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {clearable && <SelectItem value={NONE}>{clearLabel}</SelectItem>}
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
