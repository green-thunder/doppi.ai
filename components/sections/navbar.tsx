"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActiveSection, useReducedMotion } from "@/lib/hooks";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { altPath, type Lang } from "@/lib/lang";
import type { SiteCopy } from "@/lib/content";
import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar({
  t,
  a11y,
  lang,
}: {
  t: SiteCopy["nav"];
  a11y: SiteCopy["a11y"];
  lang: Lang;
}) {
  const { theme, toggle: toggleTheme } = useTheme();
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // Which section is mid-viewport, for the active-link underline.
  const sectionIds = React.useMemo(
    () => t.links.map((l) => l.href.replace(/^#/, "")),
    [t.links],
  );
  const activeId = useActiveSection(sectionIds);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Language lives in the URL, so the toggle is two real links. Crossing between
  // the (uz) and (en) root layouts is a document navigation either way, so there
  // is nothing to prefetch.
  const LangToggle = (
    <div
      className="inline-flex h-11 items-center gap-0.5 rounded-full border border-border bg-foreground/[0.04] px-2 text-xs font-semibold"
      role="group"
      aria-label={a11y.switchLang}
    >
      {(["uz", "en"] as const).map((l, i) => (
        <React.Fragment key={l}>
          {i > 0 && <span className="text-muted-foreground">/</span>}
          <Link
            href={altPath(pathname, l)}
            hrefLang={l}
            prefetch={false}
            aria-current={lang === l ? "true" : undefined}
            className={cn(
              "rounded-sm px-1.5 py-2 transition-colors hover:text-foreground",
              lang === l
                ? "text-gold-500 underline decoration-gold-500 decoration-2 underline-offset-4"
                : "text-foreground/70",
            )}
          >
            {l.toUpperCase()}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );

  const ThemeToggle = (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-foreground/[0.04] text-foreground/80 transition-colors hover:border-foreground/20 hover:text-foreground"
      aria-label={theme === "dark" ? a11y.lightMode : a11y.darkMode}
    >
      {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );

  return (
    <header
      className={cn(
        // Background/border/shadow only: transition-all used to animate the
        // backdrop-filter blur across the scroll threshold — the single most
        // expensive property to interpolate, right while the user scrolls.
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300",
        !reduce && "enter-down",
        scrolled ? "border-b border-border glass shadow-gold-sm" : "border-b border-transparent",
      )}
    >
      <nav
        className={cn(
          // Height-only transition: layout stays confined to the fixed header.
          "mx-auto flex max-w-6xl items-center justify-between px-5 transition-[height] duration-300 lg:px-8",
          scrolled ? "h-14" : "h-16",
        )}
      >
        <a href="#top" aria-label="Do'ppi.ai" className="shrink-0">
          {/* Icon-only below sm so the row never overflows the mobile controls
              at the 140% root font; full wordmark from sm up. */}
          <Logo withWordmark={false} className="sm:hidden" />
          <Logo className="hidden sm:inline-flex" />
        </a>

        {/* The inline row needs ~1070px once the links, both toggles and the CTA
            are laid out at the 112% root size — hence lg, not md. */}
        <div className="hidden items-center gap-6 lg:flex">
          {t.links.map((l) => {
            const active = activeId === l.href.replace(/^#/, "");
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "relative text-sm transition-colors hover:text-foreground",
                  "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-gold-500 after:transition-transform after:duration-300",
                  active
                    ? "text-foreground after:scale-x-100"
                    : "text-foreground/70 after:scale-x-0",
                )}
              >
                {l.label}
              </a>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {ThemeToggle}
          {LangToggle}
          <Button asChild size="sm">
            <a href="#contact">{t.cta}</a>
          </Button>
        </div>

        {/* Below lg: toggles + a CTA (from sm up, where there is room for it) +
            the menu. Without the CTA here a phone visitor has none between the
            hero and pricing. */}
        <div className="flex items-center gap-2 lg:hidden">
          {ThemeToggle}
          {LangToggle}
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href="#contact">{t.cta}</a>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? a11y.closeMenu : a11y.openMenu}
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-foreground/[0.04] text-foreground"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="enter-down border-t border-border glass lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
            {t.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base text-foreground/80 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <Button asChild className="mt-2 w-full" size="lg">
              <a href="#contact" onClick={() => setOpen(false)}>
                {t.cta}
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
