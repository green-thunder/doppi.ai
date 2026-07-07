"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, Phone, Mic, PhoneOff } from "lucide-react";
import { useCopy } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container, GoldGlow } from "@/components/primitives";
import { Medallion } from "@/components/brand";

function Waveform() {
  const reduce = useReducedMotion();
  const bars = [0.4, 0.7, 1, 0.6, 0.85, 0.5, 0.9, 0.65, 1, 0.55, 0.8, 0.45, 0.7, 0.95, 0.5];
  return (
    <div className="flex h-14 items-center justify-center gap-[3px]" aria-hidden="true">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-gold-gradient"
          style={{
            height: `${h * 100}%`,
            animation: reduce ? undefined : `wave 1.1s ease-in-out ${i * 0.06}s infinite`,
            transformOrigin: "center",
          }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const t = useCopy();

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-70" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" aria-hidden="true" />
      <GoldGlow className="left-1/2 top-[-6rem] h-72 w-[36rem] -translate-x-1/2" />
      <Medallion className="pointer-events-none absolute -right-24 top-10 hidden h-[28rem] w-[28rem] text-gold-500/10 lg:block" />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Copy */}
          <div className="flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold-400" />
                </span>
                {t.hero.badge}
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              {t.hero.titleTop}{" "}
              <span className="text-gradient-gold">{t.hero.titleHighlight}</span>{" "}
              {t.hero.titleBottom}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild size="lg">
                <a href="#contact">
                  {t.hero.ctaPrimary}
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <a href="#voice">
                  <Play className="size-4" />
                  {t.hero.ctaSecondary}
                </a>
              </Button>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-12 grid w-full max-w-lg grid-cols-3 gap-6 border-t border-border pt-8"
            >
              {t.hero.stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-2xl font-bold text-gradient-gold sm:text-3xl">
                    {s.value}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground sm:text-sm">
                    {s.label}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Visual — AI voice agent call card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gold-500/10 blur-3xl" aria-hidden="true" />
            <div className="rounded-[1.75rem] border border-border bg-card/70 p-6 shadow-card backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/15 text-gold-300">
                    <span className="absolute inset-0 animate-pulse-ring rounded-full border border-gold-500/50" aria-hidden="true" />
                    <Phone className="size-5" />
                  </span>
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">
                      {t.hero.agentName}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {t.hero.agentStatus}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">00:24</span>
              </div>

              <div className="my-6 rounded-2xl border border-border bg-background/60 p-4">
                <Waveform />
              </div>

              <p className="text-center text-sm leading-relaxed text-muted-foreground">
                {t.hero.agentCaption}
              </p>

              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled
                  aria-label={t.a11y.mute}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-foreground/[0.05] text-foreground/70"
                >
                  <Mic className="size-5" />
                </button>
                <button
                  type="button"
                  disabled
                  aria-label={t.a11y.endCall}
                  className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-500/90 p-3 text-white shadow-lg"
                >
                  <PhoneOff className="size-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
