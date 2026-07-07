import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The Do'ppi mark — a stylized traditional Uzbek doppi (skullcap) rendered as a
 * clean geometric SVG. Uses currentColor so it inherits the gold accent.
 */
export function DoppiMark({
  className,
  strokeWidth = 1.6,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 52 40"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Chust-style doppi: squat four-panel cushion (chorsi) silhouette */}
      <path d="M8,33 L8,25 C8,17 14,10.5 26,10.5 C38,10.5 44,17 44,25 L44,33 Q44,34.5 42.5,34.5 L9.5,34.5 Q8,34.5 8,33 Z" />
      {/* Base band with geometric (crenellated) border */}
      <path d="M8,25 H44" />
      <path d="M9.5,32.5 H42.5" />
      <path d="M11,32 V30 H14 V32 H17 V30 H20 V32 H23 V30 H26 V32 H29 V30 H32 V32 H35 V30 H38 V32 H41 V30" />
      {/* Four-panel fold lines */}
      <path d="M26,11 C21,15 16,20 13.5,25" opacity={0.55} />
      <path d="M26,11 C31,15 36,20 38.5,25" opacity={0.55} />
      {/* Qalampir (almond/paisley) motifs — the signature doppi ornament */}
      <path d="M14.5,22 C11,18.5 13,14.8 18,14.3 C22,13.9 23.8,15.6 22.5,18 C21.2,20.4 17.6,22.4 14.5,22 Z" />
      <path d="M37.5,22 C41,18.5 39,14.8 34,14.3 C30,13.9 28.2,15.6 29.5,18 C30.8,20.4 34.4,22.4 37.5,22 Z" />
      <circle cx="15.8" cy="18.6" r="1" fill="currentColor" stroke="none" />
      <circle cx="36.2" cy="18.6" r="1" fill="currentColor" stroke="none" />
      {/* Small flower dots at the crown */}
      <circle cx="26" cy="13.6" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="24" cy="15.2" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="28" cy="15.2" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Logo({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <DoppiMark className="h-7 w-9 text-gold-400" />
      {withWordmark && (
        <span className="font-display text-lg font-bold tracking-tight text-foreground">
          Do&apos;ppi<span className="text-gold-400">.ai</span>
        </span>
      )}
    </span>
  );
}

/**
 * Repeating ikat/suzani-inspired ornamental border strip. Decorative only.
 */
export function OrnamentStrip({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("h-6 w-full text-gold-500/25", className)}
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 10px), repeating-linear-gradient(90deg, transparent 0 4px, currentColor 4px 6px, transparent 6px 20px)",
        backgroundSize: "20px 100%, 20px 100%",
        maskImage:
          "radial-gradient(circle at center, black 0 60%, transparent 62%), linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
      }}
    />
  );
}

/**
 * Large decorative suzani medallion for section corners. Purely ornamental.
 */
export function Medallion({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="90" opacity="0.5" />
      <circle cx="100" cy="100" r="66" opacity="0.7" />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const x1 = 100 + Math.cos(a) * 66;
        const y1 = 100 + Math.sin(a) * 66;
        const x2 = 100 + Math.cos(a) * 90;
        const y2 = 100 + Math.sin(a) * 90;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} opacity="0.5" />;
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const cx = 100 + Math.cos(a) * 44;
        const cy = 100 + Math.sin(a) * 44;
        return (
          <path
            key={i}
            d={`M${cx} ${cy - 12}c5 4 5 20 0 24-5-4-5-20 0-24Z`}
            transform={`rotate(${(i / 8) * 360} ${cx} ${cy})`}
            opacity="0.7"
          />
        );
      })}
      <circle cx="100" cy="100" r="12" fill="currentColor" stroke="none" opacity="0.6" />
    </svg>
  );
}
