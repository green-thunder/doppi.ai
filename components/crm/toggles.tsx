"use client";

import { Languages, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import { cn } from "@/lib/utils";

const btn =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(btn, "w-9 px-0", className)}
      aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  );
}

export function LocaleToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useCrmI18n();
  const router = useRouter();
  const onClick = () => {
    setLocale(locale === "uz" ? "en" : "uz");
    router.refresh(); // re-render server components in the new language
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(btn, className)}
      aria-label="Switch language"
    >
      <Languages className="size-[18px]" />
      <span className="uppercase">{locale === "uz" ? "EN" : "UZ"}</span>
    </button>
  );
}
