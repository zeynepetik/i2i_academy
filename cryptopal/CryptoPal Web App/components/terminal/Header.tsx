"use client";

import { useEffect, useState } from "react";
import { Activity, LogOut, RefreshCw } from "lucide-react";
import { formatUsd } from "@/lib/format";

interface HeaderProps {
  cash: number;
  portfolioValue: number;
  totalPnl: number;
  onRefresh: () => void;
  onLogout: () => void;
}

export default function Header({
  cash,
  portfolioValue,
  totalPnl,
  onRefresh,
  onLogout,
}: HeaderProps) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString([], { hour12: false }));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const pnlPositive = totalPnl >= 0;

  return (
    <header className="flex items-center justify-between border-b border-border-subtle bg-panel px-6 py-3.5">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft ring-1 ring-accent/30">
          <Activity className="h-4.5 w-4.5 text-accent" strokeWidth={2.25} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-semibold tracking-tight">CryptoPal</span>
          <span className="text-[10px] font-semibold tracking-[0.2em] text-text-muted">
            TERMINAL
          </span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <Stat label="CASH" value={formatUsd(cash)} />
        <Stat label="PORTFOLIO" value={formatUsd(portfolioValue)} />
        <Stat
          label="TOTAL P&L"
          value={`${pnlPositive ? "+" : ""}${formatUsd(totalPnl)}`}
          tone={pnlPositive ? "positive" : "negative"}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
        <span className="font-mono text-sm text-text-muted">{time}</span>
        <button
          onClick={onLogout}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-panel-raised hover:text-text-primary"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  const toneClass =
    tone === "positive"
      ? "text-accent"
      : tone === "negative"
      ? "text-negative"
      : "text-text-primary";

  return (
    <div className="flex flex-col items-end">
      <span className="text-[10px] font-semibold tracking-[0.15em] text-text-muted">
        {label}
      </span>
      <span className={`font-mono text-sm font-semibold ${toneClass}`}>{value}</span>
    </div>
  );
}
