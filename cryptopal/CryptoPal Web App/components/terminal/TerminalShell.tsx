"use client";
/*acts as middleman between different flows and connect them no pairs connected directly */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./Header";
import TabNav from "./TabNav";
import MarketsTable from "./MarketsTable";
import PortfolioView from "./PortfolioView";
import TransactionsView from "./TransactionsView";
import AIAssistant from "./AIAssistant";
import { Asset, Holding, Transaction, TerminalTab } from "@/lib/types";
import { useAuthStore } from "@/lib/auth_store";
import { getAssets, getPrices, getPortfolio, getHistory, buyAsset, getUserInfo } from "@/lib/api";
import TradeModal from "./TradeModal";
import { sellAsset } from "@/lib/api";

export default function TerminalShell() {
  const router = useRouter();
  const { userId, cashBalance, updateCashBalance, logout } = useAuthStore();
  const [tradeTarget, setTradeTarget] = useState<{ asset: Asset; side: "BUY" | "SELL"; ownedQuantity: number } | null>(null);
  const [activeTab, setActiveTab] = useState<TerminalTab>("markets");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!userId) return;
    try {
      const [assetList, prices, holdingList, historyList, userInfo] = await Promise.all([
        getAssets(),
        getPrices(),
        getPortfolio(userId),
        getHistory(userId),
        getUserInfo(userId),
      ]);

      setAssets(
        assetList.map((a) => ({
          id: a.assetId,
          symbol: a.symbol,
          name: a.assetName,
          price: prices[a.symbol] ?? 0,
        }))
      );

      setHoldings(
        holdingList.map((h) => ({
          holdingId: h.holdingId,
          assetId: h.asset.assetId,
          symbol: h.asset.symbol,
          name: h.asset.assetName,
          quantity: h.quantity,
          avgCost: h.avgCost,
          price: prices[h.asset.symbol] ?? 0,
        }))
      );

      setTransactions(
        historyList.map((t) => ({
          id: t.transactionId,
          timestamp: new Date(t.createdAt).toLocaleString([], {
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          side: t.transactionType,
          symbol: t.asset.symbol,
          quantity: t.quantity,
          price: t.paidPerPrice,
          total: t.total,
        }))
      );

      updateCashBalance(userInfo.cashBalance);
    } catch (err) {
      console.error("Failed to load terminal data", err);
    } finally {
      setLoading(false);
    }
  }, [userId, updateCashBalance]);

  useEffect(() => {
    if (!userId) {
      router.push("/");
      return;
    }
    loadData();
  }, [userId, loadData, router]);

  const portfolioValue = useMemo(
    () => holdings.reduce((sum, h) => sum + h.quantity * h.price, 0),
    [holdings]
  );

  const totalPnl = useMemo(
    () => holdings.reduce((sum, h) => sum + h.quantity * (h.price - h.avgCost), 0),
    [holdings]
  );

  function openBuyModal(asset: Asset) {
    setTradeTarget({ asset, side: "BUY", ownedQuantity: 0 });
  }

  function openSellModal(holding: Holding) {
    const asset = assets.find((a) => a.symbol === holding.symbol);
    if (!asset) return;
    setTradeTarget({ asset, side: "SELL", ownedQuantity: holding.quantity });
  }

  async function handleConfirmTrade(quantity: number) {
    if (!userId || !tradeTarget) return;
    if (tradeTarget.side === "BUY") {
      await buyAsset(userId, tradeTarget.asset.symbol, quantity);
    } else {
      await sellAsset(userId, tradeTarget.asset.symbol, quantity);
    }
    await loadData();
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (!userId || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg text-text-muted">
        Loading...
      </div>
    );
  }

  return (
    
    <div className="flex h-screen flex-col overflow-hidden bg-bg">
      <Header
        cash={cashBalance}
        portfolioValue={portfolioValue}
        totalPnl={totalPnl}
        onRefresh={loadData}
        onLogout={handleLogout}
      />

      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <TabNav active={activeTab} onChange={setActiveTab} />
          <div className="flex-1 overflow-y-auto">
            {activeTab === "markets" && <MarketsTable assets={assets} onBuy={openBuyModal} />}
            {activeTab === "portfolio" && <PortfolioView holdings={holdings} onSell={openSellModal}/>}
            {activeTab === "transactions" && <TransactionsView transactions={transactions} />}
          </div>
        </div>

        <div className="w-[360px] shrink-0">
          <AIAssistant userId={userId} />
        </div>
      </div>
      {tradeTarget && (
      <TradeModal
        asset={tradeTarget.asset}
        side={tradeTarget.side}
        availableCash={cashBalance}
        ownedQuantity={tradeTarget.ownedQuantity}
        onConfirm={handleConfirmTrade}
        onClose={() => setTradeTarget(null)}
      />
    )}
    </div>
  );
}
