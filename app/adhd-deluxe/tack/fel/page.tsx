import { BookThanks, bookThanksMetadata } from "../../../_components/BookThanks";

export const metadata = bookThanksMetadata;
export const dynamic = "force-dynamic";

export default function BookThanksPage() {
  return <BookThanks id="adhd-deluxe" />;
}
