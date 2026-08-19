"use client";

import * as React from "react";

/**
 * Reusable client hooks for the landing-page motion layer.
 *
 * All hooks are SSR-safe: they render a deterministic final/neutral state on the
 * server and only start animating inside a post-mount effect. None use
 * `Math.random()` / `Date.now()` at module or render scope (hydration parity).
 * Every animated hook degrades to a static, complete state under reduced motion.
 */

/* -------------------------------------------------------------------------- */
/* useReducedMotion / useInView — the two motion primitives everything else uses */
/* -------------------------------------------------------------------------- */

// One MediaQueryList + one change listener for the whole page, instead of ~46
// per-hook copies. Lazily created so the module stays importable on the server.
let reduceMql: MediaQueryList | null = null;
const reduceSubs = new Set<() => void>();

function ensureReduceMql(): MediaQueryList {
  if (!reduceMql) {
    reduceMql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMql.addEventListener("change", () => {
      reduceSubs.forEach((cb) => cb());
    });
  }
  return reduceMql;
}

function subscribeReduce(cb: () => void): () => void {
  ensureReduceMql();
  reduceSubs.add(cb);
  return () => {
    reduceSubs.delete(cb);
  };
}

function getReduceSnapshot(): boolean | null {
  return ensureReduceMql().matches;
}

function getReduceServerSnapshot(): boolean | null {
  return null;
}

/**
 * `null` on the server and during the hydration render (so both agree), then
 * the live value. Callers treat null as "animate": that is what the markup was
 * always prerendered as.
 */
export function useReducedMotion(): boolean | null {
  return React.useSyncExternalStore(
    subscribeReduce,
    getReduceSnapshot,
    getReduceServerSnapshot,
  );
}

/* -------------------------------------------------------------------------- */
/* Shared IntersectionObserver pool                                           */
/* -------------------------------------------------------------------------- */

interface IoPool {
  io: IntersectionObserver;
  cbs: Map<Element, (entry: IntersectionObserverEntry) => void>;
}

// Observers keyed by option signature. The page only ever uses a couple of
// signatures ('-80px' reveals/count-ups, threshold-0.4 loop gates), so ~70
// per-element observers collapse into 2-3 shared ones.
const ioPools = new Map<string, IoPool>();

function observeShared(
  el: Element,
  { margin, amount }: { margin?: string; amount?: number },
  cb: (entry: IntersectionObserverEntry) => void,
): () => void {
  const key = `${margin ?? ""}|${amount ?? ""}`;
  let pool = ioPools.get(key);
  if (!pool) {
    const cbs: IoPool["cbs"] = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) cbs.get(entry.target)?.(entry);
      },
      { rootMargin: margin, threshold: amount },
    );
    pool = { io, cbs };
    ioPools.set(key, pool);
  }
  pool.cbs.set(el, cb);
  pool.io.observe(el);

  let done = false;
  return () => {
    if (done) return;
    done = true;
    pool.cbs.delete(el);
    pool.io.unobserve(el);
    if (pool.cbs.size === 0) {
      pool.io.disconnect();
      ioPools.delete(key);
    }
  };
}

/**
 * Elements inside a `content-visibility: auto` section that is currently
 * skipped report an empty rect; geometry-based decisions must ignore them
 * until the section is actually laid out.
 */
function isEmptyRect(rect: DOMRectReadOnly): boolean {
  return rect.width === 0 && rect.height === 0;
}

/**
 * IntersectionObserver wrapper (pooled). `once` latches on first entry;
 * otherwise the value tracks visibility both ways (used by the looping demos).
 * `margin` maps to rootMargin, `amount` to threshold.
 */
export function useInView(
  ref: React.RefObject<Element | null>,
  { once = false, margin, amount }: { once?: boolean; margin?: string; amount?: number } = {},
): boolean {
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // No observer (very old browser, or jsdom): treat as visible so nothing is
    // left permanently hidden or permanently paused.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const cleanup = observeShared(el, { margin, amount }, (entry) => {
      if (isEmptyRect(entry.boundingClientRect)) return;
      if (entry.isIntersecting) {
        setInView(true);
        if (once) cleanup();
      } else if (!once) {
        setInView(false);
      }
    });
    return cleanup;
  }, [ref, once, margin, amount]);

  return inView;
}

/**
 * Solves a CSS cubic-bezier so JS-driven motion eases identically to the CSS
 * transitions elsewhere on the page. Newton-Raphson, 5 iterations — plenty for
 * per-frame values that end up rounded to an integer anyway.
 */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  return (x: number) => {
    let t = x;
    for (let i = 0; i < 5; i += 1) {
      const d = slopeX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= (sampleX(t) - x) / d;
    }
    return sampleY(Math.min(Math.max(t, 0), 1));
  };
}

/** The site's standard ease — matches cubic-bezier(0.22, 1, 0.36, 1) in CSS. */
const EASE_OUT = cubicBezier(0.22, 1, 0.36, 1);

