/**
 * Full-viewport grain texture for subtle depth. Static (no motion, so it's
 * reduced-motion-safe). Sits below the navbar (z-40), over the page content.
 * Uses `overlay` blend on the dark canvas and `multiply` on the light canvas so
 * the grain reads correctly in both themes.
 */
export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[40] bg-grain opacity-[0.035] mix-blend-overlay light:opacity-[0.04] light:mix-blend-multiply"
    />
  );
}
