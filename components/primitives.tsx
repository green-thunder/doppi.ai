"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  useCountUpText,
  useInView,
  usePointerTilt,
  useRevealPhase,
  type RevealPhase,
} from "@/lib/hooks";

/**
 * Client-side motion primitives. Static layout primitives (Container, Section,
 * SectionHeading, Eyebrow, GoldGlow) live in components/layout.tsx, which is
 * directive-free so server sections don't hydrate them.
 */

const HEADING_CLASS =
  "font-display text-3xl font-bold leading-[1.12] tracking-[-0.02em] text-foreground sm:text-4xl md:text-[2.75rem] md:leading-[1.08] md:tracking-[-0.03em]";

/** Class set for one revealing element, given the phase and its stagger index. */
function revealProps(phase: RevealPhase, index: number, hiddenClass = "reveal-hidden") {
  return {
    className: phase === "static" ? undefined : cn("reveal", phase === "hidden" && hiddenClass),
    style:
      phase === "static"
        ? undefined
        : ({ "--reveal-delay": `${index * 50}ms` } as React.CSSProperties),
  };
}

/**
 * Section title with a scroll-triggered reveal. String titles rise word-by-word;
 * React-node titles (e.g. a gradient span) fade up as one block. The heading is
 * server-rendered fully visible — see `useRevealPhase` — so it reads with no JS
 * and does not gate LCP on the bundle. Reduced motion → a plain heading.
 */
export function AnimatedTitle({ title }: { title: React.ReactNode }) {
  const ref = React.useRef<HTMLHeadingElement>(null);
  const phase = useRevealPhase(ref);

  if (typeof title !== "string") {
    const { className, style } = revealProps(phase, 0);
    return (
      <h2 ref={ref} className={cn(HEADING_CLASS, className)} style={style}>
        {title}
      </h2>
    );
  }

  const words = title.split(" ");
  return (
    <h2 ref={ref} className={HEADING_CLASS}>
      {words.map((w, i) => {
        const { className, style } = revealProps(phase, i, "reveal-title-hidden");
        return (
          <React.Fragment key={i}>
            <span className={cn("inline-block", className)} style={style}>
              {w}
            </span>
            {i < words.length - 1 ? " " : ""}
          </React.Fragment>
        );
      })}
    </h2>
  );
}

/**
 * Scroll-reveal wrapper. Renders visible on the server and only arms the hidden
 * state after mount for content still below the fold, so nothing a visitor can
 * already see is ever hidden and the HTML stands on its own without JS.
 * `delayIndex` staggers grid/list items. Static under reduced motion.
 */
export function Reveal({
  children,
  className,
  delayIndex = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delayIndex?: number;
  as?: "div" | "li";
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const phase = useRevealPhase(ref);
  const { className: revealClass, style } = revealProps(phase, delayIndex);
  const Tag = as;

  return (
    <Tag ref={ref as never} className={cn(className, revealClass)} style={style}>
      {children}
    </Tag>
  );
}

/**
 * Renders a stat string, counting the leading number up from 0 when scrolled
 * into view. Non-numeric / range strings ("24/7", "2–5×", "Custom") render
 * statically. The animation writes textContent directly (no per-frame React
 * renders); the SSR markup already carries the final string.
 */
export function CountUp({
  value,
  className,
  as: Tag = "span",
  duration,
}: {
  value: string;
  className?: string;
  as?: "span" | "p" | "dt" | "dd";
  duration?: number;
}) {
  const ref = React.useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  useCountUpText(ref, value, inView, duration);
  return (
    <Tag ref={ref as never} className={cn("tabular-nums", className)}>
      {value}
    </Tag>
  );
}

/**
 * Shared recipe for interactive cards: hover-lift + gold border + pointer tilt
 * (driven by CSS vars from `usePointerTilt`). Neutralized under reduced motion.
 *
 * `.tilt-card` (globals.css) splits the transition: transform tracks the
 * pointer at 120ms while border/shadow ease at 300ms — one shared duration made
 * the tilt permanently chase the cursor.
 *
 * The 3D transform is scoped to fine pointers: on touch devices the tilt hook
 * never runs, so the resting `perspective(...)` would only force a permanently
 * promoted compositor layer per card for nothing.
 */
export const interactiveCardClass =
  "tilt-card " +
  "hover:border-gold-500/40 hover:shadow-gold-sm " +
  "motion-reduce:hover:shadow-none " +
  // The hover lift has to live INSIDE this transform: as a separate
  // `hover:-translate-y-1` utility it set the same `transform` property and
  // silently overwrote the tilt, so the tilt never rendered at all.
  "fine:[transform:perspective(900px)_translateY(var(--lift,0px))_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] " +
  "hover:[--lift:-0.25rem] motion-reduce:hover:[--lift:0px]";

/**
 * Card wrapper with pointer-tracking tilt + a cursor-following gold spotlight.
 * Visually identical to `Card` at rest. Tilt/spotlight no-op on touch and under
 * reduced motion. Uses gold tokens so it stays correct in light mode.
 */
export function InteractiveCard({
  children,
  className,
  contentClassName,
  spotlight = true,
  tilt = true,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  spotlight?: boolean;
  tilt?: boolean;
  contentClassName?: string;
}) {
  const ref = usePointerTilt({ maxTilt: tilt ? 6 : 0 });
  return (
    <div
      ref={ref}
      className={cn(
        "group relative rounded-2xl border border-border bg-card/70 shadow-card",
        interactiveCardClass,
        className,
      )}
      {...rest}
    >
      {spotlight ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
          style={{
            background:
              "radial-gradient(200px circle at var(--mx,50%) var(--my,50%), hsl(var(--g-500) / 0.16), transparent 60%)",
          }}
        />
      ) : null}
      <div className={cn("relative z-10 h-full", contentClassName)}>{children}</div>
    </div>
  );
}
