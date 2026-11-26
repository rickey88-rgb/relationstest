// Canonical checkout amounts. The provider records and return URLs are in deploy/pricing79.json.
export const npfPrices = {
  adhd_test: {
    current: { amount: 7900, priceId: "price_1UVDIYAgF4ugWkEkDBJfJhME", paymentLinkId: "plink_1UVDIyAgF4ugWkEk3UqxeShv", url: "https://buy.stripe.com/eVq8wO2CB5Ad1u71ws0gw0z" },
    previous: { amount: 3900, priceId: "price_1UFctJAgF4ugWkEkHTrwY3JH", paymentLinkId: "plink_1UFctdAgF4ugWkEkYP7aToNE" },
  },
  autism_test: {
    current: { amount: 7900, priceId: "price_1UVDKtAgF4ugWkEkvuSXZibL", paymentLinkId: "plink_1UVDLMAgF4ugWkEkwaKZ8aPQ", url: "https://buy.stripe.com/bJe6oGfpn2o1egT1ws0gw0A" },
    previous: { amount: 3900, priceId: "price_1UFzL0AgF4ugWkEkgjOM10GH", paymentLinkId: "plink_1UFzLVAgF4ugWkEk8re8WHTh" },
  },
} as const;

export function npfReportAmount(product: string, priceId: string, currentAmount: number) {
  if (product !== "adhd_test" && product !== "autism_test") return currentAmount;
  const prices = npfPrices[product];
  if (priceId === prices.current.priceId) return prices.current.amount;
  // Before this release, any already allowlisted Price for these tests had to pay 39 SEK.
  return prices.previous.amount;
}

export function npfCurrentPrice(product: string) {
  return product === "adhd_test" || product === "autism_test" ? npfPrices[product].current : undefined;
}

export const adhdReportPrice = npfPrices.adhd_test.current.amount / 100;
export const autismReportPrice = npfPrices.autism_test.current.amount / 100;
