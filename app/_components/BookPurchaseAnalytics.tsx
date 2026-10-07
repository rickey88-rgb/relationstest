"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "../_analytics/analytics";

type BookPurchaseAnalyticsProps = {
  productId: string;
  productName: string;
  price: number;
  offerType: "standard" | "analysis";
  paymentLink: string;
  className: string;
  children: string;
};

export function BookLandingAnalytics({ productId, productName, price, offerType }: Omit<BookPurchaseAnalyticsProps, "paymentLink" | "className" | "children">) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackEvent("book_landing_view", {
      product_id: productId,
      product_name: productName,
      price,
      currency: "SEK",
      offer_type: offerType,
    });
  }, [offerType, price, productId, productName]);

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
