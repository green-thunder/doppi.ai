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
import { Icon } from "@/components/icons";
import { AnimatedMedallion } from "@/components/decor";

export function About() {
  const t = useCopy();

  return (
    <Section id="about" className="relative overflow-hidden">
      <GoldGlow className="right-1/4 top-0 h-64 w-[30rem]" />

      <Container className="relative">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Left — narrative + facts */}
          <div>
            <SectionHeading
              eyebrow={t.about.eyebrow}
              title={t.about.title}
              align="left"
            />

            <p className="mt-6 text-base leading-relaxed text-foreground/90 sm:text-lg">
              {t.about.lead}
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {t.about.vision}
            </p>

            <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-3">
              {t.about.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                    {fact.label}
                  </dt>
                  <CountUp
                    as="dd"
                    value={fact.value}
                    className="mt-1 font-display font-semibold text-foreground"
                  />
                </div>
              ))}
            </dl>
          </div>

          {/* Right — differentiators */}
          <div className="relative">
            <AnimatedMedallion className="-right-16 -top-10 hidden h-64 w-64 text-gold-500/10 lg:block" />

            <div className="relative flex flex-col gap-4">
              {t.about.points.map((point, i) => (
                <Reveal key={point.title} delayIndex={i}>
                  <InteractiveCard className="p-5" contentClassName="flex items-start gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold-500/10 text-gold-400 transition-transform duration-300 group-hover:scale-110 motion-reduce:transform-none">
                      <Icon name={point.icon} className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-display font-semibold text-foreground">
                        {point.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {point.desc}
                      </p>
                    </div>
                  </InteractiveCard>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
