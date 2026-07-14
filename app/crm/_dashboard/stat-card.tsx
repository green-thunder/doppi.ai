import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * A single KPI tile: gold icon bubble, large display value, muted label, and an
 * optional hint line. Server component — no interactivity.
 */
export function StatCard({
  label,
  value,
  icon,
  hint,
  accent = "gold",
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  icon?: React.ReactNode;
  hint?: React.ReactNode;
  accent?: "gold" | "green" | "red" | "blue";
  className?: string;
}) {
  const accentClass: Record<NonNullable<typeof accent>, string> = {
    gold: "border-gold-500/25 bg-gold-500/10 text-gold-400",
    green: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
    red: "border-red-500/25 bg-red-500/10 text-red-400",
    blue: "border-sky-500/25 bg-sky-500/10 text-sky-400",
  };

  return (
    <Card className={cn("flex items-start gap-4 p-5", className)}>
      {icon && (
        <div
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-xl border",
            accentClass[accent],
          )}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 font-display text-2xl font-bold leading-tight tracking-tight text-foreground">
          {value}
        </p>
        {hint && <p className="mt-0.5 truncate text-xs text-muted-foreground">{hint}</p>}
      </div>
    </Card>
  );
}
