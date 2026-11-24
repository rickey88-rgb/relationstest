"use client";

import Link from "next/link";
import { trackEvent } from "../_analytics/analytics";
import { LITE_AUTISM_BOOK as book } from "../_lib/liteAutismBook";

export default function PreviewLink({ className, position, pdf = false, children }: {
  className?: string;
  position: string;
  pdf?: boolean;
  children: React.ReactNode;
}) {
  const href = pdf ? book.excerpt : book.preview;
  const track = () => trackEvent("book_preview_click", {
    product_id: book.product, product_name: book.title, price: book.price, currency: "SEK",
    position, destination_page: href,
  });
  return pdf
    ? <a className={className} href={href} target="_blank" rel="noreferrer" onClick={track}>{children}</a>
    : <Link className={className} href={href} onClick={track}>{children}</Link>;
}
