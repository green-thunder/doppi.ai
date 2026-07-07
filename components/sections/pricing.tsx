"use client";

import { Check } from "lucide-react";
import { useCopy } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container, Section, SectionHeading, Reveal, GoldGlow } from "@/components/primitives";

export function Pricing() {
  const t = useCopy();

  return (
    <Section id="pricing" className="relative overflow-hidden">
      <GoldGlow className="left-1/2 top-24 h-64 w-[40rem] -translate-x-1/2 opacity-70" />

      <Container className="relative">
        <SectionHeading
          eyebrow={t.pricing.eyebrow}
          title={t.pricing.title}
          subtitle={t.pricing.subtitle}
          align="center"
        />

        <div className="mt-14 grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-4">
          {t.pricing.tiers.map((tier, i) => (
            <Reveal key={tier.id} delayIndex={i}>
              {tier.popular ? (
                <div className="relative flex h-full flex-col rounded-2xl border border-gold-500/50 bg-card p-6 shadow-gold">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>{t.pricing.popularLabel}</Badge>
                  </div>
                  <PricingBody tier={tier} />
                </div>
              ) : (
                <Card className="flex h-full flex-col p-6">
                  <PricingBody tier={tier} />
                </Card>
              )}
            </Reveal>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          {t.pricing.trialNote}
        </p>
      </Container>
    </Section>
  );
}

function PricingBody({
  tier,
}: {
  tier: ReturnType<typeof useCopy>["pricing"]["tiers"][number];
}) {
  return (
    <>
      <h3 className="font-display text-lg font-semibold text-foreground">
        {tier.name}
      </h3>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-display text-4xl font-bold text-foreground">
          {tier.price}
        </span>
        {tier.period ? (
          <span className="text-sm text-muted-foreground">{tier.period}</span>
        ) : null}
      </div>

      <p className="mt-2 min-h-[2.5rem] text-sm text-muted-foreground">
        {tier.tagline}
      </p>

      <div className="my-6 h-px bg-border" />

      <ul className="flex-1 space-y-3">
        {tier.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-sm text-foreground/85"
          >
            <Check className="mt-0.5 size-4 shrink-0 text-gold-400" strokeWidth={1.75} aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        variant={tier.popular ? "primary" : "secondary"}
        className="mt-8 w-full"
      >
        <a href="#contact">{tier.cta}</a>
      </Button>
    </>
  );
}
