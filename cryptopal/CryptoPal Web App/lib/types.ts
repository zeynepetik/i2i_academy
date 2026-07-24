export interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
}

export interface Holding {
  holdingId: string;
  assetId: string;
  symbol: string;
  name: string;
  quantity: number;
  avgCost: number;
  price: number;
}

export type TransactionSide = "BUY" | "SELL";

export interface Transaction {
  id: string;
  timestamp: string;
  side: TransactionSide;
  symbol: string;
  quantity: number;
  price: number;
  total: number;
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
}

export type TerminalTab = "markets" | "portfolio" | "transactions";
