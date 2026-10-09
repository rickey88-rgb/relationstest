import { testConfig, type TestId } from "../_analytics/config";
import { BOOK_OFFER_PRICES } from "../_lib/bookOffers";
import { ADHD_DELUXE_SALE_ENABLED, AUTISM_BOOK_SALE_ENABLED } from "../_lib/featureFlags";

export type ProductType = "test" | "book";
export type BookProductId = "audhd_book" | "autism_book" | "adhd_deluxe";
export type ProductId = TestId | BookProductId;
export type OfferPosition = "primary" | "secondary";

type ProductDefinition = {
  id: ProductId;
  type: ProductType;
  name: string;
  path?: string;
  price: number;
  ordinaryPrice?: number;
  currency: "SEK";
  enabled: boolean;
  analyticsId: string;
  image?: { src: string; alt: string; width: number; height: number };
};

type OfferCopy = { title: string; description: string; label: string };
type OfferConditions = {
  requiresActiveProduct?: boolean;
  hideIfTargetTestUnlocked?: boolean;
};
type ConfiguredOffer = OfferCopy & {
  productId: ProductId;
  position: OfferPosition;
  priority: number;
  selectionGroup?: string;
  path?: string;
  conditions?: OfferConditions;
};

export type ResolvedOffer = ConfiguredOffer & {
  product: ProductDefinition;
  displayPosition: OfferPosition;
};

const testProducts = Object.fromEntries(Object.entries(testConfig).map(([id, test]) => [id, {
  id: id as TestId,
  type: "test" as const,
  name: test.name,
  path: test.path,
  price: test.price,
  currency: test.currency,
  enabled: true,
  analyticsId: id,
}])) as Record<TestId, ProductDefinition>;

// This is intentionally a presentation catalogue. It never owns a Stripe
// Payment Link, entitlement, checkout state, or access token.
export const productCatalog = {
  ...testProducts,
  audhd_book: {
    id: "audhd_book",
    type: "book",
    name: "Världens bästa bok om AuDHD",
    path: "/audhd-bok?offer=analysis",
    price: BOOK_OFFER_PRICES.audhd.analysis,
    ordinaryPrice: BOOK_OFFER_PRICES.audhd.ordinary,
    currency: "SEK",
    enabled: true,
    analyticsId: "audhd_book",
    image: { src: "/audhd-bok-mockup.png", alt: "Världens bästa bok om AuDHD av Elias Voss", width: 1312, height: 1199 },
  },
  autism_book: {
    id: "autism_book",
    type: "book",
    name: "På mitt sätt",
    path: "/autism-bok?offer=analysis",
    price: BOOK_OFFER_PRICES.autism.analysis,
    ordinaryPrice: BOOK_OFFER_PRICES.autism.ordinary,
    currency: "SEK",
    enabled: AUTISM_BOOK_SALE_ENABLED,
    analyticsId: "autism_book",
    image: { src: "/autism-bok-mockup.png", alt: "På mitt sätt – bok om autism av Elias Voss", width: 1312, height: 1199 },
  },
  adhd_deluxe: {
    id: "adhd_deluxe",
    type: "book",
    name: "ADHD Deluxe",
    path: "/adhd-deluxe?offer=analysis",
    price: BOOK_OFFER_PRICES.adhdDeluxe.analysis,
    ordinaryPrice: BOOK_OFFER_PRICES.adhdDeluxe.ordinary,
    currency: "SEK",
    enabled: ADHD_DELUXE_SALE_ENABLED,
    analyticsId: "adhd_deluxe",
    image: { src: "/adhd-bok-mockup.png", alt: "ADHD Deluxe – bok om ADHD av Elias Voss", width: 1448, height: 1086 },
  },
} satisfies Record<ProductId, ProductDefinition>;

const targetCopy: Partial<Record<TestId, OfferCopy>> = {
  screening_test: { title: "Vill du undersöka relationen bredare?", description: "Det generella relationstestet hjälper dig att sätta flera beteendemönster i ett sammanhang. Det ger inget beslut om vad du måste göra.", label: "Gör relationstestet" },
  psychological_abuse_test: { title: "Vill du undersöka psykisk misshandel mer specifikt?", description: "Det separata testet fokuserar på återkommande kontroll, nedvärdering och andra beteenden som kan påverka tryggheten i relationen.", label: "Gör testet om psykisk misshandel" },
  attachment_test: { title: "Vill du utforska anknytningsmönster?", description: "Anknytningstestet fokuserar mer specifikt på hur närhet, avstånd och trygghet fungerar i relationer.", label: "Gör anknytningstestet" },
  gaslighting_test: { title: "Vill du undersöka gaslighting mer specifikt?", description: "Det separata gaslightingtestet hjälper dig att reflektera över återkommande ifrågasättande och tilliten till din egen upplevelse.", label: "Gör gaslightingtestet" },
  codependency_test: { title: "Vill du utforska överansvar och egna behov?", description: "Medberoendetestet undersöker hur omsorg, gränser och ansvar kan samspela i en relation.", label: "Gör medberoendetestet" },
  trauma_bond_test: { title: "Vill du undersöka växlingen i relationen?", description: "Traumabindningstestet fokuserar på starka band och på hur perioder av närhet och smärta kan hänga ihop.", label: "Gör traumabindningstestet" },
  narcissist_partner: { title: "Vill du undersöka relationsmönstren mer specifikt?", description: "Det separata testet utforskar beteenden i relationen utan att avgöra om en partner har en diagnos.", label: "Gör testet om relationsmönster" },
  angest_test: { title: "Vill du utforska oro och återhämtning?", description: "Ångesttestet är en självskattning av oro, anspänning, sömn och vardagspåverkan.", label: "Gör ångesttestet" },
};

