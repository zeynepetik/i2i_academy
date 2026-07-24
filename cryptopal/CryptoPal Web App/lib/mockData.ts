import {ChatMessage } from "./types";

export const INITIAL_AI_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I'm your CryptoPal AI assistant. I can answer questions about your account balance, portfolio positions, recent transactions, and market trends. What would you like to know?",
  timestamp: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
};

export const AI_SUGGESTIONS = ["What's my balance?", "Top performers", "My portfolio"];
