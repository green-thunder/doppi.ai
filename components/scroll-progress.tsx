"use client";

import * as React from "react";

/**
 * Thin gold progress bar pinned to the top of the viewport, tracking scroll.
 * Hidden entirely under reduced motion.
 *
 * Written against the raw scroll event rather than a motion library: this sits
 * in the root layout, so pulling a scroll/spring runtime in here would have cost
 * every page — legal pages included — for a 2px decoration.
 */
export function ScrollProgress() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
  }, []);

  React.useEffect(() => {
    if (!enabled) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      el.style.transform = `scaleX(${p})`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gold-400"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
