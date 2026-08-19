"use client";

import * as React from "react";
import { ModuleChip } from "@/components/module-chip";
import { Medallion, DoppiMark } from "@/components/brand";
import { cn } from "@/lib/utils";

export interface OrbitModule {
  label: string;
  icon: React.ReactNode;
}

// Fixed orbit anchor points (percent of the square diagram box). Each module is
// centered on its point via translate(-50%, -50%). Purely presentational.
const ORBIT_POSITIONS = [
  { top: 2, left: 50 },
  { top: 27, left: 93 },
  { top: 73, left: 93 },
  { top: 98, left: 50 },
  { top: 73, left: 7 },
  { top: 27, left: 7 },
] as const;

/**
 * Desktop constellation: module chips around the hub; hover lights a spoke.
 * The only client part of the Solution section — icons come in as
 * server-rendered nodes.
 */
export function OrbitDiagram({
  modules,
  centerLabel,
}: {
  modules: OrbitModule[];
  centerLabel: string;
}) {
  const [hovered, setHovered] = React.useState<number | null>(null);

  return (
    <div className="relative mx-auto hidden h-[30rem] w-[30rem] lg:block">
      {/* Static constellation: connector lines + fixed module chips (no spin) */}
      <div className="absolute inset-0">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="47"
            fill="none"
            strokeWidth="0.25"
            strokeDasharray="0.5 2"
            className="stroke-gold-500/20"
          />
          {ORBIT_POSITIONS.map((p, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={p.left}
              y2={p.top}
              strokeWidth={hovered === i ? 0.7 : 0.3}
              strokeDasharray="1 1.5"
              className={cn(
                "transition-[stroke,stroke-width] duration-200",
                hovered === i
                  ? "stroke-gold-400"
                  : hovered === null
                    ? "stroke-gold-500/20"
                    : "stroke-gold-500/10",
              )}
            />
          ))}
        </svg>

        <ul>
          {modules.map((m, i) => {
            const pos = ORBIT_POSITIONS[i % ORBIT_POSITIONS.length];
            return (
              <li
                key={m.label}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <ModuleChip icon={m.icon} label={m.label} nowrap active={hovered === i} />
              </li>
            );
          })}
        </ul>
      </div>

      {/* Center hub (does not rotate, does not pulse — the live demos own the
          "alive" signals on this page) */}
      <div className="absolute left-1/2 top-1/2 grid size-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold-500/40 bg-card text-center shadow-gold">
        <Medallion className="absolute inset-0 h-full w-full text-gold-500/10" />
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <DoppiMark className="h-9 w-12 text-gold-400" />
          <span className="font-display text-sm font-bold tracking-tight text-foreground">
            {centerLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
