import { Sparkles } from "lucide-react";
import { requireUser } from "@/lib/crm/auth";
import { getT } from "@/lib/crm/i18n-server";
import { PageHeader } from "@/components/crm/page-header";
import { StatusPill } from "@/components/ui/status-pill";
import { AssistantChat } from "./assistant-chat";

export default async function AssistantPage() {
  const user = await requireUser();
  const { tr } = await getT();

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            {tr("AI yordamchi", "AI assistant")}
            <StatusPill tone="gold" className="align-middle">
              <Sparkles className="size-3" />
              Beta
            </StatusPill>
          </span>
        }
        subtitle={tr(
          "CRM ma'lumotlaringiz haqida tabiiy tilda so'rang",
          "Ask about your CRM data in plain language",
        )}
      />
      <AssistantChat userName={user.name} userColor={user.avatarColor} />
    </div>
  );
}
