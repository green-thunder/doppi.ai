import * as React from "react";

export type StageBar = {
  label: string;
  value: number;
  valueLabel: string;
  count: number;
  color: string;
};

/**
 * Horizontal bar chart of pipeline value per stage. Pure CSS (no client JS):
 * each row is scaled to the largest value in the set. `valueLabel` is
 * preformatted by the caller (locale/currency live there, not here).
 */
export function StageBarChart({
  data,
  emptyLabel = "—",
}: {
  data: StageBar[];
  emptyLabel?: string;
}) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="flex flex-col gap-4">
      {data.map((d) => {
        const pct = Math.round((d.value / max) * 100);
        return (
          <div key={d.label} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: d.color }}
                  aria-hidden="true"
                />
                <span className="truncate">{d.label}</span>
                <span className="shrink-0 text-xs font-normal text-muted-foreground">
                  ({d.count})
                </span>
              </span>
              <span className="shrink-0 font-display text-sm font-semibold tabular-nums text-foreground">
                {d.valueLabel}
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-foreground/[0.06]">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.max(pct, d.value > 0 ? 3 : 0)}%`,
                  backgroundColor: d.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
