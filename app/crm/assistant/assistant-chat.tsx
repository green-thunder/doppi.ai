"use client";

import * as React from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { InitialsAvatar } from "@/components/ui/avatar";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

export function AssistantChat({ userName, userColor }: { userName: string; userColor: string }) {
  const { tr } = useCrmI18n();
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const suggestions = [
    tr("Voronka qiymati qancha?", "What's my total pipeline value?"),
    tr("Bu oy nechta bitim yutildi?", "How many deals were won this month?"),
    tr("Eng katta ochiq bitimlar", "Show my biggest open deals"),
    tr("Yaqin vazifalarim qanday?", "What tasks are coming up?"),
  ];

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/crm/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            typeof data.answer === "string"
              ? data.answer
              : tr("Xatolik yuz berdi.", "Something went wrong."),
        },
      ]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: tr("Xatolik yuz berdi.", "Something went wrong.") },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex h-[calc(100dvh-11rem)] min-h-[28rem] flex-col overflow-hidden">
      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-gold-500/10 text-gold-400">
              <Sparkles className="size-7" />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">
                {tr("CRM'ingizdan so'rang", "Ask your CRM")}
              </h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {tr(
                  "Tabiiy tilda savol bering — men ma'lumotlaringizni o'qib javob beraman.",
                  "Ask a question in plain language — I'll read your data and answer.",
                )}
              </p>
            </div>
            <div className="grid w-full max-w-md gap-2 sm:grid-cols-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-xl border border-border bg-foreground/[0.02] px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:border-gold-500/40 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={cn("flex items-start gap-3", m.role === "user" && "flex-row-reverse")}
            >
              {m.role === "assistant" ? (
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gold-500/10 text-gold-400">
                  <Sparkles className="size-4" />
                </span>
              ) : (
                <InitialsAvatar name={userName} color={userColor} className="size-8 shrink-0" />
              )}
              <div
                className={cn(
                  "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-gold-500/15 text-foreground"
                    : "border border-border bg-card text-foreground",
                )}
              >
                {m.content}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-center gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gold-500/10 text-gold-400">
              <Sparkles className="size-4" />
            </span>
            <div className="rounded-2xl border border-border bg-card px-4 py-2.5">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-end gap-2 border-t border-border p-3 sm:p-4"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={1}
          placeholder={tr("Savolingizni yozing...", "Type your question...")}
          className="max-h-32 flex-1 resize-none rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-gold-500/60 focus-visible:ring-2 focus-visible:ring-gold-500/20"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-gradient text-[#0A0A0B] shadow-gold-sm transition-all hover:brightness-105 disabled:opacity-40"
          aria-label={tr("Yuborish", "Send")}
        >
          <Send className="size-4" />
        </button>
      </form>
    </Card>
  );
}
