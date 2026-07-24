"use client";

import { BarChart3, Briefcase, History } from "lucide-react";
import { TerminalTab } from "@/lib/types";

interface TabNavProps {
  active: TerminalTab;
  onChange: (tab: TerminalTab) => void;
}

const TABS: { id: TerminalTab; label: string; icon: typeof BarChart3 }[] = [
  { id: "markets", label: "Markets", icon: BarChart3 },
  { id: "portfolio", label: "Portfolio", icon: Briefcase },
  { id: "transactions", label: "Transactions", icon: History },
];

export default function TabNav({ active, onChange }: TabNavProps) {
  return (
    <nav className="flex items-center gap-1 border-b border-border-subtle px-6">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "border-accent text-accent"
                : "border-transparent text-text-muted hover:text-text-secondary"
            }`}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
