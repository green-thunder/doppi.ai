import { Mail, Phone, Globe, MapPin, type LucideIcon } from "lucide-react";
import type { SiteCopy } from "@/lib/content";
import { Container, Section, SectionHeading, GoldGlow } from "@/components/layout";
import { Reveal } from "@/components/primitives";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/sections/contact-form";

/**
 * Server component: heading + reach rows render on the server; only the form
 * island hydrates.
 */
export function Contact({
  t,
  privacyHref,
}: {
  t: SiteCopy["contact"];
  /** Resolved on the server so the form island never imports the copy tree. */
  privacyHref: string;
}) {
  const reachRows: { icon: LucideIcon; label: string; href?: string; external?: boolean }[] = [
    { icon: Mail, label: t.email, href: `mailto:${t.email}` },
    { icon: Phone, label: t.phone, href: `tel:${t.phone.replace(/\s+/g, "")}` },
    { icon: Globe, label: t.website, href: `https://${t.website}`, external: true },
    { icon: MapPin, label: t.location },
  ];

  return (
    <Section id="contact" className="relative overflow-hidden">
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-50"
        aria-hidden="true"
      />
      <GoldGlow className="right-[-6rem] top-4 h-72 w-[30rem]" />

      <Container className="relative">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Left — heading + reach block */}
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow={t.eyebrow}
              title={t.title}
              subtitle={t.subtitle}
            />

            <h3 className="mt-10 font-display text-lg font-semibold text-foreground">
              {t.reachTitle}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t.reachSubtitle}
            </p>

            <ul className="mt-6 space-y-4">
              {reachRows.map((row) => {
                const RowIcon = row.icon;
                const tile = (
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-500/10 text-gold-400">
                    <RowIcon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                );

                return (
                  <li key={row.label}>
                    {row.href ? (
                      <a
                        href={row.href}
                        target={row.external ? "_blank" : undefined}
                        rel={row.external ? "noreferrer" : undefined}
                        className="group -mx-2 flex items-center gap-4 rounded-xl px-2 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {tile}
                        <span className="text-sm text-foreground transition-colors group-hover:text-gold-300">
                          {row.label}
                        </span>
                      </a>
                    ) : (
                      <div className="-mx-2 flex items-center gap-4 px-2 py-1.5">
                        {tile}
                        <span className="text-sm text-muted-foreground">{row.label}</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {/* Right — contact form */}
          <Reveal delayIndex={1}>
            <Card className="p-6 sm:p-8">
              <ContactForm
                t={{ ...t.form, success: t.success }}
                email={t.email}
                phone={t.phone}
                privacyHref={privacyHref}
              />
            </Card>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
