import { requireUser } from "@/lib/crm/auth";
import { getLocale } from "@/lib/crm/i18n-server";
import { LocaleProvider } from "@/lib/crm/i18n-provider";
import { CrmShell } from "@/components/crm/shell";
import { Toaster } from "@/components/ui/sonner";
import { toPublicUser } from "@/lib/crm/types";

// Auth + tenant data is per-request; never statically optimize the CRM.
export const dynamic = "force-dynamic";

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const locale = await getLocale();

  return (
    <LocaleProvider initialLocale={locale}>
      <CrmShell user={toPublicUser(user)}>{children}</CrmShell>
      <Toaster />
    </LocaleProvider>
  );
}
