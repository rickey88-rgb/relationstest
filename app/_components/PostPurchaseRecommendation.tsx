"use client";

import Image from "next/image";
import Link from "next/link";
import { bookPaymentProduct, openMeasuredPaymentLink } from "../_analytics/checkoutMeasurement.client";
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

  return <section aria-label="Möjliga nästa steg" className="mt-10 text-neutral-900 print:hidden">
    <h2 className="text-2xl font-semibold tracking-tight">Fortsätt i din egen takt</h2>
    <p className="mt-2 text-sm leading-6 text-neutral-600">{productCatalog[sourceProduct].type === "test" ? "Din analys är klar." : "Din bok är redo att laddas ner."} Här finns fler sätt att fördjupa dig om du vill.</p>
    <div className={`mt-5 grid gap-5 ${offers.length > 1 ? "md:grid-cols-2" : ""}`}>
      {offers.map((offer) => <article key={offer.productId} ref={(node) => { if (node) cardNodes.current.set(offer.productId, node); else cardNodes.current.delete(offer.productId); }} className="flex min-w-0 flex-col rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#27666A]">{offer.product.type === "test" ? "Rekommenderat nästa test" : "Fördjupa dig med en bok"}</p>
        {offer.product.image && <Image src={offer.product.image.src} alt={offer.product.image.alt} width={offer.product.image.width} height={offer.product.image.height} sizes="160px" className="mx-auto mt-4 h-32 w-40 object-contain" />}
        <h3 className="mt-4 text-xl font-semibold tracking-tight">{offer.title}</h3>
        <p className="mt-3 leading-7 text-neutral-700">{offer.description}</p>
        <div className="mt-auto pt-5">
          <p className="text-sm text-neutral-600">{offer.product.type === "test" ? "Fullständig analys" : "Digital bok (PDF)"}</p>
          <p className="mt-1 text-xl font-semibold">{offer.product.ordinaryPrice && <span className="mr-2 text-sm font-normal text-neutral-500 line-through">{offer.product.ordinaryPrice} kr</span>}{offer.product.price} kr</p>
          <Link data-flow="cta" href={offer.product.purchasePath ?? destination(offer)} onClick={event => {
            const params = productEventParams(sourceProduct, offer);
            trackEvent("cross_sell_click", params);
            if (offer.product.purchasePath) openMeasuredPaymentLink(event, offer.product.purchasePath, bookPaymentProduct(offer.productId), params);
          }} className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#27666A] px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-[#1F5357] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#27666A]">{offer.product.type === "book" ? "Köp boken" : offer.label}</Link>
          {offer.product.type === "book" && <Link href={destination(offer)} className="mt-3 inline-flex min-h-11 items-center text-sm text-[#27666A] underline underline-offset-4">Läs mer om boken</Link>}
        </div>
      </article>)}
    </div>
  </section>;
}
