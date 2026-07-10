"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t, lang, toggle } = useI18n();
  const { theme, toggle: toggleTheme } = useTheme();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const LangToggle = (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-foreground/[0.04] px-3 text-xs font-semibold text-foreground/80 transition-colors hover:border-foreground/20 hover:text-foreground"
      aria-label={t.a11y.switchLang}
    >
      <span className={cn(lang === "uz" && "text-gold-500")}>UZ</span>
      <span className="text-muted-foreground">/</span>
      <span className={cn(lang === "en" && "text-gold-500")}>EN</span>
    </button>
  );

  const ThemeToggle = (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-foreground/[0.04] text-foreground/80 transition-colors hover:border-foreground/20 hover:text-foreground"
      aria-label={theme === "dark" ? t.a11y.lightMode : t.a11y.darkMode}
    >
      {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );

  return (
    <motion.header
      initial={reduce ? false : { y: -12, opacity: 0 }}
      animate={reduce ? false : { y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-border glass shadow-gold-sm" : "border-b border-transparent",
      )}
    >
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between px-5 lg:px-8 transition-all duration-300",
          scrolled ? "h-14" : "h-16",
        )}
      >
        <a href="#top" aria-label="Do'ppi.ai" className="shrink-0">
          {/* Icon-only below sm so the row never overflows the mobile controls
              at the 140% root font; full wordmark from sm up. */}
          <Logo withWordmark={false} className="sm:hidden" />
          <Logo className="hidden sm:inline-flex" />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {t.nav.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-foreground/70 transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {ThemeToggle}
          {LangToggle}
          <Button asChild size="sm">
            <a href="#contact">{t.nav.cta}</a>
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          {ThemeToggle}
          {LangToggle}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-foreground/[0.04] text-foreground"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border glass md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
            {t.nav.links.map((l) => (
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
                {t.nav.cta}
              </a>
            </Button>
          </div>
        </div>
      )}
    </motion.header>
  );
}
