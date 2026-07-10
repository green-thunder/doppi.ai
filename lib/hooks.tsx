"use client";

import * as React from "react";
import { useInView, useReducedMotion, animate } from "framer-motion";

/**
 * Reusable client hooks for the landing-page motion layer.
 *
 * All hooks are SSR-safe: they render a deterministic final/neutral state on the
 * server and only start animating inside a post-mount effect. None use
 * `Math.random()` / `Date.now()` at module or render scope (hydration parity).
 * Every animated hook degrades to a static, complete state under reduced motion.
 */

/* -------------------------------------------------------------------------- */
/* useInViewLoop — resume/pause looping demos as they enter/leave the viewport */
/* -------------------------------------------------------------------------- */

/**
 * Thin wrapper over framer's `useInView` (NOT `once`) so looping demos only run
 * while visible. `amount` is how much of the element must be visible to count.
 */
export function useInViewLoop(
  ref: React.RefObject<Element>,
  { amount = 0.4 }: { amount?: number } = {},
): boolean {
  return useInView(ref, { amount });
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
/* parseStat + useCountUp — animate the leading number of a stat string        */
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
 * Drives a count-up when `active`. Returns the string to render. Init is the
 * final string (SSR-safe, no flash-of-zero). Re-runs on `raw` change (UZ↔EN).
 * Reduced motion / non-animatable → returns the final string.
 */
export function useCountUp(raw: string, active: boolean, duration = 1.2): string {
  const reduce = useReducedMotion();
  const spec = React.useMemo(() => parseStat(raw), [raw]);
  const [display, setDisplay] = React.useState<string>(raw);

  React.useEffect(() => {
    if (reduce || !spec.animatable || !active) {
      setDisplay(raw);
      return;
    }
    const controls = animate(0, spec.target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) {
        const n = spec.decimals
          ? v.toFixed(spec.decimals)
          : Math.round(v).toString();
        setDisplay(`${spec.prefix}${n}${spec.suffix}`);
      },
    });
    return () => controls.stop();
  }, [raw, active, reduce, spec, duration]);

  return display;
}

/* -------------------------------------------------------------------------- */
/* usePointerTilt — rAF-throttled tilt + spotlight, fine-pointer only          */
/* -------------------------------------------------------------------------- */

/**
 * Pointer-tracking tilt + spotlight via CSS custom props (`--mx/--my` spotlight
 * center %, `--rx/--ry` tilt degrees). Disabled under reduced motion and on
 * coarse (touch) pointers. rAF-throttled; listeners detach on unmount.
 */
export function usePointerTilt(opts?: {
  maxTilt?: number;
}): React.RefObject<HTMLDivElement> {
  const { maxTilt = 6 } = opts ?? {};
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const frame = React.useRef<number>(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let rect = el.getBoundingClientRect();

    const onEnter = () => {
      rect = el.getBoundingClientRect();
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
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, [reduce, maxTilt]);

  return ref;
}
