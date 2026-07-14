import * as React from "react";
import { cn } from "@/lib/utils";

/** Centered empty state: icon bubble + title + description + optional action. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-16 text-center",
        className,
      )}
    >
      {icon && (
        <div className="grid size-12 place-items-center rounded-2xl border border-border bg-gold-500/10 text-gold-400">
          {icon}
        </div>
      )}
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
