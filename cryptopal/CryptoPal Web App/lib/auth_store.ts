import { create } from "zustand";

interface AuthState {
  token: string | null;
  userId: string | null;
  username: string | null;
  cashBalance: number;
  setAuth: (data: { token: string; userId: string; username: string; cashBalance: number }) => void;
  updateCashBalance: (cashBalance: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userId: null,
  username: null,
  cashBalance: 0,

  setAuth: ({ token, userId, username, cashBalance }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    set({ token, userId, username, cashBalance });
  },

  updateCashBalance: (cashBalance) => set({ cashBalance }),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    set({ token: null, userId: null, username: null, cashBalance: 0 });
  },
}));

// Uygulama açılışında localStorage'dan token'ı geri yükle
export function hydrateAuthFromStorage() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  if (token && userId) {
    useAuthStore.setState({ token, userId });
  }
}