const sourceCopy: Partial<Record<TestId, Partial<Record<TestId, OfferCopy>>>> = {
  adhd_test: { audhd_test: { title: "Känner du igen både ADHD- och autistiska drag?", description: "ADHD och autism kan förekomma tillsammans. AuDHD-testet undersöker hur drag från båda områdena kan samspela i vardagen.", label: "Gör AuDHD-testet" } },
  autism_test: { audhd_test: { title: "Känner du också igen ADHD-drag?", description: "Autistiska drag och ADHD-drag kan förekomma tillsammans. AuDHD-testet tittar närmare på hur de två områdena kan samspela.", label: "Gör AuDHD-testet" } },
  audhd_test: {
    adhd_test: { title: "Vill du utforska ADHD-relaterade drag närmare?", description: "AuDHD-testet omfattar både ADHD- och autismrelaterade drag. ADHD-testet låter dig utforska ADHD-relaterade områden separat.", label: "Gör ADHD-testet" },
    autism_test: { title: "Vill du utforska autismrelaterade drag närmare?", description: "AuDHD-testet omfattar både ADHD- och autismrelaterade drag. Autismtestet låter dig utforska autismrelaterade områden separat.", label: "Gör autismtestet" },
  },
  hsp_test: {
    autism_test: { title: "Vill du utforska liknande drag vidare?", description: "Vissa upplevelser kring känslighet, social belastning och behov av återhämtning kan också förekomma vid autism, även om HSP och autism inte är samma sak.", label: "Gör autismtestet" },
    adhd_test: { title: "Vill du utforska liknande drag vidare?", description: "Vissa upplevelser kring känslighet, överstimulering och behov av återhämtning kan också förekomma vid ADHD, även om HSP och ADHD inte är samma sak.", label: "Gör ADHD-testet" },
  },
  ptsd_test: { angest_test: { title: "Är oro och stress en stor del av vardagen?", description: "Ångest och stark oro kan förekomma tillsammans med traumarelaterade reaktioner. Ångesttestet hjälper dig att utforska den delen separat.", label: "Gör ångesttestet" } },
};

function copyFor(source: ProductId, productId: ProductId, fallback: OfferCopy): OfferCopy {
  if (source in testConfig && productId in testConfig) return sourceCopy[source as TestId]?.[productId as TestId] ?? targetCopy[productId as TestId] ?? fallback;
  return fallback;
}

function testOffer(source: ProductId, productId: TestId, position: OfferPosition, priority: number, options: Pick<ConfiguredOffer, "selectionGroup" | "path" | "conditions"> = {}): ConfiguredOffer {
  return { productId, position, priority, conditions: { hideIfTargetTestUnlocked: true }, ...copyFor(source, productId, { title: productCatalog[productId].name, description: "", label: `Gör ${productCatalog[productId].name}` }), ...options };
}

function bookOffer(productId: BookProductId, position: OfferPosition, priority: number): ConfiguredOffer {
  const product = productCatalog[productId];
  const descriptions: Record<BookProductId, string> = {
    autism_book: "En konkret bok som hjälper dig att omsätta förståelsen från analysen till vardagsverktyg som fungerar på ditt sätt.",
    audhd_book: "10 konkreta sätt att få livet att fungera när ADHD och autism drar åt varsitt håll.",
    adhd_deluxe: "En konkret bok om att förstå var vardagen fastnar och bygga smartare runt det.",
  };
  return { productId, position, priority, title: product.name, description: descriptions[productId], label: `Läs om boken · ${product.price} kr` };
}

