import { Mail, Phone, Globe, MapPin } from "lucide-react";
import type { SiteCopy } from "@/lib/content";
import { Logo, OrnamentStrip } from "@/components/brand";
import { Container } from "@/components/layout";
import { Reveal } from "@/components/primitives";

export function Footer({ t, contact }: { t: SiteCopy["footer"]; contact: SiteCopy["contact"] }) {

  return (
    <footer className="relative border-t border-border bg-background">
      <Reveal>
        <OrnamentStrip className="opacity-60" />
      </Reveal>
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t.tagline}
            </p>
          </div>

          {t.columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-sm font-semibold text-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-gold-300"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-display text-sm font-semibold text-foreground">
              {t.contactTitle}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-gold-300"
                >
                  <Mail className="size-4 text-gold-400" aria-hidden="true" />
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-gold-300"
                >
                  <Phone className="size-4 text-gold-400" aria-hidden="true" />
                  {contact.phone}
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5">
                <Globe className="size-4 text-gold-400" aria-hidden="true" />
                {contact.website}
              </li>
              <li className="inline-flex items-center gap-2.5">
                <MapPin className="size-4 text-gold-400" aria-hidden="true" />
                {contact.location}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            {t.rights.replace("{year}", String(new Date().getFullYear()))}
          </p>
          <div className="flex items-center gap-6">
            {t.legal.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <span className="text-xs text-muted-foreground">{t.madeIn}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
