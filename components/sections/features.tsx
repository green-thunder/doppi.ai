"use client";

import { useCopy } from "@/lib/i18n";
import {
  Container,
  Section,
  SectionHeading,
  Reveal,
} from "@/components/primitives";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/icons";

export function Features() {
  const t = useCopy();

  return (
    <Section id="features">
      <Container>
        <SectionHeading
          eyebrow={t.features.eyebrow}
          title={t.features.title}
          subtitle={t.features.subtitle}
          align="center"
        />

        <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((item, i) => (
            <Reveal key={item.title} as="li" delayIndex={i}>
              <Card className="group relative h-full overflow-hidden p-6 transition-colors hover:border-gold-500/30">
                {/* Hover glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold-500/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100"
                />

                <div className="relative z-10">
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400">
                    <Icon name={item.icon} className="size-6" />
                  </span>

                  <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
