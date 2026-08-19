"use client";

import * as React from "react";

/**
 * Corrects in-page anchor landings. Sections use `content-visibility: auto`
 * with an estimated `contain-intrinsic-size`, so a smooth scroll to a distant
 * anchor computes its destination against estimates that turn into real
 * layouts mid-flight — the scroll can land some distance off target. After the
 * scroll settles this snaps to the true position (if it drifted), respecting
 * scroll-padding-top. Renders nothing.
 *
 * Cancelled by any user scroll input so it never fights the visitor.
 */
export function AnchorScrollFix() {
  React.useEffect(() => {
    let cancel: (() => void) | null = null;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const anchor = (e.target as Element).closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = decodeURIComponent(anchor.getAttribute("href")!.slice(1));
      const el = id ? document.getElementById(id) : null;
      if (!el) return;

      cancel?.();

      const correct = () => {
        cleanup();
        const pad =
          parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        const drift = el.getBoundingClientRect().top - pad;
        // Don't correct at the document's end, where the target can't reach the top.
        const atBottom =
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 4;
        if (Math.abs(drift) > 8 && !(atBottom && drift > 0)) {
          window.scrollBy({ top: drift, behavior: "instant" as ScrollBehavior });
        }
      };
      const cleanup = () => {
        window.clearTimeout(timer);
        window.removeEventListener("scrollend", correct);
        window.removeEventListener("wheel", cleanup);
        window.removeEventListener("touchstart", cleanup);
        window.removeEventListener("keydown", cleanup);
        cancel = null;
      };

      // scrollend where supported; a timeout covers Safari and reduced motion
      // (instant jumps may not fire scrollend for programmatic navigation).
      const timer = window.setTimeout(correct, 900);
      window.addEventListener("scrollend", correct, { once: true });
      window.addEventListener("wheel", cleanup, { passive: true });
      window.addEventListener("touchstart", cleanup, { passive: true });
      window.addEventListener("keydown", cleanup);
      cancel = cleanup;
    };

    document.addEventListener("click", onClick);
    return () => {
      cancel?.();
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
