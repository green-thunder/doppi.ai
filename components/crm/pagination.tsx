"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

/** Prev / next pager that preserves existing query params (q, filters…). */
export function Pagination({ page, pageCount }: { page: number; pageCount: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  if (pageCount <= 1) return null;

  const href = (p: number) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", String(p));
    return `${pathname}?${params.toString()}`;
  };

  const btn =
    "inline-flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-foreground/[0.05]";
  const disabled = "pointer-events-none opacity-40";

  return (
    <div className="flex items-center justify-between gap-2 pt-2">
      <Link href={href(page - 1)} className={cn(btn, page <= 1 && disabled)} aria-disabled={page <= 1}>
        <ChevronLeft className="size-4" />
      </Link>
      <span className="text-sm text-muted-foreground">
        {page} / {pageCount}
      </span>
      <Link
        href={href(page + 1)}
        className={cn(btn, page >= pageCount && disabled)}
        aria-disabled={page >= pageCount}
      >
        <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}
