"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Market } from "../_content/market";

const MarketContext = createContext<Market>("sv");

export function MarketProvider({ market, children }: { market: Market; children: ReactNode }) {
  return <MarketContext.Provider value={market}>{children}</MarketContext.Provider>;
}

export function useMarket() {
  return useContext(MarketContext);
}
