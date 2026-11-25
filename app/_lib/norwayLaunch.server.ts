import { norwegian } from "../_content/market";

const productionOrigin = "https://www.relationsvarning.se";

export function norwayIndexable() {
  return process.env.NORWAY_INDEXABLE === "true" && process.env.VERCEL_ENV !== "preview";
}

export function norwayStripeEnvironment() {
  const mode = process.env.NORWAY_CHECKOUT_MODE;
  if (mode === "live" && process.env.VERCEL_ENV !== "preview") {
    const key = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
    if (/^(sk|rk)_live_/.test(key)) return { key, live: true, origin: productionOrigin };
  }
  if (mode === "test" && process.env.VERCEL_ENV !== "production") {
    const key = process.env.NORWAY_STRIPE_TEST_KEY?.trim() ?? "";
    const origin = new URL(process.env.NORWAY_TEST_ORIGIN ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"));
    if (/^(sk|rk)_test_/.test(key) && (origin.hostname === "localhost" || origin.hostname.endsWith(".vercel.app"))) {
      return { key, live: false, origin: origin.origin };
    }
  }
  throw new Error("Norwegian checkout is unavailable");
}


export function norwayCheckoutOrigin() {
  try { return norwayStripeEnvironment().origin; }
  catch { return productionOrigin; }
}

export function norwegianReportStripe() {
  const configured = norwayStripeEnvironment();
  const priceId = process.env.NORWAY_REPORT_PRICE_ID?.trim() ?? "";
  const productId = process.env.NORWAY_REPORT_PRODUCT_ID?.trim() ?? "";
  if (!/^price_[A-Za-z0-9]+$/.test(priceId)) throw new Error("Norwegian report price is unavailable");
  if (!/^prod_[A-Za-z0-9]+$/.test(productId)) throw new Error("Norwegian report product is unavailable");
  return { ...configured, productId, priceId, currency: "nok", amount: norwegian.reportPrice * 100 } as const;
}

export function norwegianReportForSale() {
  if (process.env.NORWAY_REPORT_CHECKOUT_ENABLED !== "true") return false;
  try {
    const { live } = norwegianReportStripe();
    const taxMode = process.env.NORWAY_REPORT_TAX_MODE;
    return !live || (taxMode === "below-threshold" || taxMode === "stripe-tax");
  } catch { return false; }
}
