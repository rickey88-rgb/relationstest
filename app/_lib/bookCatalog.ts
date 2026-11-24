import { BOOK_OFFER_PRICES } from "./bookOffers";
import { ADHD_DELUXE_BOOK, AUDHD_BOOK, AUTISM_BOOK } from "./legacyBookDetails";
import { OVERTHINKING_BOOK } from "./overthinkingBook";
import { STEINLER_BOOK } from "./steinlerBook";
import { LITE_AUTISM_BOOK } from "./liteAutismBook";

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
export const BOOK_CATALOG = [LITE_AUTISM_BOOK, ...LEGACY_BOOKS, THINKING_CATALOG_BOOK, STEINLER_BOOK] as const;
export type CatalogBook = (typeof BOOK_CATALOG)[number];
export type BookId = CatalogBook["id"];
export const BOOK_LIBRARY_PATH = "/mina-sidor?bok=bibliotek#bibliotek";

export type BookFile = {
  id: "book" | "worksheets" | "print";
  label: string;
  filename: string;
};

const bonusFiles: Partial<Record<BookId, readonly BookFile[]>> = {
  "autism-bok": [
    { id: "worksheets", label: "Ifyllbara arbetsblad", filename: AUTISM_BOOK.worksheetsFilename },
  ],
  "adhd-deluxe": [
    { id: "worksheets", label: "Ifyllbara arbetsblad", filename: ADHD_DELUXE_BOOK.worksheetsFilename },
    { id: "print", label: "Arbetsblad för utskrift", filename: ADHD_DELUXE_BOOK.printWorksheetsFilename },
  ],
};

export function bookFiles(book: CatalogBook): BookFile[] {
  return [{ id: "book", label: "E-bok (PDF)", filename: book.filename }, ...(bonusFiles[book.id] ?? [])];
}

export function bookDeliveryCover(book: CatalogBook) {
  return book.id === LITE_AUTISM_BOOK.id
    ? { src: LITE_AUTISM_BOOK.front, width: 1055, height: 1491 }
    : { src: book.cover, width: book.width, height: book.height };
}

export function bookFilePath(book: CatalogBook, file: BookFile, access?: { email: string } | "guest") {
  const params = new URLSearchParams({ file: file.id });
  if (access === "guest") params.set("guest", "1");
  else if (access) params.set("email", access.email);
  return `/api/books/delivery/${book.id}?${params}`;
}
