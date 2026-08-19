/**
 * Full-viewport grain texture for subtle depth. Static (no motion, so it's
 * reduced-motion-safe). Sits BEHIND the content (-z-10) with plain alpha
 * compositing: the old on-top `mix-blend-overlay` version forced the browser to
 * re-blend the whole viewport on every scrolled frame AND softened every glyph
 * on the page. Semi-transparent card fills still pick the texture up.
 */
export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 bg-grain opacity-[0.05] light:opacity-[0.03]"
    />
  );
}
