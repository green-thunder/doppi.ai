"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useCopy } from "@/lib/i18n";
import { Container, Section, SectionHeading, Reveal, GoldGlow } from "@/components/primitives";

/** Mini animated waveform for the live-call header. Decorative. */
function MiniWaveform() {
  const reduce = useReducedMotion();
  const bars = [0.5, 0.9, 0.6, 1, 0.7];
  return (
    <div className="flex h-5 items-center gap-[3px]" aria-hidden="true">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-gold-gradient"
          style={{
            height: `${h * 100}%`,
            transformOrigin: "center",
            animation: reduce ? undefined : "wave 1.1s ease-in-out infinite",
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}

export function VoiceAgent() {
  const t = useCopy();

  return (
    <Section id="voice" className="relative overflow-hidden">
      <GoldGlow className="right-[-4rem] top-1/3 h-72 w-[30rem]" />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left — copy + qualified points */}
          <div>
            <SectionHeading
              align="left"
              eyebrow={t.voice.eyebrow}
              title={t.voice.title}
              subtitle={t.voice.subtitle}
            />

            <ul className="mt-8 space-y-3">
              {t.voice.points.map((point, i) => (
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
              className="absolute -inset-6 -z-10 rounded-[2rem] bg-gold-500/10 blur-3xl"
              aria-hidden="true"
            />
            <div className="rounded-[1.75rem] border border-border bg-card/70 p-6 shadow-card backdrop-blur">
              {/* Header */}
              <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
                <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  {t.voice.callLabel}
                </span>
                <MiniWaveform />
              </div>

              {/* Transcript */}
              <div className="mt-5 flex flex-col gap-3">
                {t.voice.transcript.map((msg, i) =>
                  msg.role === "agent" ? (
                    <p
                      key={i}
                      className="max-w-[80%] rounded-2xl rounded-tl-sm border border-gold-500/20 bg-gold-500/10 px-4 py-2.5 text-sm leading-relaxed text-foreground/90"
                    >
                      {msg.text}
                    </p>
                  ) : (
                    <p
                      key={i}
                      className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm border border-border bg-foreground/[0.05] px-4 py-2.5 text-sm leading-relaxed text-foreground/80"
                    >
                      {msg.text}
                    </p>
                  ),
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
