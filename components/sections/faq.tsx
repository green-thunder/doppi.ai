"use client";

import { useCopy } from "@/lib/i18n";
import { Container, Section, SectionHeading, Reveal } from "@/components/primitives";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function Faq() {
  const t = useCopy();

  return (
    <Section id="faq">
      <Container>
        <SectionHeading
          eyebrow={t.faq.eyebrow}
          title={t.faq.title}
          subtitle={t.faq.subtitle}
          align="center"
        />

        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {t.faq.items.map((item, i) => (
              <Reveal key={item.q} delayIndex={i}>
                <AccordionItem
                  value={`item-${i}`}
                  className="rounded-xl px-4 transition-colors data-[state=open]:bg-card/40"
                >
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>
                    <p className="leading-relaxed">{item.a}</p>
                  </AccordionContent>
                </AccordionItem>
              </Reveal>
            ))}
          </Accordion>
        </div>
      </Container>
    </Section>
  );
}
