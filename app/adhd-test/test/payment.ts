// Configure this Payment Link in Stripe to return to https://relationsvarning.se/adhd-test/test?paid=true.
// Required for the 79 SEK release. Never fall back to the historical 39 SEK link.
const paymentLink79 = process.env.NEXT_PUBLIC_ADHD_PAYMENT_LINK_79?.trim();
if (!paymentLink79 || !/^https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+$/.test(paymentLink79) || paymentLink79 === "https://buy.stripe.com/6oUcN46SR7Il6Or5MI0gw0m") {
  throw new Error("Configure the verified ADHD 79 SEK Payment Link before building this release.");
}
export const ADHD_STRIPE_URL = paymentLink79;
