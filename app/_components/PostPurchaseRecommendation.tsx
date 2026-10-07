"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "../_analytics/analytics";
import type { TestId } from "../_analytics/config";
import { hasPaidReturn } from "./usePaymentRecovery";
import { productCatalog, resolveCrossSellOffers, type ProductId, type ResolvedOffer } from "./crossSellConfig";

const storageKeys: Record<TestId, string> = {
  iq_test: "relationsvarning_iq_state_v1", audhd_test: "relationsvarning_audhd_state_v1", hsp_test: "relationsvarning_hsp_state_v1", ptsd_test: "relationsvarning_ptsd_state_v1", screening_test: "relationstest_screening_state_v2", psychological_abuse_test: "psykiskt_vald_test_state_v1", attachment_test: "anknytningstest_state_v1", codependency_test: "medberoendetest_state_v1", gaslighting_test: "gaslightingtest_state_v1", trauma_bond_test: "traumabindningtest_state_v1", narcissist_partner: "narcissist_relation_test_state_v1", adhd_test: "relationsvarning_adhd_state_v1", angest_test: "relationsvarning_angest_state_v1", autism_test: "relationsvarning_autism_state_v1", narcissism_selftest: "relationsvarning_narcissism_self_v1",
};

type Props = {
  sourceProduct?: ProductId;
  preferredProductIds?: readonly ProductId[];
  activeProductIds?: readonly ProductId[];
  // Compatibility for an older result-page call site. The central catalogue
  // still owns the recommendation and fallback logic.
  sourceTest?: TestId;
  recommendedTest?: TestId;
  fallbackTests?: readonly TestId[];
};

function productEventParams(sourceProduct: ProductId, offer: ResolvedOffer) {
  const source = productCatalog[sourceProduct];
  return {
    source_product: source.analyticsId,
    source_product_type: source.type,
    recommended_product: offer.product.analyticsId,
    recommended_product_type: offer.product.type,
    offer_position: offer.displayPosition,
    price: offer.product.price,
    currency: offer.product.currency,
    // Kept for continuity with the existing GA4 exploration setup.
    source_test: source.type === "test" ? sourceProduct : undefined,
    recommended_test: offer.product.type === "test" ? offer.product.id : undefined,
  };
}

export default function PostPurchaseRecommendation({ sourceProduct: sourceProductProp, sourceTest, preferredProductIds: preferredProductIdsProp, activeProductIds }: Props) {
  const sourceProduct = sourceProductProp ?? sourceTest;
  const preferredProductIds = preferredProductIdsProp;
  const [offers, setOffers] = useState<ResolvedOffer[]>([]);
  const cardNodes = useRef(new Map<ProductId, HTMLElement>());
  const sentViews = useRef(new Set<ProductId>());
  const preferredSignature = preferredProductIds?.join("|") ?? "";
  const activeSignature = activeProductIds?.join("|") ?? "";
  const offersSignature = offers.map((offer) => `${offer.productId}:${offer.displayPosition}`).join("|");

  useEffect(() => {
    if (!sourceProduct) return;
    sentViews.current.clear();
    const next = resolveCrossSellOffers(sourceProduct, {
      preferredProductIds,
      activeProductIds,
      hasTestAccess: (testId) => hasPaidReturn(storageKeys[testId]),
    });
    setOffers(next);
    // The signatures make the optional arrays safe dependencies without changing their API.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSignature, preferredSignature, sourceProduct]);

  useEffect(() => {
    if (!sourceProduct) return;
    if (!offers.length) return;
    const record = (offer: ResolvedOffer) => {
      if (sentViews.current.has(offer.productId) || document.visibilityState !== "visible") return;
      if (trackEvent("cross_sell_view", productEventParams(sourceProduct, offer))) sentViews.current.add(offer.productId);
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const offer = offers.find((item) => cardNodes.current.get(item.productId) === entry.target);
        if (offer) record(offer);
      }
    });
    for (const offer of offers) {
      const node = cardNodes.current.get(offer.productId);
      if (observer && node) observer.observe(node);
      else if (!observer && node) record(offer);
    }
    return () => observer?.disconnect();
  }, [offers, offersSignature, sourceProduct]);

  const destination = useMemo(() => (offer: ResolvedOffer) => offer.path ?? offer.product.path ?? "", []);
  if (!sourceProduct || !offers.length) return null;

  const [primary, secondary] = offers;
  return <section aria-label="Möjliga nästa steg" className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-neutral-900 sm:p-6">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Nästa steg</p>
    <article ref={(node) => { if (node) cardNodes.current.set(primary.productId, node); else cardNodes.current.delete(primary.productId); }} className="mt-3">
      {primary.product.type === "book" && productCatalog[sourceProduct].type === "test" && <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#27666A]">Exklusivt för dig som gjort testet</p>}
      <div className={primary.product.image ? "mt-3 grid gap-5 sm:grid-cols-[minmax(0,1fr)_150px] sm:items-center" : ""}>
        <div className={primary.product.image ? "order-2 sm:order-1" : ""}>
          <h2 className="text-xl font-semibold tracking-tight">{primary.title}</h2>
          <p className="mt-3 max-w-2xl leading-7 text-neutral-700">{primary.description}</p>
          {primary.product.ordinaryPrice && <p className="mt-4 text-sm text-neutral-600"><span className="line-through">{primary.product.ordinaryPrice} kr</span> · <strong className="text-neutral-900">{primary.product.price} kr</strong></p>}
          <Link data-flow="cta" href={destination(primary)} onClick={() => trackEvent("cross_sell_click", productEventParams(sourceProduct, primary))} className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#27666A] px-5 py-3 text-center font-semibold text-white transition-colors hover:bg-[#1F5357] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#27666A] sm:w-auto">{primary.label}</Link>
          {primary.product.type === "book" && <p className="mt-3 text-sm text-neutral-600">Digital bok · Direkt tillgång efter betalning</p>}
        </div>
        {primary.product.image && <Image src={primary.product.image.src} alt={primary.product.image.alt} width={primary.product.image.width} height={primary.product.image.height} sizes="(max-width: 640px) 180px, 150px" className="order-1 mx-auto h-auto w-40 sm:order-2 sm:w-[150px]" />}
      </div>
    </article>
    {secondary && <article ref={(node) => { if (node) cardNodes.current.set(secondary.productId, node); else cardNodes.current.delete(secondary.productId); }} className="mt-6 border-t border-neutral-200 pt-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Utforska vidare</p>
      <h3 className="mt-2 text-lg font-semibold tracking-tight">{secondary.title}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-700">{secondary.description}</p>
      <Link data-flow="cta" href={destination(secondary)} onClick={() => trackEvent("cross_sell_click", productEventParams(sourceProduct, secondary))} className="mt-4 inline-flex min-h-11 items-center font-semibold text-[#27666A] underline decoration-[#27666A]/40 underline-offset-4 transition-colors hover:text-[#1F5357] hover:decoration-[#1F5357] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#27666A]">{secondary.label}</Link>
    </article>}
  </section>;
}
