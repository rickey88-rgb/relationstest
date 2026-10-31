"use client";
import Image from "next/image";
import { useRef, type ReactNode } from "react";
import SwishPaymentMark from "./SwishPaymentMark";

type PaywallCheckoutCTAProps = { onClick: () => void; separated?: boolean; label?: ReactNode; belowCta?: ReactNode; trustText?: ReactNode; trustClassName?: string };

export default function PaywallCheckoutCTA({ onClick, separated = false, label = "Lås upp mitt resultat · 39 kr", belowCta, trustText = "Säker betalning · Ingen prenumeration", trustClassName = "text-xs leading-5" }: PaywallCheckoutCTAProps) {
  const consent = useRef<HTMLInputElement>(null);
  return <form className="w-full" onSubmit={event => {
    event.preventDefault();
    if (!consent.current?.checked) { consent.current?.reportValidity(); return; }
    onClick();
  }}>
    <div data-checkout-consent className="mb-3 text-left text-sm leading-6 text-inherit">
      <label className="flex min-h-11 cursor-pointer items-start gap-3 py-1">
        <input ref={consent} type="checkbox" name="guest-processing-consent" required className="mt-1 size-5 shrink-0 accent-[#27666A]" />
        <span>Jag samtycker till att mina testsvar, inklusive eventuella hälsouppgifter, behandlas för att skapa och leverera min analys.</span>
      </label>
      <p className="mt-1 text-xs leading-5"><a href="/integritet" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Läs fullständig integritetsinformation</a>.</p>
    </div>
    <button data-flow="cta"
      type="submit"
      className={`${separated ? "mt-4 " : ""}inline-flex min-h-14 w-full items-center justify-center whitespace-nowrap rounded-[14px] border border-[#1F5357] bg-[#27666A] px-4 py-3 text-center text-[15px] font-bold leading-[1.2] text-white shadow-[0_3px_10px_rgba(0,0,0,0.18)] transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-[#1F5357] hover:shadow-[0_5px_14px_rgba(0,0,0,0.2)] active:translate-y-px active:shadow-[0_1px_4px_rgba(0,0,0,0.15)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-[17px]`}
    >
      {label}
    </button>
    <p data-paywall-return-notice className="mt-2 flex items-start justify-center gap-2 text-center text-xs leading-5 text-neutral-300">
      <span aria-hidden="true" className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-current text-[10px] font-bold leading-none">i</span>
      <span>Stanna kvar efter betalningen. Det kan ta några sekunder innan du skickas vidare till din analys.</span>
    </p>
    {belowCta}
    <p className={`mt-2 text-center text-neutral-300 ${trustClassName}`}><span data-flow="lock" aria-hidden="true">🔒</span> {trustText}</p>
    <div className="mt-1.5 flex items-center justify-center gap-2.5" aria-label="Betalningsalternativ: Swish, Klarna, Visa och Mastercard">
      <SwishPaymentMark />
      <Image src="/payment-methods/klarna.svg" alt="Klarna" width={20} height={20} />
      <Image src="/payment-methods/visa.svg" alt="Visa" width={30} height={20} />
      <Image src="/payment-methods/mastercard.svg" alt="Mastercard" width={30} height={20} />
    </div>
  </form>;
}
