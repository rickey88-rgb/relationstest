export const PAYMENT_PRODUCT_KEYS = [
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
  return catalog;
}

export function identifyPaymentProduct(input: { priceIds: string[]; paymentLinkId: string | null }): PaymentProductIdentification {
  const catalog = paymentProductCatalog();
  const matches = new Set<PaymentProductKey>();

  for (const product of PAYMENT_PRODUCT_KEYS) {
    const entry = catalog[product];
    if (!entry) continue;
    if (input.priceIds.some((priceId) => entry.priceIds.includes(priceId)) || (input.paymentLinkId !== null && entry.paymentLinkIds.includes(input.paymentLinkId))) {
      matches.add(product);
    }
  }

  return matches.size === 1 ? Array.from(matches)[0] : "unmapped";
}