/* -------------------------------------------------------------------------- */
/* useRevealPhase — scroll-reveal that never hides server-rendered content      */
/* -------------------------------------------------------------------------- */

export type RevealPhase = "static" | "hidden" | "shown";

/**
 * Drives the scroll-in reveal WITHOUT shipping `opacity: 0` in the HTML.
 *
 * The server renders "static" — fully visible — so the page is readable before
 * (and without) hydration, and the LCP element is not gated on the JS bundle.
 * After mount the hidden state is armed only for elements that are still below
 * the fold, where hiding them is invisible to the visitor. Anything already on
 * screen simply stays painted.
 */
export function useRevealPhase(ref: React.RefObject<Element | null>): RevealPhase {
  const [phase, setPhase] = React.useState<RevealPhase>("static");

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already in view at mount: leave it alone rather than hide what is being
    // read. An empty rect means the element sits inside a skipped
    // content-visibility section — i.e. far below the fold — so arming is safe.
    const rect = el.getBoundingClientRect();
    if (!isEmptyRect(rect) && rect.top < window.innerHeight) return;

    setPhase("hidden");
    const cleanup = observeShared(el, { margin: "-80px" }, (entry) => {
      if (isEmptyRect(entry.boundingClientRect)) return;
      if (entry.isIntersecting) {
        setPhase("shown");
        cleanup();
      }
    });
    return cleanup;
  }, [ref]);

  return phase;
}

/* -------------------------------------------------------------------------- */
/* useInViewLoop — resume/pause looping demos as they enter/leave the viewport */
/* -------------------------------------------------------------------------- */

/**
 * Visibility gate for looping demos (NOT `once`), so they only run on screen.
 * `amount` is how much of the element must be visible to count.
 */
export function useInViewLoop(
  ref: React.RefObject<Element | null>,
  { amount = 0.4 }: { amount?: number } = {},
): boolean {
  return useInView(ref, { amount });
}

/* -------------------------------------------------------------------------- */
/* useActiveSection — which section id is currently mid-viewport               */
/* -------------------------------------------------------------------------- */

/**
 * Tracks which of the given section ids currently crosses the middle of the
 * viewport (a -45%/-50% band), for the navbar's active-link indicator. Sticky:
 * keeps the last section when none is in the band (e.g. at the very top).
 */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = React.useState<string | null>(null);
  const key = ids.join(",");

  React.useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);

  return active;
}

/* -------------------------------------------------------------------------- */
/* useCountUpTimer — a live "MM:SS" call clock that ticks up while active       */
/* -------------------------------------------------------------------------- */

function formatClock(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Counts seconds up while `active`. Resets to 0 each time it (re)activates.
 * Reduced motion → a fixed, non-zero clock so the card still reads as a live
 * call (reuses today's "00:24" literal). No `Date` usage.
 */
export function useCountUpTimer({
  active,
  reduce,
}: {
  active: boolean;
  reduce: boolean | null;
}): string {
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    if (reduce || !active) {
      setSeconds(0);
      return;
    }
    setSeconds(0);
    const id = window.setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [active, reduce]);

  if (reduce) return "00:24";
  return formatClock(seconds);
}

/* -------------------------------------------------------------------------- */
/* useTypewriter — type a string out char-by-char, optionally looping          */
/* -------------------------------------------------------------------------- */

/**
 * Types `fullText` out one character at a time while `active`.
 *
 * Init state is the FULL text (SSR-safe: server + first client render match, and
 * no-JS users see complete text). After mount, when animating, it blanks and
 * retypes. Effect deps include `fullText`, so a UZ↔EN toggle restarts cleanly
 * with no stale index into a shorter translated string.
 *
 * Reduced motion → returns the full text immediately, `done: true`.
 */
export function useTypewriter(
  fullText: string,
  {
    active,
    reduce,
    speed = 32,
    startDelay = 200,
    loop = false,
    holdMs = 2200,
  }: {
    active: boolean;
    reduce: boolean | null;
    speed?: number;
    startDelay?: number;
    loop?: boolean;
    holdMs?: number;
  },
): { text: string; done: boolean } {
  const [text, setText] = React.useState(fullText);
  const [done, setDone] = React.useState(true);

  React.useEffect(() => {
    if (reduce || !active) {
      setText(fullText);
      setDone(true);
      return;
    }

    let i = 0;
    let cancelled = false;
    const timers: number[] = [];

    const clearAll = () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      timers.length = 0;
    };

    const tick = () => {
      if (cancelled) return;
      i += 1;
      setText(fullText.slice(0, i));
      if (i >= fullText.length) {
        setDone(true);
        if (loop) {
          timers.push(window.setTimeout(startCycle, holdMs));
        }
        return;
      }
      timers.push(window.setTimeout(tick, speed));
    };

    const startCycle = () => {
      if (cancelled) return;
      i = 0;
      setText("");
      setDone(false);
      timers.push(window.setTimeout(tick, speed));
    };

    setText("");
    setDone(false);
    const startTimer = window.setTimeout(startCycle, startDelay);
    timers.push(startTimer);

    return clearAll;
  }, [fullText, active, reduce, speed, startDelay, loop, holdMs]);

  return { text, done };
}

