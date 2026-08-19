import { ChevronRight } from "lucide-react";
import type { SiteCopy } from "@/lib/content";
import { Container, Section, SectionHeading, GoldGlow } from "@/components/layout";
import { Reveal } from "@/components/primitives";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/icons";

export function HowItWorks({ t }: { t: SiteCopy["how"] }) {
  const steps = t.steps;

  return (
    <Section id="how" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-40"
        aria-hidden="true"
      />
      <GoldGlow className="left-1/2 top-8 h-64 w-[40rem] -translate-x-1/2 opacity-60" />

      <Container className="relative">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
          align="center"
        />

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {steps.map((step, i) => {
            // Chevron hints the left-to-right flow between cards within a row on lg.
            const showConnector = (i + 1) % 4 !== 0 && i !== steps.length - 1;
            return (
              <Reveal as="li" key={step.title} delayIndex={i} className="relative">
                <Card className="group relative h-full p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-gold-sm motion-reduce:transform-none motion-reduce:hover:shadow-none">
                  {/* Faint left gold accent bar — grows via transform, not height,
                      so hover never triggers layout */}
                  <span
                    className="absolute left-0 top-6 h-8 w-0.5 origin-top rounded bg-gold-500/40 transition-[transform,background-color] duration-300 group-hover:scale-y-150 group-hover:bg-gold-500/70"
                    aria-hidden="true"
                  />

                  <div className="flex items-center">
                    {/* The 70% alpha reads as 2.83:1 on the ivory canvas; keep the muted
                        tone on the dark canvas and go full opacity in light mode. */}
                    <span className="font-display text-sm font-semibold tabular-nums text-gold-400/70 light:text-gold-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="ml-auto grid size-10 place-items-center rounded-xl bg-gold-500/10 text-gold-400 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 motion-reduce:transform-none">
                      <Icon name={step.icon} className="size-5" />
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </Card>

                {/* The connector rides the parent Reveal — it needs no animation
                    of its own, which is the only thing that kept this whole
                    section on the client. */}
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
