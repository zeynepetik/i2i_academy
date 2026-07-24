"use client";

import { Briefcase } from "lucide-react";
import { Holding } from "@/lib/types";
import { formatPct, formatUsd } from "@/lib/format";

interface PortfolioViewProps {
  holdings: Holding[];
  onSell: (holding: Holding) => void;
}

export default function PortfolioView({ holdings, onSell }: PortfolioViewProps) {
  if (holdings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-panel-raised">
          <Briefcase className="h-5 w-5 text-text-muted" />
        </div>
        <p className="text-sm font-medium text-text-secondary">You don&apos;t hold any positions yet</p>
        <p className="max-w-xs text-xs text-text-muted">
          Buy an asset from the Markets tab and it will show up here with your live gain or loss.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-subtle text-left text-[11px] font-semibold tracking-[0.12em] text-text-muted">
            <th className="px-6 py-3 font-semibold">ASSET</th>
            <th className="px-4 py-3 text-right font-semibold">QUANTITY</th>
            <th className="px-4 py-3 text-right font-semibold">AVG COST</th>
            <th className="px-4 py-3 text-right font-semibold">PRICE</th>
            <th className="px-4 py-3 text-right font-semibold">VALUE / P&L</th>
            <th className="px-6 py-3 text-right font-semibold">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => {
            const value = h.quantity * h.price;
            const cost = h.quantity * h.avgCost;
            const pnl = value - cost;
            const pnlPct = cost === 0 ? 0 : (pnl / cost) * 100;
            const positive = pnl >= 0;
            return (
              <tr key={h.holdingId} className="border-b border-border-subtle/60">
                <td className="px-6 py-3.5 font-semibold">{h.symbol}</td>
                <td className="px-4 py-3.5 text-right font-mono text-text-secondary">{h.quantity}</td>
                <td className="px-4 py-3.5 text-right font-mono text-text-secondary">{formatUsd(h.avgCost)}</td>
                <td className="px-4 py-3.5 text-right font-mono text-text-secondary">{formatUsd(h.price)}</td>
                <td className="px-6 py-3.5 text-right">
                  <div className="font-mono font-semibold">{formatUsd(value)}</div>
                  <div className={`font-mono text-xs ${positive ? "text-accent" : "text-negative"}`}>
                    {positive ? "+" : ""}
                    {formatUsd(pnl)} ({formatPct(pnlPct)})
                  </div>
                </td>
                <td className="px-6 py-3.5 text-right">
                  <button
                    onClick={() => onSell(h)}
                    className="rounded-lg bg-negative/15 px-4 py-1.5 text-xs font-bold text-negative transition-colors hover:bg-negative/25"
                  >
                    SELL
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
