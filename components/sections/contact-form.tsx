"use client";

import * as React from "react";
import { Check, Send, Loader2 } from "lucide-react";
import type { SiteCopy } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "idle" | "pending" | "sent" | "error";

/**
 * The stateful half of the Contact section: just the form + outcome panel, so
 * the rest of the section stays on the server.
 */
export function ContactForm({
  t,
  email,
  phone,
  privacyHref,
}: {
  t: SiteCopy["contact"]["form"] & { success: SiteCopy["contact"]["success"] };
  email: string;
  phone: string;
  privacyHref: string;
}) {
  const [status, setStatus] = React.useState<Status>("idle");
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Move focus to the outcome panel so a screen-reader user is told what
  // happened instead of being left on a form that silently swapped out.
  React.useEffect(() => {
    if (status === "sent") panelRef.current?.focus();
  }, [status]);

  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent("Do'ppi.ai demo")}`;
  const telHref = `tel:${phone.replace(/\s+/g, "")}`;

  const fields: {
    id: string;
    name: string;
    label: string;
    type: string;
    required: boolean;
    autoComplete: string;
  }[] = [
    { id: "contact-name", name: "name", label: t.name, type: "text", required: true, autoComplete: "name" },
    { id: "contact-phone", name: "phone", label: t.phone, type: "tel", required: true, autoComplete: "tel" },
    { id: "contact-email", name: "email", label: t.email, type: "email", required: false, autoComplete: "email" },
    { id: "contact-business", name: "business", label: t.business, type: "text", required: false, autoComplete: "organization" },
  ];

  const inputClass =
    // A 1.31:1 focus ring and a 1.40:1 border both failed SC 1.4.11; the ring is
    // now the same --ring token every other control uses, at full opacity.
    "w-full rounded-xl border border-foreground/25 bg-background/60 px-4 py-3 text-sm text-foreground transition-colors " +
    "placeholder:text-muted-foreground hover:border-foreground/40 " +
    "focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background " +
    // Only after real interaction (:user-invalid), never on first paint — keeps
    // error styling in the site's language instead of just the native bubble.
    "[&:user-invalid]:border-red-500/60 [&:user-invalid]:ring-1 [&:user-invalid]:ring-red-500/25";

  if (status === "sent") {
    return (
      <div
        ref={panelRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="enter-pop flex flex-col items-center py-10 text-center focus:outline-none"
      >
        <span className="grid size-14 place-items-center rounded-full bg-gold-gradient text-[#0A0A0B] shadow-gold-sm">
          <Check className="size-7" strokeWidth={2.25} aria-hidden="true" />
        </span>
        <h3 className="mt-6 font-display text-xl font-semibold text-foreground">
          {t.success.title}
        </h3>
        <p className="mt-2 max-w-sm leading-relaxed text-muted-foreground">
          {t.success.subtitle}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (status === "pending") return;
        const fd = new FormData(e.currentTarget as HTMLFormElement);
        const payload = {
          name: (fd.get("name") ?? "").toString().trim(),
          phone: (fd.get("phone") ?? "").toString().trim(),
          email: (fd.get("email") ?? "").toString().trim(),
          business: (fd.get("business") ?? "").toString().trim(),
          message: (fd.get("message") ?? "").toString().trim(),
        };

        setStatus("pending");
        try {
          const res = await fetch("/api/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error(`lead POST ${res.status}`);
          setStatus("sent");
        } catch {
          // Never claim success we don't have: show the direct
          // contact routes instead so the lead has somewhere to go.
          setStatus("error");
        }
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
          {t.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          className={cn(inputClass, "resize-y")}
        />
      </div>

      <div className="sm:col-span-2">
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={status === "pending"}
          aria-busy={status === "pending"}
        >
          {status === "pending" ? t.sending : t.submit}
          {status === "pending" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
        </Button>

        {status === "error" ? (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm"
          >
            <p className="font-semibold text-foreground">{t.errorTitle}</p>
            <p className="mt-1 leading-relaxed text-muted-foreground">
              {t.errorBody}
            </p>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <a href={mailtoHref} className="font-medium text-gold-400 underline underline-offset-4">
                {email}
              </a>
              <a href={telHref} className="font-medium text-gold-400 underline underline-offset-4">
                {phone}
              </a>
            </p>
          </div>
        ) : null}

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {t.privacy}{" "}
          <a href={privacyHref} className="underline underline-offset-4 hover:text-foreground">
            {t.privacyLinkLabel}
          </a>
        </p>
      </div>
    </form>
  );
}
