// Configure this return URL on the Payment Link in Stripe; it is not set by the browser.
// Required for the 79 SEK release. Never fall back to the historical 39 SEK link.
const paymentLink79 = process.env.NEXT_PUBLIC_AUTISM_PAYMENT_LINK_79?.trim();
if (!paymentLink79 || !/^https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+$/.test(paymentLink79) || paymentLink79 === "https://buy.stripe.com/7sY6oG5ON6Eh0q3b720gw0n") {
  throw new Error("Configure the verified AUTISM 79 SEK Payment Link before building this release.");
}
export const AUTISM_STRIPE_URL = paymentLink79;
export const AUTISM_RETURN_URL = "https://relationsvarning.se/autism-test/test?paid=true";
