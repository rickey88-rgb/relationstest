import { norwegian } from "../_content/market";

export const NORWEGIAN_BOOK = {
  id: "hjernen-i-kryssild",
  product: "hjernen_i_kryssild",
  path: norwegian.book,
  title: "Hjernen i kryssild",
  subtitle: "AuDHD – å forstå og leve med ADHD og autisme samtidig",
  author: "Sander Vik",
  price: norwegian.bookPrice,
  amountOre: norwegian.bookPrice * 100,
  filename: "Hjernen-i-kryssild.pdf",
  cover: norwegian.book + "/omslag.webp",
  excerpt: norwegian.book + "/leseprove.pdf",
  width: 564,
  height: 800,
  description: "En praktisk e-bok på bokmål om livet med ADHD og autisme, med øvelser for rutiner, sanseinntrykk og restitusjon.",
} as const;

export function norwegianBookAmount(priceId: string | undefined) {
  if (!priceId || !/^price_[A-Za-z0-9]+$/.test(priceId)) return null;
  if (priceId === process.env.NORWAY_BOOK_PRICE_ID?.trim()) return NORWEGIAN_BOOK.amountOre;
  if (priceId === process.env.NORWAY_BOOK_OFFER_PRICE_ID?.trim()) return norwegian.bookOffer * 100;
  return null;
}
