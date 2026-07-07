"use client";

import { useCopy } from "@/lib/i18n";
import {
  Container,
  Section,
  SectionHeading,
  Reveal,
  GoldGlow,
} from "@/components/primitives";
import { Icon } from "@/components/icons";
import { Medallion, DoppiMark } from "@/components/brand";
import { cn } from "@/lib/utils";

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

function ModuleChip({
  icon,
  label,
  nowrap = false,
}: {
  icon: string;
  label: string;
  nowrap?: boolean;
}) {
  return (
    <div className="flex h-full items-center gap-3 rounded-2xl border border-border bg-card/70 px-4 py-3 shadow-card backdrop-blur-sm transition-colors duration-200 hover:border-gold-500/40 hover:bg-card">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gold-500/10">
        <Icon name={icon} className="size-5 text-gold-400" />
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

export function Solution() {
  const t = useCopy();

  return (
    <Section id="solution" className="relative overflow-hidden">
      <GoldGlow className="left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2" />

      <Container className="relative">
        <SectionHeading
          eyebrow={t.solution.eyebrow}
          title={t.solution.title}
          subtitle={t.solution.subtitle}
          align="center"
        />

        <Reveal className="relative">
          {/* ------------------------------------------------------------ */}
          {/* Desktop: orbit diagram of 6 modules around the Do'ppi hub    */}
          {/* ------------------------------------------------------------ */}
          <div className="relative mx-auto mt-16 hidden h-[30rem] w-[30rem] lg:block">
            {/* Connector lines + orbit ring (decorative) */}
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
                  strokeWidth="0.3"
                  strokeDasharray="1 1.5"
                  className="stroke-gold-500/20"
                />
              ))}
            </svg>

            {/* Module nodes */}
            <ul>
              {t.solution.modules.map((m, i) => {
                const pos = ORBIT_POSITIONS[i % ORBIT_POSITIONS.length];
                return (
                  <li
                    key={m.label}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
                  >
                    <ModuleChip icon={m.icon} label={m.label} nowrap />
                  </li>
                );
              })}
            </ul>

            {/* Center hub */}
            <div className="absolute left-1/2 top-1/2 grid size-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold-500/40 bg-card text-center shadow-gold">
              <Medallion className="absolute inset-0 h-full w-full text-gold-500/10" />
              <span
                aria-hidden="true"
                className="absolute inset-0 animate-pulse-ring rounded-full border border-gold-500/40"
              />
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <DoppiMark className="h-9 w-12 text-gold-400" />
                <span className="font-display text-sm font-bold tracking-tight text-foreground">
                  {t.solution.centerLabel}
                </span>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* Mobile / tablet: hub chip + 2-column grid of modules        */}
          {/* ------------------------------------------------------------ */}
          <div className="mt-12 lg:hidden">
            <div className="mx-auto flex w-fit items-center gap-3 rounded-2xl border border-gold-500/40 bg-card px-5 py-3 shadow-gold">
              <DoppiMark className="h-6 w-8 shrink-0 text-gold-400" />
              <span className="font-display text-sm font-bold tracking-tight text-foreground">
                {t.solution.centerLabel}
              </span>
            </div>

            <ul className="mt-6 grid grid-cols-2 gap-3">
              {t.solution.modules.map((m) => (
                <li key={m.label}>
                  <ModuleChip icon={m.icon} label={m.label} />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <p className="mx-auto mt-14 max-w-xl text-center text-muted-foreground">
          {t.solution.note}
        </p>
      </Container>
    </Section>
  );
}
