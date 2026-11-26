import { npfPrices } from "../_content/npfPricing";

export const PAYMENT_PRODUCT_KEYS = [
  "audhd_test_no",
  "hjernen_i_kryssild",
  "persona_test",
  "adhd_test",
  "autism_test",
  "audhd_test",
  "hsp_test",
  "iq_test",
  "ptsd_test",
  "angest_test",
  "screening_test",
  "psychological_abuse_test",
  "attachment_test",
  "codependency_test",
  "gaslighting_test",
  "trauma_bond_test",
  "narcissist_partner",
  "narcissism_selftest",
  "audhd_bok",
  "autism_bok",
  "adhd_deluxe",
  "overthinking_book",
  "steinler_book",
  "lite_autism_book",
] as const;

export type PaymentProductKey = (typeof PAYMENT_PRODUCT_KEYS)[number];
export type PaymentProductIdentification = PaymentProductKey | "unmapped";

type CatalogEntry = {
  priceIds?: unknown;
  paymentLinkIds?: unknown;
};

type Catalog = Partial<Record<PaymentProductKey, {
  priceIds: string[];
  paymentLinkIds: string[];
}>>;

function isProductKey(value: string): value is PaymentProductKey {
  return (PAYMENT_PRODUCT_KEYS as readonly string[]).includes(value);
}

function stringIds(value: unknown, prefix: string) {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter((item): item is string => typeof item === "string" && item.startsWith(prefix))));
}

/**
 * Product identifiers are operational configuration, not credentials. Keeping
 * them in one JSON variable lets the webhook observe old Payment Links without
 * changing any customer-facing checkout code.
 */
export function paymentProductCatalog(): Catalog {
  const raw = process.env.STRIPE_PAYMENT_PRODUCT_MAP_JSON?.trim();
  if (!raw) return {};

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("STRIPE_PAYMENT_PRODUCT_MAP_JSON is not valid JSON");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("STRIPE_PAYMENT_PRODUCT_MAP_JSON must be an object");
  }

  const catalog: Catalog = {};
  for (const [key, value] of Object.entries(parsed as Record<string, CatalogEntry>)) {
    if (!isProductKey(key) || !value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("STRIPE_PAYMENT_PRODUCT_MAP_JSON contains an invalid product entry");
    }
    const entry = value as CatalogEntry;
    catalog[key] = {
      priceIds: stringIds(entry.priceIds, "price_"),
      paymentLinkIds: stringIds(entry.paymentLinkIds, "plink_"),
    };
  }
  // An additive, non-secret PERSONA allowlist avoids replacing the shared map
  // when its existing secret value cannot be exported. Historical IDs stay intact.
  const personaPrices = process.env.STRIPE_PERSONA_PRICE_IDS?.trim();
  if (personaPrices) {
    const ids = Array.from(new Set(personaPrices.split(",").map(id => id.trim())));
    if (ids.some(id => !/^price_[A-Za-z0-9]+$/.test(id))) throw new Error("Invalid PERSONA price allowlist");
    for (const [product, entry] of Object.entries(catalog)) {
      if (product !== "persona_test" && entry?.priceIds.some(id => ids.includes(id))) throw new Error("PERSONA price belongs to another product");
    }
    const prior = catalog.persona_test;
    catalog.persona_test = { priceIds: Array.from(new Set([...(prior?.priceIds ?? []), ...ids])), paymentLinkIds: prior?.paymentLinkIds ?? [] };
  }

  // Keep the shared map intact. A conflicting or invalid new price must not
  // stop webhooks or change access for any existing product.
  const bookPrices = [
    ["overthinking_book", process.env.OVERTHINKING_BOOK_PRICE_ID?.trim() ?? ""],
    ["steinler_book", process.env.STEINLER_BOOK_PRICE_ID?.trim() ?? ""],
    ["lite_autism_book", process.env.LITE_AUTISM_BOOK_PRICE_ID?.trim() ?? ""],
    ["lite_autism_book", process.env.NEXT_PUBLIC_LITE_AUTISM_BOOK_OFFER_PRICE_ID?.trim() ?? ""],
  ] as const;
  for (const [key, bookPrice] of bookPrices) {
    if (!/^price_[A-Za-z0-9]+$/.test(bookPrice) ||
        Object.entries(catalog).some(([product, entry]) => product !== key && entry.priceIds.includes(bookPrice))) continue;
    const prior = catalog[key];
    catalog[key] = {
      priceIds: Array.from(new Set([...(prior?.priceIds ?? []), bookPrice])),
      paymentLinkIds: prior?.paymentLinkIds ?? [],
    };
  }
  for (const key of ["adhd_test", "autism_test"] as const) {
    const entry = catalog[key] ??= { priceIds: [], paymentLinkIds: [] };
    for (const { priceId, paymentLinkId } of Object.values(npfPrices[key])) {
      const conflicts = Object.entries(catalog).some(([other, values]) => other !== key &&
        (values.priceIds.includes(priceId) || values.paymentLinkIds.includes(paymentLinkId)));
      if (conflicts) continue;
      if (!entry.priceIds.includes(priceId)) entry.priceIds.push(priceId);
      if (!entry.paymentLinkIds.includes(paymentLinkId)) entry.paymentLinkIds.push(paymentLinkId);
    }
  }
  return catalog;
}

export function identifyPaymentProduct(input: { priceIds: string[]; paymentLinkId: string | null }): PaymentProductIdentification {
  const catalog = paymentProductCatalog();
  const matches = new Set<PaymentProductKey>();
  if (input.priceIds.some(id => id === process.env.NORWAY_REPORT_PRICE_ID?.trim())) matches.add("audhd_test_no");
  if (input.priceIds.some(id => id === process.env.NORWAY_BOOK_PRICE_ID?.trim() || id === process.env.NORWAY_BOOK_OFFER_PRICE_ID?.trim())) matches.add("hjernen_i_kryssild");

  for (const product of PAYMENT_PRODUCT_KEYS) {
    const entry = catalog[product];
    if (!entry) continue;
    if (input.priceIds.some((priceId) => entry.priceIds.includes(priceId)) || (input.paymentLinkId !== null && entry.paymentLinkIds.includes(input.paymentLinkId))) {
      matches.add(product);
    }
  }

  return matches.size === 1 ? Array.from(matches)[0] : "unmapped";
}

/**
 * Returns the exact Price IDs configured for a product. Recovery flows use
 * this instead of trusting a Checkout Session's Payment Link alone.
 */
export function configuredPriceIdsForProduct(product: PaymentProductKey) {
  return paymentProductCatalog()[product]?.priceIds ?? [];
}

/**
 * Checkout uses one deliberately selected current Price. The product map stays
 * an allowlist for the shadow ledger and historical recovery, so it may retain
 * older legitimate AuDHD Price IDs without changing a new customer's price.
 */
export function configuredAudhdCheckoutPriceId() {
  const priceId = process.env.AUDHD_CHECKOUT_PRICE_ID?.trim() ?? "";
  if (!/^price_[A-Za-z0-9]+$/.test(priceId)) throw new Error("AUDHD_CHECKOUT_PRICE_ID is not configured");
  if (!configuredPriceIdsForProduct("audhd_test").includes(priceId)) {
    throw new Error("AUDHD_CHECKOUT_PRICE_ID must be allowlisted for audhd_test");
  }
  return priceId;
}
