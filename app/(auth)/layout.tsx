import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/crm/auth";
import { getLocale } from "@/lib/crm/i18n-server";
import { LocaleProvider } from "@/lib/crm/i18n-provider";
import { LocaleToggle, ThemeToggle } from "@/components/crm/toggles";

export const dynamic = "force-dynamic";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (user) redirect("/crm");

  const locale = await getLocale();

  return (
    <LocaleProvider initialLocale={locale}>
      <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-10">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-aurora opacity-70 light:opacity-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-[0.4] light:opacity-[0.6]"
        />
        <div className="absolute right-4 top-4 z-10 flex items-center gap-1">
          <LocaleToggle />
          <ThemeToggle />
        </div>
        <div className="relative z-10 w-full max-w-md">{children}</div>
      </div>
    </LocaleProvider>
  );
}
