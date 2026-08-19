import type { CSSProperties } from "react";
import { ArrowRight, Play } from "lucide-react";
import type { SiteCopy } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout";
import { CountUp } from "@/components/primitives";
import { AuroraBackdrop, AnimatedMedallion } from "@/components/decor";
import { LiveCallCard } from "@/components/sections/hero-call-card";

/**
 * Server component: the LCP h1, copy, CTAs and stats carry no client JS at all.
 * Only the LiveCallCard island hydrates.
 */
export function Hero({ t }: { t: SiteCopy["hero"] }) {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-70" aria-hidden="true" />
      <AuroraBackdrop />
      <AnimatedMedallion className="-right-24 top-10 hidden h-[28rem] w-[28rem] text-gold-500/10 lg:block" />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Copy */}
          <div className="flex flex-col items-start">
            <div className="enter-up">
              <Badge>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold-400" />
                {t.badge}
              </Badge>
            </div>

            {/* transform-only: this is the LCP element, so it must paint at once */}
            <h1 className="enter-rise mt-6 font-display text-4xl font-bold leading-[1.05] tracking-[-0.028em] text-foreground sm:text-5xl lg:text-6xl lg:tracking-[-0.038em]">
              {t.titleTop}{" "}
              <span className="text-gradient-gold">{t.titleHighlight}</span>{" "}
              {t.titleBottom}
            </h1>

            <p
              className="enter-up mt-6 max-w-[58ch] text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={{ "--enter-delay": "120ms" } as CSSProperties}
            >
              {t.subtitle}
            </p>

            <div
              className="enter-up mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
              style={{ "--enter-delay": "180ms" } as CSSProperties}
            >
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href="#contact">
                  {t.ctaPrimary}
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
                <a href="#voice">
                  <Play className="size-4" />
                  {t.ctaSecondary}
                </a>
              </Button>
            </div>

            <dl
              className="enter-up mt-12 grid w-full max-w-lg grid-cols-3 border-t border-border pt-8"
              style={{ "--enter-delay": "240ms" } as CSSProperties}
            >
              {t.stats.map((s, i) => (
                <div
                  key={s.label}
                  className={
                    i === 0
                      ? "pr-4"
                      : "border-l border-border px-4 last:pr-0"
                  }
                >
                  <CountUp
                    as="dt"
                    value={s.value}
                    className="font-display text-2xl font-bold leading-none text-gradient-gold sm:text-3xl"
                  />
                  <dd className="mt-1.5 text-xs leading-snug text-muted-foreground sm:text-sm">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual — AI voice agent call card */}
          <div
            className="enter-pop relative mx-auto w-full max-w-sm"
            style={{ "--enter-delay": "150ms" } as CSSProperties}
          >
            <div
              className="absolute -inset-14 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(var(--g-500)/0.13),transparent_70%)]"
              aria-hidden="true"
            />
            <LiveCallCard t={t} />
          </div>
        </div>
      </Container>
    </section>
  );
}
