"use client";

import { useEffect, useRef } from "react";
import { CONSENT_EVENT, trackEvent } from "../_analytics/analytics";

type BookPurchaseAnalyticsProps = {
  productId: string;
  productName: string;
  price: number;
  offerType: "standard" | "analysis";
  paymentLink: string;
  className: string;
  children: string;
};

export function BookLandingAnalytics({ productId, productName, price, offerType, waitForConsent = false }:
  Omit<BookPurchaseAnalyticsProps, "paymentLink" | "className" | "children"> & { waitForConsent?: boolean }) {
  const tracked = useRef(false);

  useEffect(() => {
    function trackView() {
      if (tracked.current) return;
      const sent = trackEvent("book_landing_view", {
        product_id: productId,
        product_name: productName,
        price,
        currency: "SEK",
        offer_type: offerType,
      });
      if (sent || !waitForConsent) tracked.current = true;
    }
    trackView();
    if (waitForConsent && !tracked.current) {
      window.addEventListener(CONSENT_EVENT, trackView);
      return () => window.removeEventListener(CONSENT_EVENT, trackView);
    }
  }, [offerType, price, productId, productName, waitForConsent]);

  return null;
}

export default function BookPurchaseAnalytics({ productId, productName, price, offerType, paymentLink, className, children }: BookPurchaseAnalyticsProps) {
  return <a
    data-rv="button"
    href={paymentLink}
    className={className}
    onClick={() => trackEvent("book_checkout_click", {
      product_id: productId,
      product_name: productName,
      price,
      currency: "SEK",
      offer_type: offerType,
    })}
  >{children}</a>;
}
