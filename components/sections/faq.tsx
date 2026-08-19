import { ChevronDown } from "lucide-react";
import type { SiteCopy } from "@/lib/content";
import { Container, Section, SectionHeading } from "@/components/layout";
import { Reveal } from "@/components/primitives";

/**
 * Native <details>/<summary> rather than a JS accordion.
 *
 * The Radix accordion never rendered closed content, so not one FAQ answer
 * reached the HTML — and these answers are the most long-tail-query-shaped prose
 * on the site. <details> keeps every answer in the markup, works with no JS, is
 * keyboard- and screen-reader-native, and matches the FAQPage JSON-LD in the
 * document head.
 */
export function Faq({ t }: { t: SiteCopy["faq"] }) {
  return (
    <Section id="faq" tone="raised">
      <Container>
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
          align="center"
        />

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-border sm:mt-16">
          {t.items.map((item, i) => (
            <Reveal key={item.q} delayIndex={i}>
              <details className="group rounded-xl px-4 transition-colors duration-200 open:bg-card/70">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-display text-base font-medium text-foreground transition-colors hover:text-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown
                    className="size-5 shrink-0 text-gold-400 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </summary>
                <p className="pb-5 pr-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
