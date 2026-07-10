"use client";

import { useCopy } from "@/lib/i18n";
import {
  Container,
  Section,
  SectionHeading,
  Reveal,
  InteractiveCard,
} from "@/components/primitives";
import { Icon } from "@/components/icons";
import { DoppiMark } from "@/components/brand";
import { cn } from "@/lib/utils";

// Bento spans keyed by index over the fixed 6 items. Only the flagship tile
// (index 0 — AI Voice Agent) grows, to a 2×2 hero on desktop. This keeps the
// 3-col grid hole-free (4 + 5×1 = 9 cells = 3 clean rows) and collapses to an
// even grid on tablet / a single column on mobile.
const SPANS = ["lg:col-span-2 lg:row-span-2", "", "", "", "", ""];

export function Features() {
  const t = useCopy();

  return (
    <Section id="features">
      <Container>
        <SectionHeading
          eyebrow={t.features.eyebrow}
          title={t.features.title}
          subtitle={t.features.subtitle}
          align="center"
        />

        <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-fr">
          {t.features.items.map((item, i) => {
            const hero = i === 0;
            return (
              <Reveal key={item.title} as="li" delayIndex={i} className={cn(SPANS[i])}>
                <InteractiveCard
                  className={cn("h-full overflow-hidden p-6", hero && "lg:p-8")}
                  contentClassName="relative"
                >
                  {hero ? (
                    <DoppiMark className="pointer-events-none absolute -bottom-8 -right-4 hidden h-44 w-56 text-gold-500/[0.06] lg:block" />
                  ) : null}

                  <div className="relative z-10">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center rounded-xl bg-gold-500/10 text-gold-400 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 motion-reduce:transform-none",
                        hero ? "size-14" : "size-12",
                      )}
                    >
                      <Icon name={item.icon} className={hero ? "size-7" : "size-6"} />
                    </span>

                    <h3
                      className={cn(
                        "mt-5 font-display font-semibold text-foreground",
                        hero ? "text-xl lg:text-2xl" : "text-lg",
                      )}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-2 leading-relaxed text-muted-foreground",
                        hero ? "text-sm sm:text-base lg:max-w-md" : "text-sm",
                      )}
                    >
                      {item.desc}
                    </p>
                  </div>
                </InteractiveCard>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
