"use client";

import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Medallion } from "@/components/brand";

/**
 * Slow gold aurora: a theme-aware mesh wash plus two drifting, blurred gold
 * blobs. Sits behind hero content. Under reduced motion the blobs are static
 * (still visible) — the global CSS reset also freezes any residual animation.
 */
export function AuroraBackdrop({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute inset-0 bg-aurora mask-fade-b" />
      <div
        className={cn(
          "decor-glow absolute left-[10%] top-[-8rem] h-72 w-[34rem] rounded-full bg-gold-500/20 blur-[120px]",
          !reduce && "animate-aurora-drift will-change-transform",
        )}
      />
      <div
        className={cn(
          "decor-glow absolute right-[6%] top-[2rem] h-64 w-[28rem] rounded-full bg-gold-300/15 blur-[130px]",
          !reduce && "animate-aurora-drift [animation-delay:-13s] will-change-transform",
        )}
      />
    </div>
  );
}

/**
 * Rotating + breathing Medallion watermark for section corners. Positioning
 * lives on the wrapper so translate-based centering isn't clobbered by the
 * SVG's rotation. Reduced motion → a static medallion (today's look).
 */
export function AnimatedMedallion({
  className,
  spin = true,
  breathe = true,
}: {
  className?: string;
  spin?: boolean;
  breathe?: boolean;
}) {
  const reduce = useReducedMotion();
  // NOTE: spin + breathe live on separate elements. Two `animate-*` classes on
  // ONE element both set the `animation` shorthand, so only one would apply.
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute",
        !reduce && breathe && "animate-breathe [animation-duration:9s]",
        className,
      )}
    >
      <Medallion className={cn("h-full w-full", !reduce && spin && "animate-spin-slow")} />
    </div>
  );
}
