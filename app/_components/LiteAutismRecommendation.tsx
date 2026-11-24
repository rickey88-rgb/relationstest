import Image from "next/image";
import Link from "next/link";
import { LITE_AUTISM_BOOK as book } from "../_lib/liteAutismBook";
import { bookCheckoutEnabled, liteAutismEdition } from "../_lib/overthinkingBook.server";

export default function LiteAutismRecommendation({ afterResult = false, className = "" }: { afterResult?: boolean; className?: string }) {
  if (!bookCheckoutEnabled(liteAutismEdition)) return null;
  const heading = afterResult ? "Kände du igen dig?" : "Läs om livet med autism genom Ellies vardag";
  return <aside aria-label={heading} className={`mt-8 rounded-2xl bg-[#e7f3fa] px-4 py-3 text-[#101b49] sm:px-6 ${className}`}>
    <div className="flex items-center gap-3 sm:gap-5">
      <Image src={book.cover} alt="" width={book.width} height={book.height} sizes="92px" className="h-auto w-20 shrink-0 sm:w-24" />
      <div>
        <h2 className="text-base font-semibold leading-tight sm:text-lg">{heading}</h2>
        <p className="mt-1 text-sm leading-relaxed">Möt Ellie i en rolig, varm och alldeles för ärlig berättelse om livet med autism.</p>
        <Link href={book.path} className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4 focus-visible:outline-2">Läs om boken <span aria-hidden="true" className="ml-2">→</span></Link>
      </div>
    </div>
  </aside>;
}
