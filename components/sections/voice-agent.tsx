import { Check } from "lucide-react";
import type { SiteCopy } from "@/lib/content";
import { Container, Section, SectionHeading, GoldGlow } from "@/components/layout";
import { Reveal } from "@/components/primitives";
import { TranscriptCard } from "@/components/sections/transcript-card";

/**
 * Server component — only the TranscriptCard island hydrates.
 */
export function VoiceAgent({ t }: { t: SiteCopy["voice"] }) {
  return (
    <Section id="voice" className="relative overflow-hidden">
      <GoldGlow className="right-[-4rem] top-1/3 h-72 w-[30rem]" />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left — copy + qualified points */}
          <div>
            <SectionHeading
              align="left"
              eyebrow={t.eyebrow}
              title={t.title}
              subtitle={t.subtitle}
            />

            <ul className="mt-8 space-y-3">
              {t.points.map((point, i) => (
                <Reveal
                  as="li"
                  key={point}
                  delayIndex={i}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-foreground/90 sm:text-base">
                    {point}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Right — live call transcript card */}
          <Reveal className="relative mx-auto w-full max-w-md lg:mx-0">
            <div
              className="absolute -inset-14 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(var(--g-500)/0.13),transparent_70%)]"
              aria-hidden="true"
            />
            <TranscriptCard callLabel={t.callLabel} transcript={t.transcript} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
