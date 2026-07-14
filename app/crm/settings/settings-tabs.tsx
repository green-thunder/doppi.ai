"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import { cn } from "@/lib/utils";

type TabKey = "general" | "team" | "pipeline" | "fields" | "automations" | "profile";

/**
 * Segmented tab bar for the Settings section. Admin-only tabs (General, Team,
 * Pipeline) are hidden for non-admins; Profile is always shown.
 */
export function SettingsTabs({ isAdmin }: { isAdmin: boolean }) {
  const { t, tr } = useCrmI18n();
  const pathname = usePathname();

  const tabs: { key: TabKey; href: string; label: string; adminOnly: boolean }[] = [
    { key: "general", href: "/crm/settings", label: tr("Umumiy", "General"), adminOnly: true },
    { key: "team", href: "/crm/settings/team", label: t.nav.team, adminOnly: true },
    { key: "pipeline", href: "/crm/settings/pipeline", label: t.nav.pipeline, adminOnly: true },
    { key: "fields", href: "/crm/settings/fields", label: tr("Maydonlar", "Fields"), adminOnly: true },
    {
      key: "automations",
      href: "/crm/settings/automations",
      label: tr("Avtomatlashtirish", "Automation"),
      adminOnly: true,
    },
    { key: "profile", href: "/crm/settings/profile", label: t.nav.profile, adminOnly: false },
  ];

  const visible = tabs.filter((tab) => !tab.adminOnly || isAdmin);

  const isActive = (href: string) =>
    href === "/crm/settings"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="overflow-x-auto">
      <nav className="inline-flex items-center gap-1 rounded-xl border border-border bg-card/60 p-1">
        {visible.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-sm font-medium font-display tracking-tight transition-colors whitespace-nowrap",
                active
                  ? "bg-gold-500/15 text-gold-300 light:text-gold-700"
                  : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