export const crossSellOffers: Partial<Record<ProductId, readonly ConfiguredOffer[]>> = {
  adhd_test: [
    bookOffer("adhd_deluxe", "primary", 10),
    testOffer("adhd_test", "audhd_test", "secondary", 20, { path: "/audhd-test" }),
  ],
  autism_test: [
    bookOffer("autism_book", "primary", 10),
    testOffer("autism_test", "audhd_test", "secondary", 20, { path: "/audhd-test" }),
  ],
  audhd_test: [
    bookOffer("audhd_book", "primary", 10),
    testOffer("audhd_test", "adhd_test", "secondary", 20, { selectionGroup: "audhd-focus", path: "/adhd-test" }),
    testOffer("audhd_test", "autism_test", "secondary", 21, { selectionGroup: "audhd-focus", path: "/autism-test" }),
  ],
  hsp_test: [
    testOffer("hsp_test", "autism_test", "primary", 10, { selectionGroup: "neurodevelopmental", path: "/autism-test" }),
    testOffer("hsp_test", "adhd_test", "secondary", 20, { selectionGroup: "neurodevelopmental", path: "/adhd-test" }),
  ],
  ptsd_test: [testOffer("ptsd_test", "angest_test", "primary", 10)],
  screening_test: [
    testOffer("screening_test", "gaslighting_test", "primary", 10, { conditions: { requiresActiveProduct: true, hideIfTargetTestUnlocked: true } }),
    testOffer("screening_test", "psychological_abuse_test", "primary", 20, { conditions: { requiresActiveProduct: true, hideIfTargetTestUnlocked: true } }),
    testOffer("screening_test", "trauma_bond_test", "primary", 30, { conditions: { requiresActiveProduct: true, hideIfTargetTestUnlocked: true } }),
    testOffer("screening_test", "codependency_test", "primary", 40, { conditions: { requiresActiveProduct: true, hideIfTargetTestUnlocked: true } }),
    testOffer("screening_test", "attachment_test", "primary", 50, { conditions: { requiresActiveProduct: true, hideIfTargetTestUnlocked: true } }),
    testOffer("screening_test", "narcissist_partner", "primary", 60, { conditions: { requiresActiveProduct: true, hideIfTargetTestUnlocked: true } }),
  ],
  psychological_abuse_test: [testOffer("psychological_abuse_test", "screening_test", "primary", 10)],
  attachment_test: [testOffer("attachment_test", "codependency_test", "primary", 10)],
  codependency_test: [testOffer("codependency_test", "attachment_test", "primary", 10)],
  gaslighting_test: [testOffer("gaslighting_test", "psychological_abuse_test", "primary", 10)],
  trauma_bond_test: [testOffer("trauma_bond_test", "screening_test", "primary", 10)],
  narcissist_partner: [testOffer("narcissist_partner", "screening_test", "primary", 10)],
  audhd_book: [{ productId: "audhd_test", position: "primary", priority: 10, path: "/audhd-test", title: "Vill du få en bild av dina egna AuDHD-drag?", description: "AuDHD-testet hjälper dig att utforska hur ADHD- och autismrelaterade drag kan samspela i vardagen.", label: "Gör AuDHD-testet" }],
  autism_book: [{ productId: "autism_test", position: "primary", priority: 10, path: "/autism-test", title: "Vill du utforska dina egna autismrelaterade drag?", description: "Autismtestet hjälper dig att strukturera egna erfarenheter och vardagsmönster utan att ställa diagnos.", label: "Gör autismtestet" }],
  adhd_deluxe: [
    testOffer("adhd_deluxe", "adhd_test", "primary", 10, { path: "/adhd-test" }),
    testOffer("adhd_deluxe", "audhd_test", "secondary", 20, { path: "/audhd-test" }),
  ],
};

type ResolveOptions = {
  preferredProductIds?: readonly ProductId[];
  activeProductIds?: readonly ProductId[];
  hasTestAccess?: (testId: TestId) => boolean;
};

export function resolveCrossSellOffers(sourceProduct: ProductId, options: ResolveOptions = {}): ResolvedOffer[] {
  const preferred = options.preferredProductIds ?? [];
  const active = options.activeProductIds;
  const candidates = (crossSellOffers[sourceProduct] ?? [])
    .filter((offer) => active === undefined || active.includes(offer.productId))
    .filter((offer) => !offer.conditions?.requiresActiveProduct || active?.includes(offer.productId))
    .filter((offer) => productCatalog[offer.productId].enabled)
    .filter((offer) => productCatalog[offer.productId].type !== "test" || offer.conditions?.hideIfTargetTestUnlocked === false || !options.hasTestAccess?.(offer.productId as TestId));

  const selected = new Map<string, ConfiguredOffer>();
  for (const offer of candidates) {
    const group = offer.selectionGroup ?? offer.productId;
    const existing = selected.get(group);
    if (!existing) {
      selected.set(group, offer);
      continue;
    }
    const existingPreference = preferred.indexOf(existing.productId);
    const offerPreference = preferred.indexOf(offer.productId);
    const shouldPreferOffer = (offerPreference >= 0 && (existingPreference < 0 || offerPreference < existingPreference))
      || (offerPreference < 0 && existingPreference < 0 && offer.priority < existing.priority);
    if (shouldPreferOffer) selected.set(group, offer);
  }

  return Array.from(selected.values())
    .sort((left, right) => left.priority - right.priority)
    .slice(0, 2)
    .map((offer, index) => ({ ...offer, product: productCatalog[offer.productId], displayPosition: index === 0 ? "primary" : "secondary" }));
}
