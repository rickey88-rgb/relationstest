"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent } from "../_analytics/analytics";
import { testConfig, type TestId } from "../_analytics/config";
import { hasPaidReturn } from "./usePaymentRecovery";

const storageKeys: Record<TestId, string> = {
  screening_test: "relationstest_screening_state_v2",
  psychological_abuse_test: "psykiskt_vald_test_state_v1",
  attachment_test: "anknytningstest_state_v1",
  codependency_test: "medberoendetest_state_v1",
  gaslighting_test: "gaslightingtest_state_v1",
  trauma_bond_test: "traumabindningtest_state_v1",
  narcissist_partner: "narcissist_relation_test_state_v1",
  adhd_test: "relationsvarning_adhd_state_v1",
  angest_test: "relationsvarning_angest_state_v1",
  autism_test: "relationsvarning_autism_state_v1",
  narcissism_selftest: "relationsvarning_narcissism_self_v1",
};

const copy: Partial<Record<TestId, { title: string; description: string; label: string }>> = {
  screening_test: { title: "Vill du undersöka relationen bredare?", description: "Det generella relationstestet hjälper dig att sätta flera beteendemönster i ett sammanhang. Det ger inget beslut om vad du måste göra.", label: "Gör relationstestet" },
  psychological_abuse_test: { title: "Vill du undersöka psykisk misshandel mer specifikt?", description: "Det separata testet fokuserar på återkommande kontroll, nedvärdering och andra beteenden som kan påverka tryggheten i relationen.", label: "Gör testet om psykisk misshandel" },
  attachment_test: { title: "Vill du utforska anknytningsmönster?", description: "Anknytningstestet fokuserar mer specifikt på hur närhet, avstånd och trygghet fungerar i relationer.", label: "Gör anknytningstestet" },
  gaslighting_test: { title: "Vill du undersöka gaslighting mer specifikt?", description: "Det separata gaslightingtestet hjälper dig att reflektera över återkommande ifrågasättande och tilliten till din egen upplevelse.", label: "Gör gaslightingtestet" },
  codependency_test: { title: "Vill du utforska överansvar och egna behov?", description: "Medberoendetestet undersöker hur omsorg, gränser och ansvar kan samspela i en relation.", label: "Gör medberoendetestet" },
  trauma_bond_test: { title: "Vill du undersöka växlingen i relationen?", description: "Traumabindningstestet fokuserar på starka band och på hur perioder av närhet och smärta kan hänga ihop.", label: "Gör traumabindningstestet" },
  narcissist_partner: { title: "Vill du undersöka relationsmönstren mer specifikt?", description: "Det separata testet utforskar beteenden i relationen utan att avgöra om en partner har en diagnos.", label: "Gör testet om relationsmönster" },
  angest_test: { title: "Vill du utforska oro och återhämtning?", description: "Ångesttestet är en självskattning av oro, anspänning, sömn och vardagspåverkan.", label: "Gör ångesttestet" },
};

export default function PostPurchaseRecommendation({ sourceTest, recommendedTest }: { sourceTest: TestId; recommendedTest: TestId | null }) {
  const [eligible, setEligible] = useState(false);
  const card = useRef<HTMLElement>(null);
  const sentView = useRef(false);

  useEffect(() => {
    // Browser-only entitlement check; never hide a purchased result if storage is unavailable.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronizes the optional card with local purchase state after hydration.
    setEligible(Boolean(recommendedTest && recommendedTest !== sourceTest && !hasPaidReturn(storageKeys[recommendedTest])));
  }, [recommendedTest, sourceTest]);

  useEffect(() => {
    if (!eligible || !recommendedTest || !card.current) return;
    const record = () => {
      if (sentView.current || document.visibilityState !== "visible") return;
      sentView.current = trackEvent("cross_sell_view", { source_test: sourceTest, recommended_test: recommendedTest, price: 39, currency: "SEK" });
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) record();
    });
    if (observer) observer.observe(card.current);
    else record();
    return () => observer?.disconnect();
  }, [eligible, recommendedTest, sourceTest]);

  if (!eligible || !recommendedTest || !copy[recommendedTest]) return null;
  const item = copy[recommendedTest];
  return <section data-flow="card" ref={card} aria-label="Ett möjligt nästa test" className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-neutral-900 sm:p-6">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Nästa steg</p>
    <h2 className="mt-2 text-xl font-semibold tracking-tight">{item.title}</h2>
    <p className="mt-3 max-w-2xl leading-7 text-neutral-700">{item.description}</p>
    <Link data-flow="cta" href={testConfig[recommendedTest].path} onClick={() => trackEvent("cross_sell_click", { source_test: sourceTest, recommended_test: recommendedTest, price: 39, currency: "SEK" })} className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#2F6B4F] px-5 py-3 text-center font-semibold text-white transition-colors hover:bg-[#285C44] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F6B4F] sm:w-auto">{item.label}</Link>
  </section>;
}
