"use client";

import { ChevronRight } from "lucide-react";
import { useCopy } from "@/lib/i18n";
import {
  Container,
  Section,
  SectionHeading,
  Reveal,
  GoldGlow,
} from "@/components/primitives";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/icons";

export function HowItWorks() {
  const t = useCopy();
  const steps = t.how.steps;

  return (
    <Section id="how" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-40"
        aria-hidden="true"
      />
      <GoldGlow className="left-1/2 top-8 h-64 w-[40rem] -translate-x-1/2 opacity-60" />

      <Container className="relative">
        <SectionHeading
          eyebrow={t.how.eyebrow}
          title={t.how.title}
          subtitle={t.how.subtitle}
          align="center"
        />

        <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            // Chevron hints the left-to-right flow between cards within a row on lg.
            const showConnector = (i + 1) % 4 !== 0 && i !== steps.length - 1;
            return (
              <Reveal as="li" key={step.title} delayIndex={i} className="relative">
                <Card className="relative h-full p-6">
                  {/* Faint left gold accent bar */}
                  <span
                    className="absolute left-0 top-6 h-8 w-0.5 rounded bg-gold-500/40"
                    aria-hidden="true"
                  />

                  <div className="flex items-center">
                    <span className="font-display text-sm font-semibold tabular-nums text-gold-400/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="ml-auto grid size-10 place-items-center rounded-xl bg-gold-500/10 text-gold-400">
                      <Icon name={step.icon} className="size-5" />
                    </span>
                  </div>

                  <h3 className="mt-4 font-display font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </Card>

                {showConnector ? (
                  <span
                    className="pointer-events-none absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-gold-500/40 lg:block"
                    aria-hidden="true"
                  >
                    <ChevronRight className="size-5" strokeWidth={1.75} />
                  </span>
                ) : null}
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
