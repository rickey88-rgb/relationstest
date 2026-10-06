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
  if (!isStripeCheckoutSessionId(sessionId)) return false;

  try {
    const stripe = new Stripe(required("STRIPE_SECRET_KEY"));
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // TODO: When the two price_ IDs are available, retrieve line_items here and
    // require one of them as an additional product-level verification.
    return session.status === "complete" && session.payment_status === "paid" && isAllowedAudhdBookPaymentLink(session.payment_link);
  } catch {
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
