"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useCopy } from "@/lib/i18n";
import { useInViewLoop, useTypewriter } from "@/lib/hooks";
import { Container, Section, SectionHeading, Reveal, GoldGlow } from "@/components/primitives";
import { cn } from "@/lib/utils";

type Turn = ReturnType<typeof useCopy>["voice"]["transcript"][number];

/** Mini animated waveform for the live-call header. Decorative. */
function MiniWaveform() {
  const reduce = useReducedMotion();
  const bars = [0.5, 0.9, 0.6, 1, 0.7];
  return (
    <div className="flex h-5 items-center gap-[3px]" aria-hidden="true">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-gold-400"
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

const bubbleClass = (role: Turn["role"]) =>
  role === "agent"
    ? "max-w-[80%] rounded-2xl rounded-tl-sm border border-gold-500/20 bg-gold-500/10 px-4 py-2.5 text-sm leading-relaxed text-foreground/90"
    : "ml-auto max-w-[80%] rounded-2xl rounded-tr-sm border border-border bg-foreground/[0.05] px-4 py-2.5 text-sm leading-relaxed text-foreground/80";

/** A single transcript bubble (static / already-complete). */
function Bubble({ msg }: { msg: Turn }) {
  return <p className={bubbleClass(msg.role)}>{msg.text}</p>;
}

/** The currently-streaming bubble; calls `onDone` shortly after it finishes typing. */
function StreamingBubble({
  msg,
  reduce,
  onDone,
}: {
  msg: Turn;
  reduce: boolean | null;
  onDone: () => void;
}) {
  const { text, done } = useTypewriter(msg.text, { active: true, reduce, startDelay: 0, speed: 24 });
  const onDoneRef = React.useRef(onDone);
  onDoneRef.current = onDone;

  React.useEffect(() => {
    if (!done) return;
    const id = window.setTimeout(() => onDoneRef.current(), 650);
    return () => window.clearTimeout(id);
  }, [done]);

  return (
    <p className={bubbleClass(msg.role)}>
      {text}
      <span className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-gold-400 align-middle" aria-hidden="true" />
    </p>
  );
}

/** Animated "typing…" dots, aligned like the bubble whose turn is next. */
function TypingIndicator({ role }: { role: Turn["role"] }) {
  return (
    <div
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-2xl border px-4 py-3",
        role === "agent"
          ? "rounded-tl-sm border-gold-500/20 bg-gold-500/10"
          : "ml-auto rounded-tr-sm border-border bg-foreground/[0.05]",
      )}
      aria-hidden="true"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-gold-400/80"
          style={{ animation: "wave 1s ease-in-out infinite", animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

/**
 * Plays the transcript turn-by-turn: a typing indicator, then the bubble streams
 * in, then the next turn — looping while in view. Before mount / under reduced
 * motion it renders the full transcript at once (SSR-safe, accessible).
 */
function TranscriptPlayer({ transcript }: { transcript: Turn[] }) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const active = useInViewLoop(ref);
  const [mounted, setMounted] = React.useState(false);
  const [revealed, setRevealed] = React.useState(0);
  const [mode, setMode] = React.useState<"indicator" | "stream" | "idle">("indicator");
  const n = transcript.length;

  React.useEffect(() => setMounted(true), []);

  // (Re)initialise when inputs change (incl. UZ↔EN toggle) or motion pref flips.
  React.useEffect(() => {
    if (!mounted) return;
    if (reduce) {
      setRevealed(n);
      setMode("idle");
      return;
    }
    setRevealed(0);
    setMode("indicator");
  }, [transcript, reduce, mounted, n]);

  // Indicator → stream after a short beat.
  React.useEffect(() => {
    if (!mounted || reduce || !active) return;
    if (mode !== "indicator" || revealed >= n) return;
    const id = window.setTimeout(() => setMode("stream"), 750);
    return () => window.clearTimeout(id);
  }, [mode, revealed, active, mounted, reduce, n]);

  // Hold on the full transcript, then loop.
  React.useEffect(() => {
    if (!mounted || reduce || !active) return;
    if (mode !== "idle" || revealed < n) return;
    const id = window.setTimeout(() => {
      setRevealed(0);
      setMode("indicator");
    }, 2800);
    return () => window.clearTimeout(id);
  }, [mode, revealed, active, mounted, reduce, n]);

  const handleDone = React.useCallback(() => {
    const nr = revealed + 1;
    setRevealed(nr);
    setMode(nr >= n ? "idle" : "indicator");
  }, [revealed, n]);

  const showStatic = !mounted || reduce;

  return (
    <div ref={ref} className="mt-5 flex flex-col gap-3">
      {showStatic ? (
        transcript.map((msg, i) => <Bubble key={i} msg={msg} />)
      ) : (
        <>
          {transcript.slice(0, revealed).map((msg, i) => (
            <Bubble key={i} msg={msg} />
          ))}
          <AnimatePresence mode="wait">
            {revealed < n && mode === "stream" ? (
              <motion.div
                key={`stream-${revealed}`}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <StreamingBubble msg={transcript[revealed]} reduce={reduce} onDone={handleDone} />
              </motion.div>
            ) : revealed < n && mode === "indicator" ? (
              <motion.div
                key={`ind-${revealed}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TypingIndicator role={transcript[revealed].role} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </>
      )}
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
              <TranscriptPlayer transcript={t.voice.transcript} />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
