// Add the live Stripe Payment Link through NEXT_PUBLIC_IQ_TEST_STRIPE_URL when the product is configured.
// Configure its success URL as https://relationsvarning.se/iq-test/test?paid=true.
export const IQ_TEST_STRIPE_URL = process.env.NEXT_PUBLIC_IQ_TEST_STRIPE_URL ?? "";
