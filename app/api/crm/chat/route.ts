import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/crm/auth";
import { getLocale } from "@/lib/crm/i18n-server";
import { askCrm, isAiConfigured, type ChatTurn } from "@/lib/crm/ai/agent";

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(4000),
      }),
    )
    .min(1)
    .max(24),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const locale = await getLocale();

  if (!isAiConfigured()) {
    return NextResponse.json({
      answer:
        locale === "en"
          ? "The AI assistant isn't configured yet. Set the ANTHROPIC_API_KEY environment variable to enable it."
          : "AI yordamchi hali sozlanmagan. Uni yoqish uchun ANTHROPIC_API_KEY muhit o'zgaruvchisini o'rnating.",
      configured: false,
    });
  }

  let parsed: z.infer<typeof bodySchema>;
  try {
    parsed = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Keep only the most recent turns to bound token usage.
  const history: ChatTurn[] = parsed.messages.slice(-12);

  try {
    const { answer } = await askCrm({
      orgId: user.orgId,
      orgName: user.org.name,
      currency: user.org.currency,
      locale,
      today: new Date().toISOString().slice(0, 10),
      history,
    });
    return NextResponse.json({ answer, configured: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "error";
    console.error("[crm/chat]", message);
    return NextResponse.json(
      {
        answer:
          locale === "en"
            ? "Something went wrong reaching the AI. Please try again."
            : "AI bilan bog'lanishda xatolik. Qayta urinib ko'ring.",
        configured: true,
      },
      { status: 200 },
    );
  }
}
