import type { SiteCopy } from "@/lib/content";
import { Container, Section, SectionHeading, GoldGlow } from "@/components/layout";
import { Reveal } from "@/components/primitives";
import { Icon } from "@/components/icons";
import { DoppiMark } from "@/components/brand";
import { ModuleChip } from "@/components/module-chip";
import { OrbitDiagram } from "@/components/sections/orbit-diagram";

/**
 * Server component. Icons render on the server and are handed to the client
 * OrbitDiagram as finished nodes, so the 28-entry icon map never enters the
 * client bundle; the mobile grid doesn't hydrate at all.
 */
export function Solution({ t }: { t: SiteCopy["solution"] }) {
  const modules = t.modules.map((m) => ({
    label: m.label,
    icon: <Icon name={m.icon} className="size-5 text-gold-400" />,
  }));

  return (
    <Section id="solution" tone="raised" className="relative overflow-hidden">
      <GoldGlow className="left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2" />

      <Container className="relative">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
          align="center"
        />

        <Reveal className="relative mt-12 sm:mt-16">
          {/* Desktop: constellation of 6 modules around the Do'ppi hub */}
          <OrbitDiagram modules={modules} centerLabel={t.centerLabel} />

          {/* Mobile / tablet: hub chip + module grid */}
          <div className="lg:hidden">
            <div className="mx-auto flex w-fit items-center gap-3 rounded-2xl border border-gold-500/40 bg-card px-5 py-3 shadow-gold">
              <DoppiMark className="h-6 w-8 shrink-0 text-gold-400" />
              <span className="font-display text-sm font-bold tracking-tight text-foreground">
                {t.centerLabel}
              </span>
            </div>

            <ul className="mt-6 grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 min-[420px]:gap-3">
              {modules.map((m) => (
                <li key={m.label}>
                  <ModuleChip icon={m.icon} label={m.label} />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <p className="mx-auto mt-14 max-w-[62ch] text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t.note}
        </p>
      </Container>
    </Section>
  );
}
