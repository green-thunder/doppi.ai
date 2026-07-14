"use client";

import * as React from "react";
import { Mail, Phone, Globe, MapPin, Check, Send, type LucideIcon } from "lucide-react";
import { useCopy } from "@/lib/i18n";
import {
  Container,
  Section,
  SectionHeading,
  Reveal,
  GoldGlow,
} from "@/components/primitives";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Contact() {
  const t = useCopy();
  const [sent, setSent] = React.useState(false);

  const reachRows: { icon: LucideIcon; label: string; href?: string; external?: boolean }[] = [
    { icon: Mail, label: t.contact.email, href: `mailto:${t.contact.email}` },
    { icon: Phone, label: t.contact.phone, href: `tel:${t.contact.phone.replace(/\s+/g, "")}` },
    { icon: Globe, label: t.contact.website, href: `https://${t.contact.website}`, external: true },
    { icon: MapPin, label: t.contact.location },
  ];

  const fields: {
    id: string;
    name: string;
    label: string;
    type: string;
    required: boolean;
    autoComplete: string;
  }[] = [
    { id: "contact-name", name: "name", label: t.contact.form.name, type: "text", required: true, autoComplete: "name" },
    { id: "contact-phone", name: "phone", label: t.contact.form.phone, type: "tel", required: true, autoComplete: "tel" },
    { id: "contact-email", name: "email", label: t.contact.form.email, type: "email", required: false, autoComplete: "email" },
    { id: "contact-business", name: "business", label: t.contact.form.business, type: "text", required: false, autoComplete: "organization" },
  ];

  const inputClass =
    "w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/20 placeholder:text-muted-foreground";

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
              eyebrow={t.contact.eyebrow}
              title={t.contact.title}
              subtitle={t.contact.subtitle}
            />

            <h3 className="mt-10 font-display text-lg font-semibold text-foreground">
              {t.contact.reachTitle}
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {t.contact.reachSubtitle}
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
              {sent ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="grid size-14 place-items-center rounded-full bg-gold-gradient text-[#0A0A0B] shadow-gold-sm">
                    <Check className="size-7" strokeWidth={2.25} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 font-display text-xl font-semibold text-foreground">
                    {t.contact.success.title}
                  </h3>
                  <p className="mt-2 max-w-sm leading-relaxed text-muted-foreground">
                    {t.contact.success.subtitle}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget as HTMLFormElement);
                    const name = (fd.get("name") ?? "").toString().trim();
                    const phone = (fd.get("phone") ?? "").toString().trim();
                    const email = (fd.get("email") ?? "").toString().trim();
                    const business = (fd.get("business") ?? "").toString().trim();
                    const message = (fd.get("message") ?? "").toString().trim();

                    // Persist the lead into the CRM. Fall back to a mailto link if
                    // the request fails so no submission is ever lost.
                    try {
                      const res = await fetch("/api/leads", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name, phone, email, business, message }),
                      });
                      if (!res.ok) throw new Error("request failed");
                    } catch {
                      const subject = `Do'ppi.ai demo — ${business || name}`;
                      const body = [
                        `${t.contact.form.name}: ${name}`,
                        `${t.contact.form.phone}: ${phone}`,
                        `${t.contact.form.email}: ${email}`,
                        `${t.contact.form.business}: ${business}`,
                        "",
                        message,
                      ].join("\n");
                      window.location.href = `mailto:${t.contact.email}?subject=${encodeURIComponent(
                        subject,
                      )}&body=${encodeURIComponent(body)}`;
                    }
                    setSent(true);
                  }}
                  className="grid gap-x-4 gap-y-5 sm:grid-cols-2"
                >
                  {fields.map((field) => (
                    <div key={field.id} className="flex flex-col gap-2">
                      <label htmlFor={field.id} className="text-sm font-medium text-foreground">
                        {field.label}
                        {field.required && (
                          <span className="text-gold-400" aria-hidden="true">
                            {" *"}
                          </span>
                        )}
                      </label>
                      <input
                        id={field.id}
                        name={field.name}
                        type={field.type}
                        required={field.required}
                        aria-required={field.required || undefined}
                        autoComplete={field.autoComplete}
                        className={inputClass}
                      />
                    </div>
                  ))}

                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
                      {t.contact.form.message}
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      className={cn(inputClass, "resize-y")}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Button type="submit" size="lg" className="w-full">
                      {t.contact.form.submit}
                      <Send className="size-4" aria-hidden="true" />
                    </Button>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      {t.contact.form.privacy}
                    </p>
                  </div>
                </form>
              )}
            </Card>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