/* -------------------------------------------------------------------------- */
/* parseStat + useCountUpText — animate the leading number of a stat string    */
/* -------------------------------------------------------------------------- */

export interface ParsedStat {
  animatable: boolean;
  prefix: string;
  target: number;
  decimals: number;
  suffix: string;
}

/**
 * Parse a stat string into an animatable spec. Only animates when the string is
 * `[optional non-digit prefix][number][suffix]` with NO interior digit-breaking
 * characters, so ranges / composites stay static.
 *
 *   "70%"   → animate to 70%          "24/7"   → static (suffix has a digit)
 *   "$19"   → animate to $19          "2–5×"   → static (suffix starts with –)
 *   "2025"  → animate to 2025         "Custom" → static (no leading number)
 *   "90%+"  → animate to 90%+
 */
export function parseStat(raw: string): ParsedStat {
  const fallback: ParsedStat = {
    animatable: false,
    prefix: "",
    target: 0,
    decimals: 0,
    suffix: raw,
  };

  const m = raw.match(/^(\D*?)(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return fallback;

  const [, prefix, numStr, suffix] = m;
  if (/\d/.test(suffix)) return fallback; // "24/7", "90/10"
  if (/[–—\-/:]/.test(prefix)) return fallback;
  if (/^[–—\-/:]/.test(suffix)) return fallback; // "2–5×" → suffix "–5×"

  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  return {
    animatable: true,
    prefix,
    target: parseFloat(numStr),
    decimals,
    suffix,
  };
}

/**
 * Drives a count-up by writing `textContent` directly — no React re-render per
 * frame (results fires six of these at once, exactly while the user scrolls).
 * The DOM already contains the final string from SSR, so before/without the
 * effect nothing flashes. Re-runs on `raw` change (UZ↔EN). Reduced motion /
 * non-animatable → the final string is (re)written once.
 */
export function useCountUpText(
  ref: React.RefObject<HTMLElement | null>,
  raw: string,
  active: boolean,
  duration = 1.2,
): void {
  const reduce = useReducedMotion();
  const spec = React.useMemo(() => parseStat(raw), [raw]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce || !spec.animatable || !active) {
      el.textContent = raw;
      return;
    }
    let frame = 0;
    let start = 0;
    const ms = duration * 1000;

    const step = (now: number) => {
      if (!start) start = now;
      const p = Math.min((now - start) / ms, 1);
      if (p >= 1) {
        el.textContent = raw; // land exactly on the source string
        return;
      }
      const v = EASE_OUT(p) * spec.target;
      const n = spec.decimals ? v.toFixed(spec.decimals) : Math.round(v).toString();
      el.textContent = `${spec.prefix}${n}${spec.suffix}`;
      frame = window.requestAnimationFrame(step);
    };

    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [ref, raw, active, reduce, spec, duration]);
}

/* -------------------------------------------------------------------------- */
/* usePointerTilt — rAF-throttled tilt + spotlight, fine-pointer only          */
/* -------------------------------------------------------------------------- */

/**
 * Pointer-tracking tilt + spotlight via CSS custom props (`--mx/--my` spotlight
 * center %, `--rx/--ry` tilt degrees). Disabled under reduced motion and on
 * coarse (touch) pointers. rAF-throttled; listeners detach on unmount.
 *
 * The card rect is captured at pointerenter (the card is at rest then, so the
 * measurement is clean) and corrected by scroll deltas while the pointer stays
 * inside — re-measuring per move would read back a tilt-transformed box.
 */
export function usePointerTilt(opts?: {
  maxTilt?: number;
}): React.RefObject<HTMLDivElement | null> {
  const { maxTilt = 6 } = opts ?? {};
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const frame = React.useRef<number>(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let rect = el.getBoundingClientRect();
    let lastX = window.scrollX;
    let lastY = window.scrollY;
    let inside = false;

    const onEnter = () => {
      inside = true;
      rect = el.getBoundingClientRect();
      lastX = window.scrollX;
      lastY = window.scrollY;
    };
    const onScroll = () => {
      if (!inside) return;
      const dx = window.scrollX - lastX;
      const dy = window.scrollY - lastY;
      lastX = window.scrollX;
      lastY = window.scrollY;
      rect = new DOMRect(rect.x - dx, rect.y - dy, rect.width, rect.height);
    };
    const onMove = (e: PointerEvent) => {
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(() => {
        frame.current = 0;
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
        el.style.setProperty("--rx", `${(0.5 - py) * maxTilt}deg`);
        el.style.setProperty("--ry", `${(px - 0.5) * maxTilt}deg`);
      });
    };
    const onLeave = () => {
      inside = false;
      if (frame.current) window.cancelAnimationFrame(frame.current);
      frame.current = 0;
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, [reduce, maxTilt]);

  return ref;
}
