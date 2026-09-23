import Image from "next/image";

type PaywallCheckoutCTAProps = { onClick: () => void; separated?: boolean };

export default function PaywallCheckoutCTA({ onClick, separated = false }: PaywallCheckoutCTAProps) {
  return <div className="w-full">
    <button data-flow="cta"
      type="button"
      onClick={onClick}
      className={`${separated ? "mt-4 " : ""}inline-flex min-h-14 w-full items-center justify-center whitespace-nowrap rounded-[14px] border border-[#285C44] bg-[#2F6B4F] px-4 py-3 text-center text-[15px] font-bold leading-[1.2] text-white shadow-[0_3px_10px_rgba(0,0,0,0.18)] transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-[#285C44] hover:shadow-[0_5px_14px_rgba(0,0,0,0.2)] active:translate-y-px active:shadow-[0_1px_4px_rgba(0,0,0,0.15)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-[17px]`}
    >
      Lås upp mitt resultat · 39 kr
    </button>
    <p className="mt-2 text-center text-xs leading-5 text-neutral-300"><span data-flow="lock" aria-hidden="true">🔒</span> Säker betalning · Ingen prenumeration</p>
    <div className="mt-1.5 flex items-center justify-center gap-2.5" aria-label="Betalningsalternativ: Klarna, Visa och Mastercard">
      <Image src="/payment-methods/klarna.svg" alt="Klarna" width={20} height={20} />
      <Image src="/payment-methods/visa.svg" alt="Visa" width={30} height={20} />
      <Image src="/payment-methods/mastercard.svg" alt="Mastercard" width={30} height={20} />
    </div>
  </div>;
}
