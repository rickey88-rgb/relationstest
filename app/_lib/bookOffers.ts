export type BookOffer = {
  price: 149 | 99 | 79;
  paymentLink: string;
  isAnalysisOffer: boolean;
};

const AUDHD_STANDARD: BookOffer = {
  price: 149,
  paymentLink: "https://buy.stripe.com/8x2aEWgtr2o1gp13EA0gw0t",
  isAnalysisOffer: false,
};

const AUDHD_ANALYSIS: BookOffer = {
  price: 79,
  paymentLink: "https://buy.stripe.com/8x23cu0ut5Adgp11ws0gw0u",
  isAnalysisOffer: true,
};

const AUTISM_STANDARD: BookOffer = {
  price: 149,
  paymentLink: "https://buy.stripe.com/5kQ28q0ut5Adb4H5MI0gw0v",
  isAnalysisOffer: false,
};

const AUTISM_ANALYSIS: BookOffer = {
  price: 99,
  paymentLink: "https://buy.stripe.com/9B600i0utaUx7Sv5MI0gw0w",
  isAnalysisOffer: true,
};

export function getAudhdBookOffer(offer: unknown): BookOffer {
  return offer === "analysis" ? AUDHD_ANALYSIS : AUDHD_STANDARD;
}

export function getAutismBookOffer(offer: unknown): BookOffer {
  return offer === "analysis" ? AUTISM_ANALYSIS : AUTISM_STANDARD;
}
