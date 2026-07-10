"use client";

import { useCopy } from "@/lib/i18n";
import {
  Container,
  Section,
  SectionHeading,
  Reveal,
  GoldGlow,
  InteractiveCard,
  CountUp,
} from "@/components/primitives";
import { AnimatedMedallion } from "@/components/decor";

export function Results() {
  const t = useCopy();

  return (
    <Section id="results" className="relative overflow-hidden">
      {/* Decorative layers */}
      <AnimatedMedallion className="-left-24 top-1/2 hidden h-[26rem] w-[26rem] -translate-y-1/2 text-gold-500/[0.07] lg:block" />
      <GoldGlow className="right-[-6rem] top-1/3 h-72 w-[32rem]" />

      <Container className="relative">
        <SectionHeading
          eyebrow={t.results.eyebrow}
          title={t.results.title}
          subtitle={t.results.subtitle}
          align="center"
        />

        <ul className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {t.results.stats.map((stat, i) => (
            <Reveal key={stat.label} as="li" delayIndex={i}>
              <InteractiveCard className="h-full p-6 text-center sm:p-8 sm:text-left">
                <CountUp
                  as="p"
                  value={stat.value}
                  className="font-display text-4xl font-bold leading-none tracking-tight text-gradient-gold sm:text-5xl"
                />
                <p className="mt-2 text-sm leading-snug text-muted-foreground">
                  {stat.label}
                </p>
              </InteractiveCard>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
