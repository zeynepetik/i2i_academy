"use client";

import { History } from "lucide-react";
import { Transaction } from "@/lib/types";
import { formatUsd } from "@/lib/format";

interface TransactionsViewProps {
  transactions: Transaction[];
}

export default function TransactionsView({ transactions }: TransactionsViewProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-panel-raised">
          <History className="h-5 w-5 text-text-muted" />
        </div>
        <p className="text-sm font-medium text-text-secondary">No transactions yet</p>
        <p className="max-w-xs text-xs text-text-muted">
          Every buy and sell you make will be logged here with a timestamp.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-subtle text-left text-[11px] font-semibold tracking-[0.12em] text-text-muted">
            <th className="px-6 py-3 font-semibold">TIME</th>
            <th className="px-4 py-3 font-semibold">SIDE</th>
            <th className="px-4 py-3 font-semibold">ASSET</th>
            <th className="px-4 py-3 text-right font-semibold">QUANTITY</th>
            <th className="px-4 py-3 text-right font-semibold">PRICE</th>
            <th className="px-6 py-3 text-right font-semibold">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b border-border-subtle/60">
              <td className="px-6 py-3.5 font-mono text-xs text-text-muted">
                {t.timestamp}
              </td>
              <td className="px-4 py-3.5">
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                    t.side === "BUY"
                      ? "bg-accent-soft text-accent"
                      : "bg-negative-soft text-negative"
                  }`}
                >
                  {t.side}
                </span>
              </td>
              <td className="px-4 py-3.5 font-semibold">{t.symbol}</td>
              <td className="px-4 py-3.5 text-right font-mono text-text-secondary">
                {t.quantity}
              </td>
              <td className="px-4 py-3.5 text-right font-mono text-text-secondary">
                {formatUsd(t.price)}
              </td>
              <td className="px-6 py-3.5 text-right font-mono font-semibold">
                {formatUsd(t.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
