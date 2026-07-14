import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "gold" | "green" | "red" | "blue" | "gray" | "purple" | "amber";

const toneClass: Record<Tone, string> = {
  gold: "border-gold-500/30 bg-gold-500/10 text-gold-300 light:text-gold-700",
  green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 light:text-emerald-700",
  red: "border-red-500/30 bg-red-500/10 text-red-400 light:text-red-700",
  blue: "border-sky-500/30 bg-sky-500/10 text-sky-400 light:text-sky-700",
  gray: "border-border bg-foreground/[0.06] text-muted-foreground",
  purple: "border-violet-500/30 bg-violet-500/10 text-violet-400 light:text-violet-700",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-400 light:text-amber-700",
};

/**
 * Small colored status chip. Either pass a semantic `tone`, or a raw hex `color`
 * to render a dot + tinted text (used for pipeline stage colors).
 */
export function StatusPill({
  tone = "gray",
  color,
  className,
  children,
}: {
  tone?: Tone;
  color?: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (color) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
          className,
        )}
        style={{
          borderColor: `${color}44`,
          backgroundColor: `${color}1a`,
          color,
        }}
      >
        <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
        {children}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
