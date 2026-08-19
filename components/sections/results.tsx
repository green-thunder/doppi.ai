import { cn } from "@/lib/utils";
import type { SiteCopy } from "@/lib/content";
import { Container, Section, SectionHeading, GoldGlow } from "@/components/layout";
import { Reveal, CountUp } from "@/components/primitives";
import { AnimatedMedallion } from "@/components/decor";

/**
 * Stats as one bordered panel with hairline dividers (gap-px over bg-border)
 * instead of six identical hover-cards: numbers ARE the content here, so the
 * card chrome added nothing — and the lead stat gets to be the focal point.
 */
export function Results({ t }: { t: SiteCopy["results"] }) {
  return (
    <Section id="results" tone="raised" className="relative overflow-hidden">
      {/* Decorative layers */}
      <AnimatedMedallion className="-left-24 top-1/2 hidden h-[26rem] w-[26rem] -translate-y-1/2 text-gold-500/[0.07] lg:block" />
      <GoldGlow className="right-[-6rem] top-1/3 h-72 w-[32rem]" />

      <Container className="relative">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
          align="center"
        />

        <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:mt-16 min-[420px]:grid-cols-2 lg:grid-cols-3">
          {t.stats.map((stat, i) => (
            <li key={stat.label} className="bg-background">
              <Reveal delayIndex={i} className="h-full p-6 text-center sm:p-8 sm:text-left">
                <CountUp
                  as="p"
                  value={stat.value}
                  className={cn(
                    "font-display font-bold leading-none tracking-tight text-gradient-gold",
                    i === 0 ? "text-5xl sm:text-6xl" : "text-4xl sm:text-5xl",
                  )}
                />
                <p className="mt-3 text-sm leading-snug text-muted-foreground">
                  {stat.label}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
