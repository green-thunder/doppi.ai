"use client";

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
          {/* Two equal-width copies, each carrying its own internal gap PLUS a
              trailing gap (pr-3). translateX(-50%) then lands exactly one copy
              over, so the loop is seamless with no half-gap jump. */}
          <ul className="flex w-max animate-marquee motion-reduce:animate-none hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <li
                key={copy}
                aria-hidden={copy === 1 || undefined}
                className="flex shrink-0 items-center gap-3 pr-3"
              >
                {channels.map((channel, i) => (
                  <span
                    key={i}
                    className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-4 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:border-gold-500/40 hover:text-foreground"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-gold-400 transition-transform duration-200 group-hover:scale-150"
                      aria-hidden="true"
                    />
                    {channel}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
}
