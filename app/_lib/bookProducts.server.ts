import Stripe from "stripe";

export const AUDHD_BOOK = {
  id: "audhd-bok",
  name: "Världens bästa bok om AuDHD",
  author: "Elias Voss",
  downloadFilename: "Varldens-basta-bok-om-AuDHD_Elias-Voss.pdf",
} as const;

export const AUTISM_BOOK = {
  id: "autism-bok",
  name: "På mitt sätt",
  author: "Elias Voss",
  downloadFilename: "Pa-mitt-satt_Elias-Voss.pdf",
} as const;

export const ADHD_DELUXE_BOOK = {
  id: "adhd-deluxe",
  name: "ADHD Deluxe",
  author: "Elias Voss",
  downloadFilename: "ADHD-Deluxe_Elias-Voss.pdf",
} as const;

// Price IDs are non-secret Stripe product identifiers. ADHD Deluxe verifies
// line items rather than trusting a client value or Payment Link reference.
export const ADHD_DELUXE_ALLOWED_PRICE_IDS = new Set([
  "price_1UO3C0AgF4ugWkEkklryPLKO",
  "price_1UO3F6AgF4ugWkEkRCM7L9yX",
]);

type PaymentLinkReference = string | { id: string } | null;

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function paymentLinkId(reference: PaymentLinkReference) {
  return typeof reference === "string" ? reference : reference?.id ?? null;
}

function allowedAudhdBookPaymentLinks() {
  const links = [
    required("AUDHD_BOOK_PAYMENT_LINK_149"),
    required("AUDHD_BOOK_PAYMENT_LINK_79"),
  ];
  if (links.some((link) => !link.startsWith("plink_"))) {
    throw new Error("AuDHD book Payment Link IDs must use the plink_ format");
  }
  return new Set(links);
}

function allowedAutismBookPaymentLinks() {
  const links = [
    required("AUTISM_BOOK_PAYMENT_LINK_ID_149"),
    required("AUTISM_BOOK_PAYMENT_LINK_ID_99"),
  ];
  if (links.some((link) => !link.startsWith("plink_"))) {
    throw new Error("Autism book Payment Link IDs must use the plink_ format");
  }
  return new Set(links);
}

export function isAllowedAudhdBookPaymentLink(reference: PaymentLinkReference) {
  const id = paymentLinkId(reference);
  return Boolean(id && allowedAudhdBookPaymentLinks().has(id));
}

export function isAllowedAutismBookPaymentLink(reference: PaymentLinkReference) {
  const id = paymentLinkId(reference);
  return Boolean(id && allowedAutismBookPaymentLinks().has(id));
}

export function isStripeCheckoutSessionId(value: string | null) {
  return Boolean(value && /^cs_(?:(?:test|live)_)?[A-Za-z0-9]+$/.test(value));
}

export async function verifyAudhdBookCheckoutSession(sessionId: string) {
  function reject(reason: string) {
    console.error(JSON.stringify({ event: "audhd_book_verification_failed", reason }));
    return false;
  }
  if (!isStripeCheckoutSessionId(sessionId)) return reject("invalid_session");

  let stage: "config" | "session" | "line_items" | "payment_intent" | "charge" = "config";
  try {
    const stripe = new Stripe(required("STRIPE_SECRET_KEY"));
    stage = "session";
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.status !== "complete" || session.payment_status !== "paid" || session.mode !== "payment") return reject("session_not_paid");
    {
      const rawPrices = process.env.AUDHD_BOOK_ALLOWED_PRICE_IDS?.trim();
      if (!rawPrices) return reject("price_configuration_missing");
      const prices = rawPrices.split(",").map((value) => value.trim());
      if (prices.some((value) => !/^price_[A-Za-z0-9]+$/.test(value))) return reject("price_configuration_error");
      stage = "line_items";
      const items = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 100 });
      const priceId = items.data.length === 1 ? lineItemPriceId(items.data[0].price) : null;
      if (items.has_more || items.data.length !== 1 || items.data[0].quantity !== 1 || !priceId || !prices.includes(priceId)) return reject("wrong_product");
    }
    const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
    if (!paymentIntent) return reject("payment_intent_missing");
    stage = "payment_intent";
    const intent = await stripe.paymentIntents.retrieve(paymentIntent, { expand: ["latest_charge"] });
    if (intent.status !== "succeeded") return reject("payment_not_captured");
    stage = "charge";
    const charge = typeof intent.latest_charge === "string" ? await stripe.charges.retrieve(intent.latest_charge) : intent.latest_charge;
    if (!charge || !charge.paid) return reject("charge_unavailable");
    if (charge.refunded || charge.amount_refunded > 0) return reject("payment_refunded");
    if (charge.disputed) return reject("payment_disputed");
    return true;
  } catch (error) {
    const category = stage === "config" && !process.env.STRIPE_SECRET_KEY?.trim()
      ? "configuration"
      : Stripe.errors?.StripeError && error instanceof Stripe.errors.StripeError ? "stripe_api" : "unexpected";
    console.error(JSON.stringify({ event: "audhd_book_verification_failed", reason: "stripe_or_configuration_unavailable", stage, category }));
    return false;
  }
}

export async function verifyAutismBookCheckoutSession(sessionId: string) {
  if (!isStripeCheckoutSessionId(sessionId)) return false;

  try {
    const stripe = new Stripe(required("STRIPE_SECRET_KEY"));
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // TODO: When the two price_ IDs are available, retrieve line_items here and
    // require one of them as an additional product-level verification.
    return session.status === "complete" && session.payment_status === "paid" && isAllowedAutismBookPaymentLink(session.payment_link);
  } catch {
    return false;
  }
}

