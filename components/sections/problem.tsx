import type { SiteCopy } from "@/lib/content";
import { Container, Section, SectionHeading, GoldGlow } from "@/components/layout";
import { Reveal } from "@/components/primitives";
import { Icon } from "@/components/icons";

export function Problem({ t }: { t: SiteCopy["problem"] }) {

  return (
    <Section id="problem" className="overflow-hidden">
      {/* Decorative glow */}
      <GoldGlow className="right-0 top-12 h-64 w-[26rem] translate-x-1/3 opacity-50" />

      <Container className="relative">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
          align="left"
        />

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:gap-5 lg:grid-cols-2">
          {t.items.map((item, i) => (
            // Reveal owns the scroll animation; the inner card
            // owns hover/transform. Keeping them on separate elements avoids the
            // CSS-transition-vs-inline-transform conflict that made the reveal
            // stutter and left the hover-lift dead.
            <Reveal key={item.title} as="li" delayIndex={i} className="h-full">
              <div className="group flex h-full items-start gap-4 rounded-2xl border border-border bg-card/70 p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-gold-sm motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-300 transition-transform duration-300 group-hover:scale-110 group-hover:bg-red-500/15 motion-reduce:transform-none light:text-red-600">
                  <Icon name={item.icon} className="size-5" strokeWidth={1.75} />
                </span>

                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
