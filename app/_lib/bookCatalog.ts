import { BOOK_OFFER_PRICES } from "./bookOffers";
import { ADHD_DELUXE_BOOK, AUDHD_BOOK, AUTISM_BOOK } from "./legacyBookDetails";
import { OVERTHINKING_BOOK } from "./overthinkingBook";

export const LEGACY_BOOKS = [
  {
    id: AUDHD_BOOK.id, path: "/audhd-bok", title: AUDHD_BOOK.name, author: AUDHD_BOOK.author,
    cover: "/audhd-bok-mockup.png", width: 1312, height: 1199,
    price: BOOK_OFFER_PRICES.audhd.ordinary, filename: AUDHD_BOOK.downloadFilename,
    description: "Praktiska system för fokus, sinnesintryck och återhämtning när ADHD och autism påverkar samma vardag.",
  },
  {
    id: ADHD_DELUXE_BOOK.id, path: "/adhd-deluxe", title: ADHD_DELUXE_BOOK.name, author: ADHD_DELUXE_BOOK.author,
    cover: "/adhd-deluxe/mockup.png", width: 1064, height: 1479,
    price: BOOK_OFFER_PRICES.adhdDeluxe.ordinary, filename: ADHD_DELUXE_BOOK.downloadFilename,
    description: "Verktyg och arbetsblad för att komma igång, hålla reda på tiden och få vardagen med ADHD att fungera.",
  },
  {
    id: AUTISM_BOOK.id, path: "/autism-bok", title: AUTISM_BOOK.name, author: AUTISM_BOOK.author,
    cover: "/autism-all-inclusive-mockup.png", width: 1205, height: 1305,
    price: BOOK_OFFER_PRICES.autism.ordinary, filename: AUTISM_BOOK.downloadFilename,
    description: "En konkret guide till sinnesintryck, energi och tydlighet, med ifyllbara arbetsblad för vardagen.",
  },
] as const;

export type LegacyBookId = (typeof LEGACY_BOOKS)[number]["id"];
export const LEGACY_BOOK_LIBRARY_API = "/api/books/library";
export const THINKING_CATALOG_BOOK = {
  ...OVERTHINKING_BOOK,
  id: "du-tanker-sonder-dig-sjalv", width: 640, height: 960,
  description: "Praktiska verktyg, åtta ifyllbara skrivblad och en fjortondagarsplan för dig som fastnar i oro och ältande.",
} as const;
export const BOOK_CATALOG = [...LEGACY_BOOKS, THINKING_CATALOG_BOOK] as const;
export type CatalogBook = (typeof BOOK_CATALOG)[number];