function lineItemPriceId(price: string | { id: string } | null | undefined) {
  return typeof price === "string" ? price : price?.id ?? null;
}

export type AdhdDeluxeCheckoutVerification =
  | { verified: true }
  | {
    verified: false;
    reason: "invalid_session_id" | "session_not_paid_or_complete" | "line_item_price_not_allowed" | "stripe_request_failed";
    diagnostic: AdhdDeluxeCheckoutDiagnostic;
  };

export type AdhdDeluxeCheckoutDiagnostic = {
  stage: "session_id" | "session_retrieve" | "session_status" | "line_items_retrieve" | "price_allowlist";
  allowedPriceIds: string[];
  sessionLivemode: boolean | null;
  sessionStatus: string | null;
  paymentStatus: string | null;
  lineItemCount: number | null;
  observedPriceIds: string[];
  observedPriceIdLengths: number[];
  priceMatch: boolean | null;
  stripeErrorType?: string;
  stripeHttpStatus?: number;
};

function checkoutDiagnostic(stage: AdhdDeluxeCheckoutDiagnostic["stage"], values: Partial<Omit<AdhdDeluxeCheckoutDiagnostic, "stage" | "allowedPriceIds">> = {}): AdhdDeluxeCheckoutDiagnostic {
  return {
    stage,
    allowedPriceIds: Array.from(ADHD_DELUXE_ALLOWED_PRICE_IDS),
    sessionLivemode: null,
    sessionStatus: null,
    paymentStatus: null,
    lineItemCount: null,
    observedPriceIds: [],
    observedPriceIdLengths: [],
    priceMatch: null,
    ...values,
  };
}

function stripeErrorDetails(error: unknown) {
  if (!error || typeof error !== "object") return {};
  const candidate = error as { type?: unknown; statusCode?: unknown };
  return {
    ...(typeof candidate.type === "string" ? { stripeErrorType: candidate.type } : {}),
    ...(typeof candidate.statusCode === "number" && Number.isInteger(candidate.statusCode) ? { stripeHttpStatus: candidate.statusCode } : {}),
  };
}

export async function inspectAdhdDeluxeBookCheckoutSession(sessionId: string): Promise<AdhdDeluxeCheckoutVerification> {
  if (!isStripeCheckoutSessionId(sessionId)) {
    return { verified: false, reason: "invalid_session_id", diagnostic: checkoutDiagnostic("session_id") };
  }

  let stage: AdhdDeluxeCheckoutDiagnostic["stage"] = "session_retrieve";
  try {
    const stripe = new Stripe(required("STRIPE_SECRET_KEY"));
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const sessionDetails = {
      sessionLivemode: session.livemode,
      sessionStatus: session.status,
      paymentStatus: session.payment_status,
    };
    if (session.status !== "complete" || session.payment_status !== "paid") {
      return { verified: false, reason: "session_not_paid_or_complete", diagnostic: checkoutDiagnostic("session_status", sessionDetails) };
    }

    stage = "line_items_retrieve";
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 100, expand: ["data.price"] });
    const observedPriceIds = Array.from(new Set(lineItems.data
      .map((lineItem) => lineItemPriceId(lineItem.price))
      .filter((priceId): priceId is string => priceId !== null)))
      .slice(0, 10);
    const priceMatch = observedPriceIds.some((priceId) => ADHD_DELUXE_ALLOWED_PRICE_IDS.has(priceId));
    if (priceMatch) return { verified: true };
    return {
      verified: false,
      reason: "line_item_price_not_allowed",
      diagnostic: checkoutDiagnostic("price_allowlist", {
        ...sessionDetails,
        lineItemCount: lineItems.data.length,
        observedPriceIds,
        observedPriceIdLengths: observedPriceIds.map((priceId) => priceId.length),
        priceMatch,
      }),
    };
  } catch (error) {
    return { verified: false, reason: "stripe_request_failed", diagnostic: checkoutDiagnostic(stage, stripeErrorDetails(error)) };
  }
}

export async function verifyAdhdDeluxeBookCheckoutSession(sessionId: string) {
  return (await inspectAdhdDeluxeBookCheckoutSession(sessionId)).verified;
}

export function audhdBookR2Config() {
  const endpoint = required("R2_ENDPOINT");
  if (!/^https:\/\//.test(endpoint)) throw new Error("R2_ENDPOINT must use HTTPS");

  return {
    endpoint,
    bucket: required("R2_BUCKET_NAME"),
    key: required("AUDHD_BOOK_R2_KEY"),
    credentials: {
      accessKeyId: required("R2_ACCESS_KEY_ID"),
      secretAccessKey: required("R2_SECRET_ACCESS_KEY"),
    },
  };
}

export function autismBookR2Config() {
  const endpoint = required("R2_ENDPOINT");
  if (!/^https:\/\//.test(endpoint)) throw new Error("R2_ENDPOINT must use HTTPS");

  return {
    endpoint,
    bucket: required("R2_BUCKET_NAME"),
    key: required("AUTISM_BOOK_R2_KEY"),
    credentials: {
      accessKeyId: required("R2_ACCESS_KEY_ID"),
      secretAccessKey: required("R2_SECRET_ACCESS_KEY"),
    },
  };
}

export function adhdDeluxeBookR2Config() {
  const endpoint = required("R2_ENDPOINT");
  if (!/^https:\/\//.test(endpoint)) throw new Error("R2_ENDPOINT must use HTTPS");

  return {
    endpoint,
    bucket: required("R2_BUCKET_NAME"),
    key: required("ADHD_DELUXE_BOOK_R2_KEY"),
    credentials: {
      accessKeyId: required("R2_ACCESS_KEY_ID"),
      secretAccessKey: required("R2_SECRET_ACCESS_KEY"),
    },
  };
}
