type SwishPaymentMarkProps = {
  className?: string;
};

// Official Swish wordmark, used unchanged in accordance with Swish's brand guidance.
const swishLogoUrl = "https://www.swish.nu/assets/swish-logotype-C2_aqj3N.svg";

export default function SwishPaymentMark({ className = "" }: SwishPaymentMarkProps) {
  return (
    <span className={`inline-flex rounded-md bg-white px-2 py-1 shadow-sm ring-1 ring-black/5 ${className}`} data-payment-method="swish">
      {/* eslint-disable-next-line @next/next/no-img-element -- Swish requires its official, unmodified artwork. */}
      <img src={swishLogoUrl} alt="Swish" width={59} height={18} className="h-[18px] w-auto" />
    </span>
  );
}
