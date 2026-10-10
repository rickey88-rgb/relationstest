"use client";

import { useEffect, useState } from "react";
import BookPurchaseAnalytics from "../_components/BookPurchaseAnalytics";

type Props = {
  paymentLink: string;
  price: number;
  offerType: "standard" | "analysis";
};

export default function AudhdBookStickyCta({ paymentLink, price, offerType }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("audhd-book-hero");
    if (!hero) return;

    const observer = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting), { threshold: 0.08 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-[#D6E1DD] bg-[#FFFEFC]/95 px-3 py-3 shadow-[0_-8px_28px_rgba(32,33,36,.12)] backdrop-blur md:hidden ${show ? "translate-y-0" : "pointer-events-none translate-y-full"}`}
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        <p className="min-w-0 text-sm font-semibold text-neutral-950"><span className="block text-xs font-medium text-neutral-600">Digital PDF</span>{price} kr</p>
        <BookPurchaseAnalytics productId="audhd-bok" productName="Världens bästa bok om AuDHD" price={price} offerType={offerType} paymentLink={paymentLink} className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-[#27666A] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#1F5357] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#27666A]">
          Köp boken
        </BookPurchaseAnalytics>
      </div>
    </div>
  );
}
