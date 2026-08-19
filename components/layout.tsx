import * as React from "react";
import { cn } from "@/lib/utils";
import { AnimatedTitle } from "@/components/primitives";

/**
 * Directive-free layout primitives. No "use client" here: server sections render
 * these on the server (so ~40 wrappers per page stop hydrating), while client
 * sections can still import them as ordinary components.
 */

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

/**
 * Vertical section wrapper with consistent rhythm + optional id anchor.
 *
 * Every Section is below the fold (the hero owns its own <section>), so each
 * one opts into `content-visibility: auto`: the browser skips layout/paint for
 * sections far from the viewport and un-skips them as the visitor approaches.
 * `contain-intrinsic-size: auto 52rem` keeps the scrollbar stable before first
 * render and remembers the real size afterwards.
 *
 * `tone="raised"` marks a chapter break: hairline borders plus (dark mode only —
 * the light canvas stays flat white) a barely-there lift of the background.
 */
export function Section({
  id,
  className,
  tone = "default",
  children,
}: {
  id?: string;
  className?: string;
  tone?: "default" | "raised";
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      // No scroll-mt here: html's scroll-padding-top already compensates for the
      // fixed navbar, and scroll-margin + scroll-padding are ADDITIVE — both at
      // once landed every anchor ~200px too low.
      className={cn(
        "relative py-20 sm:py-28",
        "[content-visibility:auto] [contain-intrinsic-size:auto_52rem]",
        tone === "raised" &&
          "border-y border-border bg-foreground/[0.015] light:bg-transparent",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Small uppercase gold eyebrow label. `centered` mirrors the rule on both sides. */
export function Eyebrow({
  children,
  className,
  centered = false,
}: {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
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
      {centered ? <span className="h-px w-6 bg-gold-500/60" aria-hidden="true" /> : null}
    </span>
  );
}

/**
 * Section heading block: eyebrow + title + optional subtitle.
 *
 * `align="split"` puts eyebrow+title in the left column and the subtitle in the
 * right — a second axis so a long page of centered headings doesn't develop one
 * rigid spine.
 */
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
  align?: "center" | "left" | "split";
  className?: string;
}) {
  if (align === "split") {
    return (
      <div className={cn("grid gap-6 lg:grid-cols-2 lg:items-end", className)}>
        <div className="flex flex-col items-start gap-4">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <AnimatedTitle title={title} />
        </div>
        {subtitle ? (
          <p className="max-w-[62ch] text-base leading-relaxed text-muted-foreground sm:text-lg lg:justify-self-end">
            {subtitle}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center"
          ? "mx-auto max-w-2xl items-center text-center"
          : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? <Eyebrow centered={align === "center"}>{eyebrow}</Eyebrow> : null}
      <AnimatedTitle title={title} />
      {subtitle ? (
        <p className="max-w-[62ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Soft radial gold glow, positioned absolutely behind content. A pre-blurred
 * radial gradient, not `filter: blur(120px)` — the visual result is the same
 * soft blob, but the browser pays nothing for it (the old filter forced a huge
 * rasterized GPU surface per glow, ~11 of them per page).
 */
export function GoldGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "decor-glow pointer-events-none absolute rounded-full",
        "bg-[radial-gradient(closest-side,hsl(var(--g-500)/0.22),transparent_72%)]",
        className,
      )}
    />
  );
}
