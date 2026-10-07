export type BookOffer = {
  price: 149 | 99 | 79;
  paymentLink: string;
  isAnalysisOffer: boolean;
};

// Prices are shared by the product pages and the presentation-only
// cross-sell catalogue. Payment Links remain owned by this module.
export const BOOK_OFFER_PRICES = {
  audhd: { ordinary: 149, analysis: 79 },
  autism: { ordinary: 149, analysis: 99 },
} as const;

const AUDHD_STANDARD: BookOffer = {
  price: BOOK_OFFER_PRICES.audhd.ordinary,
  paymentLink: "https://buy.stripe.com/8x2aEWgtr2o1gp13EA0gw0t",
  isAnalysisOffer: false,
};

const AUDHD_ANALYSIS: BookOffer = {
  price: BOOK_OFFER_PRICES.audhd.analysis,
  paymentLink: "https://buy.stripe.com/8x23cu0ut5Adgp11ws0gw0u",
  isAnalysisOffer: true,
};

const AUTISM_STANDARD: BookOffer = {
  price: BOOK_OFFER_PRICES.autism.ordinary,
  paymentLink: "https://buy.stripe.com/5kQ28q0ut5Adb4H5MI0gw0v",
  isAnalysisOffer: false,
};

const AUTISM_ANALYSIS: BookOffer = {
  price: BOOK_OFFER_PRICES.autism.analysis,
  paymentLink: "https://buy.stripe.com/9B600i0utaUx7Sv5MI0gw0w",
  isAnalysisOffer: true,
};

export function getAudhdBookOffer(offer: unknown): BookOffer {
  return offer === "analysis" ? AUDHD_ANALYSIS : AUDHD_STANDARD;
}

export function getAutismBookOffer(offer: unknown): BookOffer {
  return offer === "analysis" ? AUTISM_ANALYSIS : AUTISM_STANDARD;
}
