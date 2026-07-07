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

export function Problem() {
  const t = useCopy();

  return (
    <Section id="problem" className="overflow-hidden">
      {/* Decorative glow */}
      <GoldGlow className="right-0 top-12 h-64 w-[26rem] translate-x-1/3 opacity-50" />

      <Container className="relative">
        <SectionHeading
          eyebrow={t.problem.eyebrow}
          title={t.problem.title}
          subtitle={t.problem.subtitle}
          align="left"
        />

        <ul className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {t.problem.items.map((item, i) => (
            <Reveal
              key={item.title}
              as="li"
              delayIndex={i}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card/40 p-5 transition-colors hover:border-foreground/15"
            >
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-300 transition-colors group-hover:bg-red-500/15 light:text-red-600">
                <Icon name={item.icon} className="size-5" strokeWidth={1.75} />
              </span>

              <div className="min-w-0">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
