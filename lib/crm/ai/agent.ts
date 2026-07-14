import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { CRM_TOOLS, runTool } from "./tools";

// Default to Claude Opus 4.8 (most capable). Override with CRM_AI_MODEL if you
// want a cheaper/faster tier (e.g. claude-haiku-4-5, claude-sonnet-5).
const MODEL = process.env.CRM_AI_MODEL || "claude-opus-4-8";
const MAX_ITERATIONS = 6;

export function isAiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export type ChatTurn = { role: "user" | "assistant"; content: string };

function systemPrompt(opts: {
  orgName: string;
  currency: string;
  locale: "uz" | "en";
  today: string;
}): string {
  return [
    `You are the Do'ppi CRM assistant for the organization "${opts.orgName}".`,
    `Today's date is ${opts.today}. The organization's default currency is ${opts.currency}.`,
    ``,
    `Your job is to answer questions about THIS organization's CRM data — contacts, companies, deals (pipeline), and activities/tasks.`,
    `Always use the provided tools to fetch real data. NEVER invent numbers, names, or records. If a tool returns nothing, say you found no matching records.`,
    `Reason over tool results yourself when a question needs aggregation the tools don't directly answer (e.g. "which owner has the most open pipeline").`,
    ``,
    `Answer in the SAME language the user writes in (Uzbek or English). The user's interface language is ${opts.locale === "en" ? "English" : "Uzbek"}, but always match their actual message.`,
    `Format money with space-separated thousands and the currency code (e.g. "12 000 000 UZS"). Be concise and direct; use short bullet lists for multiple items. Do not describe which tools you used.`,
    `If asked something unrelated to this CRM, politely say you can only help with the CRM data.`,
  ].join("\n");
}

const FALLBACK = {
  uz: "Kechirasiz, hozir javob bera olmadim. Boshqacha so'rab ko'ring.",
  en: "Sorry, I couldn't answer that. Please try rephrasing.",
};

export async function askCrm(opts: {
  orgId: string;
  orgName: string;
  currency: string;
  locale: "uz" | "en";
  today: string;
  history: ChatTurn[];
}): Promise<{ answer: string }> {
  if (!isAiConfigured()) {
    throw new Error("ANTHROPIC_API_KEY_NOT_SET");
  }

  const client = new Anthropic();
  const fallback = FALLBACK[opts.locale];

  const messages: Anthropic.MessageParam[] = opts.history
    .filter((t) => t.content.trim())
    .map((t) => ({ role: t.role, content: t.content }));

  if (messages.length === 0) return { answer: fallback };

  const system = systemPrompt(opts);

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium" },
      system,
      tools: CRM_TOOLS,
      messages,
    });

    if (res.stop_reason === "refusal") return { answer: fallback };

    const toolUses = res.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
    );

    // No tool calls -> this is the final answer.
    if (res.stop_reason !== "tool_use" || toolUses.length === 0) {
      const text = res.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();
      return { answer: text || fallback };
    }

    // Preserve the assistant turn (incl. thinking + tool_use blocks) then answer tools.
    messages.push({ role: "assistant", content: res.content });

    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const tu of toolUses) {
      let output: unknown;
      try {
        output = await runTool(opts.orgId, tu.name, (tu.input as Record<string, unknown>) ?? {});
      } catch {
        output = { error: "tool_failed" };
      }
      results.push({
        type: "tool_result",
        tool_use_id: tu.id,
        content: JSON.stringify(output),
      });
    }
    messages.push({ role: "user", content: results });
  }

  return { answer: fallback };
}
