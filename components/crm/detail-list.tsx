import * as React from "react";
import { cn } from "@/lib/utils";

/** Vertical label/value list for detail/side panels. */
export function DetailList({ className, children }: { className?: string; children: React.ReactNode }) {
  return <dl className={cn("flex flex-col divide-y divide-border", className)}>{children}</dl>;
}

export function DetailRow({
  label,
  children,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="max-w-[60%] text-right text-sm font-medium text-foreground">
        {children ?? "—"}
      </dd>
    </div>
  );
}
