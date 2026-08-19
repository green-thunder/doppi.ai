"use client";

import * as React from "react";
import { Phone, Mic, PhoneOff } from "lucide-react";
import type { SiteCopy } from "@/lib/content";
import {
  useCountUpTimer,
  useInViewLoop,
  useReducedMotion,
  useTypewriter,
} from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * Memoized so the caption typewriter's per-character re-renders don't re-render
 * fifteen inline-styled bars each tick. Bars pause whenever the card scrolls
 * offscreen — CSS animations never stop on their own.
 */
const Waveform = React.memo(function Waveform({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const bars = [0.4, 0.7, 1, 0.6, 0.85, 0.5, 0.9, 0.65, 1, 0.55, 0.8, 0.45, 0.7, 0.95, 0.5];
  return (
    <div className="flex h-14 items-center justify-center gap-[3px]" aria-hidden="true">
      {bars.map((h, i) => {
        // Varied per-bar duration so the crest travels — reads as live audio.
        const dur = 0.8 + (i % 5) * 0.12;
        return (
          <span
            key={i}
            className="w-[3px] rounded-full bg-gold-400"
            style={{
              height: `${h * 100}%`,
              animation: reduce ? undefined : `wave ${dur}s ease-in-out ${i * 0.06}s infinite`,
              animationPlayState: active ? undefined : "paused",
              transformOrigin: "center",
            }}
          />
        );
      })}
    </div>
  );
});

/** The AI voice-agent call card — a self-contained looping "live call" demo. */
export function LiveCallCard({ t }: { t: SiteCopy["hero"] }) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInViewLoop(ref);
  const clock = useCountUpTimer({ active: inView, reduce });
  const { text: caption, done } = useTypewriter(t.agentCaption, {
    active: inView,
    reduce,
    loop: true,
    holdMs: 2600,
  });

  return (
    <div
      ref={ref}
      className="rounded-[1.75rem] border border-border bg-card/85 p-6 shadow-card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/15 text-gold-300">
            <span
              className={cn(
                "absolute inset-0 animate-pulse-ring rounded-full border border-gold-500/50",
                !inView && "[animation-play-state:paused]",
              )}
              aria-hidden="true"
            />
            <Phone className="size-5" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-foreground">
              {t.agentName}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {t.agentStatus}
            </p>
          </div>
        </div>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">{clock}</span>
      </div>

      <div className="my-6 rounded-2xl border border-border bg-background/60 p-4">
        <Waveform active={inView} />
      </div>

      <p className="min-h-[2.75rem] text-center text-sm leading-relaxed text-muted-foreground">
        {caption}
        {!done && !reduce ? (
          <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-gold-400 align-middle" aria-hidden="true" />
        ) : null}
      </p>

      {/* Decorative call chrome — deliberately NOT buttons: a disabled saturated
          red "end call" used to be the brightest object in the hero, outshouting
          the real CTA and reading as broken UI. */}
      <div className="mt-6 flex items-center justify-center gap-4" aria-hidden="true">
        <span className="grid size-11 place-items-center rounded-full border border-border bg-foreground/[0.05] text-foreground/50">
          <Mic className="size-5" />
        </span>
        <span className="grid size-14 place-items-center rounded-full bg-red-500/15 text-red-400 ring-1 ring-red-500/30 light:bg-red-500/10 light:text-red-600">
          <PhoneOff className="size-5" />
        </span>
      </div>
    </div>
  );
}
