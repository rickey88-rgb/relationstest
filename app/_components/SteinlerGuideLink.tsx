import TrackedLink from "./TrackedLink";
import { STEINLER_BOOK as book } from "../_lib/steinlerBook";

export default function SteinlerGuideLink({ source, label = book.title }: { source: string; label?: string }) {
  return <TrackedLink href={book.path + "#forhandsvisning"} event="related_guide_click"
    params={{ source_page: source, destination_page: book.path, position: 1 }}
    className="font-medium underline underline-offset-4">
    {label}
  </TrackedLink>;
}
