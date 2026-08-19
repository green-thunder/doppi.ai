import { cn } from "@/lib/utils";
import { Medallion } from "@/components/brand";

/**
 * Server components: no hooks needed here. Reduced motion is handled entirely
 * by CSS — the global reset in globals.css freezes every animation, and
 * `motion-reduce:animate-none` removes these ones outright.
 */

/**
 * Slow gold aurora: a theme-aware mesh wash plus two drifting gold blobs. The
 * blobs are pre-blurred radial gradients rather than `filter: blur(120px)` —
 * same soft look, none of the huge rasterized filter surfaces the GPU had to
 * hold and re-composite for the whole 26s drift loop.
 */
export function AuroraBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute inset-0 bg-aurora mask-fade-b" />
      <div className="decor-glow absolute left-[10%] top-[-8rem] h-72 w-[34rem] animate-aurora-drift rounded-full bg-[radial-gradient(closest-side,hsl(var(--g-500)/0.26),transparent_72%)] motion-reduce:animate-none" />
      <div className="decor-glow absolute right-[6%] top-[2rem] h-64 w-[28rem] animate-aurora-drift rounded-full bg-[radial-gradient(closest-side,hsl(var(--g-300)/0.2),transparent_72%)] [animation-delay:-13s] motion-reduce:animate-none" />
    </div>
  );
}

/**
 * Slowly rotating Medallion watermark for section corners. Positioning lives on
 * the wrapper so translate-based centering isn't clobbered by the SVG's
 * rotation. (The old opacity "breathe" pulse is gone — a pulse on a 7%-opacity
 * watermark was motion for its own sake.)
 */
export function AnimatedMedallion({
  className,
  spin = true,
}: {
  className?: string;
  spin?: boolean;
}) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute", className)}>
      <Medallion
        className={cn("h-full w-full", spin && "animate-spin-slow motion-reduce:animate-none")}
      />
    </div>
  );
}
