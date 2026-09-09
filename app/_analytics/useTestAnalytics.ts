"use client";

import { useCallback, useEffect, useState } from "react";
import { CONSENT_EVENT } from "./analytics";
import { answerEvent, checkoutEvent, paywallEvent, purchaseEvent, restartEvents } from "./testEvents";
import type { TestId } from "./config";

export function useTestAnalytics(id: TestId, total: number) {
  const [paywall, setPaywall] = useState<HTMLElement | null>(null);
  const paywallRef = useCallback((node: HTMLElement | null) => { setPaywall(node); }, []);
  useEffect(() => {
    if (!paywall) return;
    let visible = false;
    const record = () => { if (visible && document.visibilityState === "visible") paywallEvent(id); };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting && entry.intersectionRatio > 0); record(); },{threshold:[0,0.1]});
    if (observer) observer.observe(paywall);
    else {
      const rect=paywall.getBoundingClientRect(); visible=rect.bottom>0 && rect.top<window.innerHeight; record();
    }
    document.addEventListener("visibilitychange",record);
    window.addEventListener(CONSENT_EVENT,record);
    return () => { observer?.disconnect(); document.removeEventListener("visibilitychange",record); window.removeEventListener(CONSENT_EVENT,record); };
  },[id,paywall]);
  return { paywallRef,
    answer: (answered: number, currentQuestion: number) => answerEvent(id,answered,currentQuestion,total),
    checkout: () => checkoutEvent(id), purchase: () => purchaseEvent(id), restart: () => restartEvents(id),
  };
}
