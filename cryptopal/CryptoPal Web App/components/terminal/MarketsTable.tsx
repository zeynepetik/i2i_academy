"use client";

import { Asset } from "@/lib/types";
import {formatUsd } from "@/lib/format";

interface MarketsTableProps {
  assets: Asset[];
  onBuy: (asset: Asset) => void;
}

const TICKER_STYLES: Record<string, string> = {
  BTC: "bg-amber/15 text-amber",
  ETH: "bg-purple/15 text-purple",
  SOL: "bg-accent-soft text-accent",
  BNB: "bg-amber/15 text-amber",
  XRP: "bg-panel-raised text-text-secondary",
  ADA: "bg-purple/15 text-purple",
  AVAX: "bg-negative-soft text-negative",
  DOT: "bg-purple/15 text-purple",
};

export default function MarketsTable({ assets, onBuy }: MarketsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-subtle text-left text-[11px] font-semibold tracking-[0.12em] text-text-muted">
            <th className="px-6 py-3 font-semibold">ASSET</th>
            <th className="px-4 py-3 text-right font-semibold">PRICE</th>
            <th className="px-6 py-3 text-right font-semibold">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id} className="border-b border-border-subtle/60 transition-colors hover:bg-panel-raised/50">
              <td className="px-6 py-3.5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold ${TICKER_STYLES[asset.symbol] ?? "bg-panel-raised text-text-secondary"}`}>
                    {asset.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">{asset.symbol}</div>
                    <div className="text-xs text-text-muted">{asset.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 text-right font-mono font-semibold text-text-primary">
                {formatUsd(asset.price, {
                  minimumFractionDigits: asset.price < 1 ? 4 : 2,
                  maximumFractionDigits: asset.price < 1 ? 4 : 2,
                })}
              </td>
              <td className="px-6 py-3.5 text-right">
                <button onClick={() => onBuy(asset)} className="rounded-lg bg-accent px-4 py-1.5 text-xs font-bold text-[#06251c] transition-colors hover:bg-accent-strong">
                  BUY
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
