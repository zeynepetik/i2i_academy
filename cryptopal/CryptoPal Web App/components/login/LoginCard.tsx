"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, ArrowRight } from "lucide-react";
import { loginUser, registerUser } from "@/lib/api";
import { useAuthStore } from "@/lib/auth_store";

type AuthMode = "sign-in" | "register";

export default function LoginCard() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (mode === "register") {
        await registerUser(username, password);
      }
      // register'da token null döndüğü için (Gün 2 kararı), her iki modda da
      // gerçek token'ı almak için login çağrısı yapıyoruz
      const response = await loginUser(username, password);
      /*DEBUG*/
       console.log("login response:", response);
      setAuth({
        token: response.token!,
        userId: response.userid,
        username: response.username,
        cashBalance: response.cashBalance,
      });
      /*DEBUG*/
      console.log("auth store userId:", useAuthStore.getState().userId);
      router.push("/terminal");
       console.log("push çağrıldı");
    } catch (err) {
      console.error("login hatası:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-soft ring-1 ring-accent/30">
          <Activity className="h-7 w-7 text-accent" strokeWidth={2.25} />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">CryptoPal</h1>
          <p className="mt-1 text-xs font-medium tracking-[0.2em] text-text-muted">
            REAL-TIME TRADING TERMINAL
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-border bg-panel shadow-2xl shadow-black/40">
        <div className="grid grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("sign-in")}
            className={`border-b-2 px-4 py-4 text-sm font-semibold tracking-wide transition-colors ${
              mode === "sign-in" ? "border-accent text-accent" : "border-border-subtle text-text-muted hover:text-text-secondary"
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`border-b-2 px-4 py-4 text-sm font-semibold tracking-wide transition-colors ${
              mode === "register" ? "border-accent text-accent" : "border-border-subtle text-text-muted hover:text-text-secondary"
            }`}
          >
            REGISTER
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-xs font-semibold tracking-[0.15em] text-text-muted">
              USERNAME
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-border bg-panel-raised px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-semibold tracking-[0.15em] text-text-muted">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-panel-raised px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          {error && <p className="text-xs font-medium text-negative">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-semibold text-[#06251c] transition-colors hover:bg-accent-strong disabled:opacity-60"
          >
            {mode === "sign-in" ? "Sign In" : "Create Account"}
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </form>
      </div>

      <p className="mt-6 text-xs text-text-muted">CryptoPal · Simulated Trading Environment</p>
    </div>
  );
}
