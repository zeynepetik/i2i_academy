const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(body.error ?? "Request failed");
  }

  // 204 No Content gibi body'siz response'lar için
  const text = await response.text();
  return text ? JSON.parse(text) : (undefined as T);
}

// ---- Auth ----

export interface UserResponse {
  userid: string;
  username: string;
  cashBalance: number;
  token: string | null;
}

export function registerUser(username: string, password: string) {
  return apiFetch<UserResponse>("/api/user/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function loginUser(username: string, password: string) {
  return apiFetch<UserResponse>("/api/user/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function getUserInfo(userId: string) {
  return apiFetch<UserResponse>(`/api/user/${userId}`);
}

// ---- Market Data ----

export interface AssetDto {
  assetId: string;
  assetName: string;
  tradableQuantity: number;
  symbol: string;
  createdAt: string;
}

export function getAssets() {
  return apiFetch<AssetDto[]>("/api/assets");
}

// VARSAYIM: backend { "BTC": 67582.01, "ETH": 3516.47 } formatında dönüyor — doğrulanması gerekiyor
export function getPrices() {
  return apiFetch<Record<string, number>>("/api/market_data/prices");
}

// ---- Trading ----

export interface HoldingDto {
  holdingId: string;
  asset: AssetDto;
  avgCost: number;
  quantity: number;
}

export interface TransactionDto {
  transactionId: string;
  asset: AssetDto;
  createdAt: string;
  transactionType: "BUY" | "SELL";
  quantity: number;
  paidPerPrice: number;
  total: number;
}

export function buyAsset(userId: string, symbol: string, quantity: number) {
  return apiFetch<TransactionDto>(`/api/trading/${userId}/buy`, {
    method: "POST",
    body: JSON.stringify({ symbol, quantity }),
  });
}

export function sellAsset(userId: string, symbol: string, quantity: number) {
  return apiFetch<TransactionDto>(`/api/trading/${userId}/sell`, {
    method: "POST",
    body: JSON.stringify({ symbol, quantity }),
  });
}

export function getPortfolio(userId: string) {
  return apiFetch<HoldingDto[]>(`/api/trading/${userId}/portfolio`);
}

export function getHistory(userId: string) {
  return apiFetch<TransactionDto[]>(`/api/trading/${userId}/history`);
}

// ---- AI Insights ----

export function aiQuery(userId: string, question: string) {
  return apiFetch<{ insight: string }>(`/api/ai_insights/${userId}/query`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}