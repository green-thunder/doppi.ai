"use client";

import * as React from "react";
import { motion, useReducedMotion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCountUp, usePointerTilt } from "@/lib/hooks";

/** Max-width content wrapper. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 lg:px-8", className)}>
      {children}
    </div>
  );
}

/** Vertical section wrapper with consistent rhythm + optional id anchor. */
export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 py-20 sm:py-28", className)}
    >
      {children}
    </section>
  );
}

/** Small uppercase gold eyebrow label. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-400",
        className,
      )}
    >
      <span className="h-px w-6 bg-gold-500/60" aria-hidden="true" />
      {children}
    </span>
  );
}

const HEADING_CLASS =
  "font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] md:leading-[1.1]";

/**
 * Section title with a scroll-triggered reveal. String titles rise word-by-word
 * from behind a mask; React-node titles (e.g. a gradient span) fall back to a
 * single fade-up block. Reduced motion → a plain static heading. Drop-in.
 */
function AnimatedTitle({ title }: { title: React.ReactNode }) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  if (reduce) {
    return (
      <h2 ref={ref} className={HEADING_CLASS}>
        {title}
      </h2>
    );
  }

  if (typeof title !== "string") {
    return (
      <motion.h2
        ref={ref}
        className={HEADING_CLASS}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {title}
      </motion.h2>
    );
  }

  const words = title.split(" ");
  return (
    <h2 ref={ref} className={HEADING_CLASS}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <motion.span
            className="inline-block"
            initial={{ y: "0.5em", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : undefined}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </h2>
  );
}

/** Centered section heading block: eyebrow + title + optional subtitle. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-2xl items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <AnimatedTitle title={title} />
      {subtitle ? (
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

/**
 * Scroll-reveal wrapper. Respects prefers-reduced-motion (renders static).
 * `delayIndex` staggers grid/list items.
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
  const reduce = useReducedMotion();
  const MotionTag = as === "li" ? motion.li : motion.div;

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      variants={revealVariants}
      custom={delayIndex}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </MotionTag>
  );
}

/** Soft radial gold glow, positioned absolutely behind content. */
export function GoldGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-full bg-gold-500/20 blur-[120px]",
        className,
      )}
    />
  );
}

/**
 * Renders a stat string, counting the leading number up from 0 when scrolled
 * into view. Non-numeric / range strings ("24/7", "2–5×", "Custom") render
 * statically. Drop-in for a stat text node; inherits typography from `className`.
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
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const display = useCountUp(value, inView, duration);
  return (
    <Tag ref={ref as never} className={cn("tabular-nums", className)}>
      {display}
    </Tag>
  );
}

/**
 * Shared recipe for interactive cards: hover-lift + gold border + pointer tilt
 * (driven by CSS vars from `usePointerTilt`). Neutralized under reduced motion.
 */
export const interactiveCardClass =
  "transition-[transform,box-shadow,border-color] duration-300 " +
  "hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-gold-sm " +
  "motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none " +
  "[transform:perspective(900px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]";

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
        "group relative rounded-2xl border border-border bg-card/60 shadow-card will-change-transform",
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
