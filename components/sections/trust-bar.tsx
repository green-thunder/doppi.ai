import type { SiteCopy } from "@/lib/content";
import { Container } from "@/components/layout";
import { cn } from "@/lib/utils";

/**
 * Thin trust band that sits directly under the hero. Renders a centered
 * uppercase label above an infinite, edge-masked marquee of channel pills.
 * The channel list is duplicated so the `animate-marquee` (translateX 0 → -50%)
 * transform loops seamlessly; the second copy is aria-hidden for screen readers.
 */
export function TrustBar({ t }: { t: SiteCopy["trust"] }) {
  const { label, channels } = t;

  return (
    <div className="border-y border-border py-10 [contain-intrinsic-size:auto_12rem] [content-visibility:auto]">
      <Container>
        <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>

        <div className="mask-fade-x relative mt-6 overflow-hidden">
          {/* Two equal-width copies, each carrying its own internal gap PLUS a
              trailing gap (pr-3). translateX(-50%) then lands exactly one copy
              over, so the loop is seamless with no half-gap jump. */}
          <ul className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3 motion-reduce:animate-none">
            {[0, 1].map((copy) => (
              <li
                key={copy}
                aria-hidden={copy === 1 || undefined}
                className={cn(
                  "flex shrink-0 items-center gap-3 pr-3",
                  // the duplicate exists only to make the loop seamless
                  copy === 1 && "motion-reduce:hidden",
                )}
              >
                {channels.map((channel, i) => (
                  <span
                    key={i}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-4 py-2 text-sm font-medium tracking-[0.01em] text-foreground/75 transition-colors duration-200 hover:border-gold-500/40 hover:text-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-400" aria-hidden="true" />
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
