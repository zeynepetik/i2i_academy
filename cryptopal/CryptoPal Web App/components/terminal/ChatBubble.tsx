import { ChatMessage } from "@/lib/types";

export default function ChatBubble({ message }: { message: ChatMessage }) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isAssistant
            ? "bg-panel-raised text-text-secondary"
            : "bg-accent text-[#06251c]"
        }`}
      >
        <p>{message.content}</p>
        <span
          className={`mt-1.5 block text-[10px] font-medium ${
            isAssistant ? "text-text-muted" : "text-[#06251c]/60"
          }`}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}
