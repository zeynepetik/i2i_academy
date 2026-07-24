"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send } from "lucide-react";
import { ChatMessage } from "@/lib/types";
import { AI_SUGGESTIONS, INITIAL_AI_MESSAGE } from "@/lib/mockData";
import { aiQuery } from "@/lib/api";
import ChatBubble from "./ChatBubble";
import { generateId } from "@/lib/uuid";

interface AIAssistantProps {
  userId: string;
}

export default function AIAssistant({ userId }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_AI_MESSAGE]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const { insight } = await aiQuery(userId, trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content: insight,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content: "Sorry, I couldn't reach the AI service right now. Please try again shortly.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <aside className="flex h-full w-full flex-col border-l border-border-subtle bg-panel">
      <div className="flex items-center gap-2.5 border-b border-border-subtle px-4 py-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft">
          <Bot className="h-4 w-4 text-accent" />
        </div>
        <div>
          <div className="text-sm font-semibold">AI Assistant</div>
          <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
            Online
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} />
        ))}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-border-subtle px-4 py-3">
        {AI_SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => sendMessage(s)}
            disabled={sending}
            className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary transition-colors hover:border-accent/40 hover:text-accent disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex items-center gap-2 border-t border-border-subtle p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about markets, portfolio..."
          disabled={sending}
          className="flex-1 rounded-lg border border-border bg-panel-raised px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/60 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={sending}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-[#06251c] transition-colors hover:bg-accent-strong disabled:opacity-50"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </aside>
  );
}
