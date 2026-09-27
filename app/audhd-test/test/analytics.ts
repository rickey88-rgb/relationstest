"use client";
import { useRef } from "react";
import { trackEvent } from "../../_analytics/analytics";

// Events intentionally contain only journey stage and teaser category, never answers or scores.
const track = (name: Parameters<typeof trackEvent>[0], teaser_type?: string) => trackEvent(name, teaser_type ? { teaser_type } : {});
export function useAudhdAnalytics() {
  const milestones = useRef(new Set<number>());
  const complete = useRef(false); const paywall = useRef(false); const purchase = useRef(false); const result = useRef(false);
  return {
    start: () => track("audhd_test_start"),
    progress: (count: number) => { if ([12, 24, 36, 48].includes(count) && !milestones.current.has(count)) { milestones.current.add(count); track("audhd_question_progress"); } },
    complete: () => { if (!complete.current) { complete.current = true; track("audhd_test_complete"); } },
    analysis: () => track("audhd_analysis_complete"),
    paywall: (type: string) => { if (!paywall.current) { paywall.current = true; track("audhd_paywall_view", type); } },
    cta: (type: string) => track("audhd_paywall_cta", type), checkout: () => track("audhd_checkout_start"),
    purchase: () => { if (!purchase.current) { purchase.current = true; track("audhd_purchase"); } },
    result: () => { if (!result.current) { result.current = true; track("audhd_result_view"); } },
  };
}
