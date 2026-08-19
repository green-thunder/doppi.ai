import type * as React from "react";
import { cn } from "@/lib/utils";

/**
 * One CRM-module chip. Directive-free and icon-agnostic: the icon arrives as a
 * pre-rendered node, so server callers (the mobile grid) render it entirely on
 * the server and the client orbit diagram never pulls the icon map into the
 * bundle.
 */
export function ModuleChip({
  icon,
  label,
  nowrap = false,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  nowrap?: boolean;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-full items-center gap-3 rounded-2xl border bg-card/70 px-3 py-2.5 shadow-card transition-colors duration-200 sm:px-4 sm:py-3",
        active
          ? "border-gold-500/60 bg-card shadow-gold"
          : "border-border hover:border-gold-500/40 hover:bg-card",
      )}
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gold-500/10 sm:size-9">
        {icon}
      </span>
      <span
        className={cn(
          "min-w-0 text-sm font-medium leading-snug text-foreground",
          nowrap && "whitespace-nowrap",
        )}
      >
        {label}
      </span>
    </div>
  );
}
