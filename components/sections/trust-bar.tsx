"use client";

import * as React from "react";
import { useCopy } from "@/lib/i18n";
import { Container } from "@/components/primitives";

/**
 * Thin trust band that sits directly under the hero. Renders a centered
 * uppercase label above an infinite, edge-masked marquee of channel pills.
 * The channel list is duplicated so the `animate-marquee` (translateX 0 → -50%)
 * transform loops seamlessly; the second copy is aria-hidden for screen readers.
 */
export function TrustBar() {
  const t = useCopy();
  const { label, channels } = t.trust;

  return (
    <div className="border-y border-border py-10">
      <Container>
        <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>

        <div className="mask-fade-x relative mt-6 overflow-hidden">
          <ul className="flex w-max animate-marquee items-center gap-3 motion-reduce:animate-none hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <React.Fragment key={copy}>
                {channels.map((channel, i) => (
                  <li
                    key={`${copy}-${i}`}
                    aria-hidden={copy === 1 || undefined}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-4 py-2 text-sm text-muted-foreground"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-gold-400"
                      aria-hidden="true"
                    />
                    {channel}
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
}
