"use client";

import { Mail, Phone, Globe, MapPin } from "lucide-react";
import { useCopy } from "@/lib/i18n";
import { Logo, OrnamentStrip } from "@/components/brand";
import { Container } from "@/components/primitives";

export function Footer() {
  const t = useCopy();

  return (
    <footer className="relative border-t border-border bg-background">
      <OrnamentStrip className="opacity-60" />
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t.footer.tagline}
            </p>
          </div>

          {t.footer.columns.map((col) => (
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
              {t.footer.contactTitle}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href={`mailto:${t.contact.email}`}
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-gold-300"
                >
                  <Mail className="size-4 text-gold-400" />
                  {t.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${t.contact.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-gold-300"
                >
                  <Phone className="size-4 text-gold-400" />
                  {t.contact.phone}
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5">
                <Globe className="size-4 text-gold-400" />
                {t.contact.website}
              </li>
              <li className="inline-flex items-center gap-2.5">
                <MapPin className="size-4 text-gold-400" />
                {t.contact.location}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">{t.footer.rights}</p>
          <div className="flex items-center gap-6">
            {t.footer.legal.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <span className="text-xs text-muted-foreground">{t.footer.madeIn}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
