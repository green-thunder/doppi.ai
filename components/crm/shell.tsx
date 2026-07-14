"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ChevronDown,
  Handshake,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  User as UserIcon,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { DoppiMark } from "@/components/brand";
import { InitialsAvatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusPill } from "@/components/ui/status-pill";
import { LocaleToggle, ThemeToggle } from "./toggles";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import { logoutAction } from "@/app/(auth)/actions";
import type { PublicUser } from "@/lib/crm/types";
import { cn } from "@/lib/utils";

type NavKey = "dashboard" | "contacts" | "companies" | "deals" | "activities" | "assistant";

const NAV: { key: NavKey; href: string; icon: LucideIcon; exact?: boolean }[] = [
  { key: "dashboard", href: "/crm", icon: LayoutDashboard, exact: true },
  { key: "contacts", href: "/crm/contacts", icon: Users },
  { key: "companies", href: "/crm/companies", icon: Building2 },
  { key: "deals", href: "/crm/deals", icon: Handshake },
  { key: "activities", href: "/crm/activities", icon: ListChecks },
  { key: "assistant", href: "/crm/assistant", icon: Sparkles },
];

function useActive() {
  const pathname = usePathname();
  return (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useCrmI18n();
  const isActive = useActive();
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map(({ key, href, icon: Icon, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-gold-500/10 text-gold-300 light:text-gold-700"
                : "text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground",
            )}
          >
            <Icon
              className={cn("size-[18px] shrink-0", active ? "text-gold-400" : "")}
              strokeWidth={active ? 2.1 : 1.8}
            />
            {t.nav[key as keyof typeof t.nav]}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({
  user,
  onNavigate,
}: {
  user: PublicUser;
  onNavigate?: () => void;
}) {
  const { t } = useCrmI18n();
  const isActive = useActive();
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <Link
        href="/crm"
        onClick={onNavigate}
        className="flex items-center gap-2.5 rounded-xl px-2 py-1.5"
      >
        <DoppiMark className="h-7 w-9 shrink-0 text-gold-400" />
        <span className="min-w-0">
          <span className="block truncate font-display text-[15px] font-bold leading-tight text-foreground">
            {user.org.name}
          </span>
          <span className="block text-[11px] leading-tight text-muted-foreground">
            Do&apos;ppi CRM
          </span>
        </span>
      </Link>

      <NavLinks onNavigate={onNavigate} />

      <div className="flex flex-col gap-1">
        <Link
          href="/crm/settings"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            isActive("/crm/settings")
              ? "bg-gold-500/10 text-gold-300 light:text-gold-700"
              : "text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground",
          )}
        >
          <Settings className="size-[18px]" strokeWidth={1.8} />
          {t.nav.settings}
        </Link>
      </div>
    </div>
  );
}

function UserMenu({ user }: { user: PublicUser }) {
  const { t } = useCrmI18n();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-xl px-1.5 py-1 transition-colors hover:bg-foreground/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <InitialsAvatar name={user.name} color={user.avatarColor} className="size-8" />
        <span className="hidden text-left sm:block">
          <span className="block max-w-[10rem] truncate text-sm font-medium leading-tight text-foreground">
            {user.name}
          </span>
          <span className="block text-[11px] leading-tight text-muted-foreground">
            {t.role[user.role]}
          </span>
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate text-sm font-medium text-foreground">{user.name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <div className="px-2.5 pb-1.5">
          <StatusPill tone="gold">{t.role[user.role]}</StatusPill>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/crm/settings/profile">
            <UserIcon className="size-4" />
            {t.nav.profile}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/crm/settings">
            <Settings className="size-4" />
            {t.nav.settings}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={logoutAction}>
          <button
            type="submit"
            className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-red-400 outline-none transition-colors hover:bg-red-500/10"
          >
            <LogOut className="size-4" />
            {t.auth.signOut}
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CrmShell({
  user,
  children,
}: {
  user: PublicUser;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  // Close the mobile drawer whenever the route changes.
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-dvh">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card/40 backdrop-blur lg:flex">
        <SidebarContent user={user} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] border-r border-border bg-card shadow-card">
            <button
              className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground hover:bg-foreground/[0.06]"
              onClick={() => setMobileOpen(false)}
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
            <SidebarContent user={user} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
          <button
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-foreground/[0.06] lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <div className="flex-1" />
          <LocaleToggle />
          <ThemeToggle />
          <div className="mx-1 h-6 w-px bg-border" />
          <UserMenu user={user} />
        </header>
        <main className="mx-auto max-w-8xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
