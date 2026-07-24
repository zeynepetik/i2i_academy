"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Asset } from "@/lib/types";
import { formatUsd } from "@/lib/format";

interface TradeModalProps {
  asset: Asset;
  side: "BUY" | "SELL";
  availableCash: number;
  ownedQuantity: number;
  onConfirm: (quantity: number) => Promise<void>;
  onClose: () => void;
}

export default function TradeModal({
  asset,
  side,
  availableCash,
  ownedQuantity,
  onConfirm,
  onClose,
}: TradeModalProps) {
  const [quantity, setQuantity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedQuantity = Number(quantity);
  const isValidNumber = quantity.trim() !== "" && !Number.isNaN(parsedQuantity) && parsedQuantity > 0;
  const total = isValidNumber ? parsedQuantity * asset.price : 0;

  const exceedsCash = side === "BUY" && isValidNumber && total > availableCash;
  const exceedsHoldings = side === "SELL" && isValidNumber && parsedQuantity > ownedQuantity;
  const canSubmit = isValidNumber && !exceedsCash && !exceedsHoldings && !submitting;

  async function handleConfirm() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(parsedQuantity);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Trade failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-panel shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <h2 className="text-sm font-semibold">
            {side === "BUY" ? "Buy" : "Sell"} {asset.symbol}
          </h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-panel-raised hover:text-text-primary"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Current price</span>
            <span className="font-mono text-text-secondary">{formatUsd(asset.price)}</span>
          </div>

          {side === "BUY" ? (
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>Available cash</span>
              <span className="font-mono text-text-secondary">{formatUsd(availableCash)}</span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>You own</span>
              <span className="font-mono text-text-secondary">{ownedQuantity} {asset.symbol}</span>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="quantity" className="text-xs font-semibold tracking-[0.15em] text-text-muted">
              QUANTITY
            </label>
            <input
              id="quantity"
              type="number"
              step="any"
              min="0"
              placeholder="0.00"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              autoFocus
              className="w-full rounded-lg border border-border bg-panel-raised px-3.5 py-2.5 font-mono text-sm text-text-primary placeholder:text-text-muted/60 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-panel-raised px-3.5 py-3 text-sm">
            <span className="text-text-muted">Estimated total</span>
            <span className="font-mono font-semibold text-text-primary">{formatUsd(total)}</span>
          </div>

          {exceedsCash && (
            <p className="text-xs font-medium text-negative">Insufficient cash balance.</p>
          )}
          {exceedsHoldings && (
            <p className="text-xs font-medium text-negative">You don&apos;t own that much {asset.symbol}.</p>
          )}
          {error && <p className="text-xs font-medium text-negative">{error}</p>}

          <button
            onClick={handleConfirm}
            disabled={!canSubmit}
            className={`w-full rounded-lg py-3 text-sm font-semibold transition-colors disabled:opacity-50 ${
              side === "BUY"
                ? "bg-accent text-[#06251c] hover:bg-accent-strong"
                : "bg-negative text-white hover:opacity-90"
            }`}
          >
            {submitting ? "Processing..." : `Confirm ${side === "BUY" ? "Buy" : "Sell"}`}
          </button>
        </div>
      </div>
    </div>
  );
}