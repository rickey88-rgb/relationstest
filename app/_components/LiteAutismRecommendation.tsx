import Image from "next/image";
import { bookDeliveryCover } from "../_lib/bookCatalog";
import { LITE_AUTISM_BOOK as book } from "../_lib/liteAutismBook";
import { bookCheckoutEnabled, liteAutismEdition } from "../_lib/overthinkingBook.server";
import TrackedLink from "./TrackedLink";

const recommendations: Record<string, { copy: string; preview?: boolean }> = {
  "/autism-vuxna": { copy: "Följ Ellie genom jobbtelefoner, ändrade planer och en middag som kräver mer planering än någon tror." },
  "/autism-kvinnor": { copy: "Ellie har lärt sig att verka obekymrad. I den illustrerade berättelsen får du följa vad som händer när hon inte längre orkar hålla allt för sig själv." },
  "/autism-kvinnor-symtom": { copy: "Hur kan maskering se ut mitt i en vanlig arbetsdag? I gratisutdraget får du följa den fiktiva Ellie bakom lånedisken.", preview: true },
  "/maskering-autism": { copy: "Läs scenen där Ellie sätter ihop en arbetsmin, repliker och ett sätt att verka som hemma på sin första dag bakom lånedisken.", preview: true },
  "/sen-autismdiagnos-hos-kvinnor": { copy: "Ellies fiktiva vardag ger en bild av skillnaden mellan vad andra ser och hur mycket kraft en arbetsdag kan kräva." },
  "/autistisk-utmattning": { copy: "Hos Ellie kan en vänlig min på jobbet dölja en arbetsdag som tar all ork. En illustrerad berättelse om sådant som sällan syns utåt." },
  "/autism-och-social-trotthet": { copy: "Bläddra till Ellies telefonsamtal och middagens sex röster. I utdraget får du följa båda situationerna inifrån.", preview: true },
  "/autism-och-relationer": { copy: "I Ellies berättelse ryms en första kyss under en läckande markis och den svårare frågan om hur man visar att man vill vara nära." },
  "/autism-och-sensorisk-kanslighet": { copy: "Följ med Ellie till mataffären. Gratisutdraget visar vad en skrikande kundvagn och surrande kyldiskar kan göra med en alldeles vanlig handling.", preview: true },
  "/autism-och-rutiner": { copy: "Nycklarna är redan i handen när lördagens plan ändras. I utdraget får du läsa vad Ellie gör med resten av dagen.", preview: true },
  "/autism-och-vanskap": { copy: "Ellie lovar att ordna en födelsedagsmiddag åt sin vän Maja. Sedan ska hon svara på ett sms om efterrätt. Deras vänskap löper genom den illustrerade berättelsen." },
  "/audhd-sensorisk-kanslighet": { copy: "I gratisutdraget följer du Ellie genom en mataffär där kundvagnar och kyldiskar tar plats i varje beslut.", preview: true },
  "/audhd-och-aterhamtning": { copy: "Ellies arbetsdag ser ganska vanlig ut bakom lånedisken. I den illustrerade berättelsen får du se vad hon behöver göra för att orka resten av dagen." },
  "/autism-test": { copy: "Följ den fiktiva Ellie genom en arbetsdag och en middag som ser enkla ut på håll. E-boken skildrar hur det kan kännas inifrån." },
  "/autism-bok": { copy: "Ellie Linds illustrerade fiktion följer en ung kvinna genom jobb, vänskap och ändrade planer. Läs den för berättelsen och igenkänningen." },
};

export default function LiteAutismRecommendation({ afterResult = false, className = "", sourcePage }: {
  afterResult?: boolean;
  className?: string;
  sourcePage?: string;
}) {
  const placement = sourcePage ? recommendations[sourcePage] : undefined;
  if ((sourcePage && !placement) || !bookCheckoutEnabled(liteAutismEdition)) return null;
  const href = placement?.preview ? book.preview : book.path;
  const label = placement?.preview ? "Läs gratis utdrag" : "Läs om boken";
  const cover = bookDeliveryCover(book);

  return <aside aria-label={afterResult ? "Boktips efter autismtestet" : "Boktips"} className={`mt-8 rounded-2xl border border-[#d4e7f2] bg-[#eaf5fb] px-4 py-5 text-[#101b49] sm:px-6 ${className}`}>
    <div className="flex items-start gap-3 sm:items-center sm:gap-5">
      <Image {...cover} alt="" sizes="(max-width: 639px) 64px, 84px" className="h-auto w-16 shrink-0 rounded-sm shadow-sm sm:w-[84px]" />
      <div className="min-w-0">
        <h2 className="text-base font-semibold leading-tight sm:text-lg">{book.title}</h2>
        <p className="mt-1 text-sm">{book.author} · Illustrerad e-bok</p>
        <p className="mt-2 text-sm leading-relaxed">{placement?.copy ?? "Möt Ellie i en varm och självironisk fiktiv berättelse om livet med autism."}</p>
        <TrackedLink href={href} event={placement?.preview ? "book_preview_click" : "book_recommendation_click"} params={{
          source_page: sourcePage, destination_page: href, position: afterResult ? "test_result_recommendation" : "editorial_recommendation",
          product_id: book.product, product_name: book.title, cta_label: label,
        }} className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2">
          {label} <span aria-hidden="true" className="ml-2">→</span>
        </TrackedLink>
      </div>
    </div>
  </aside>;
}
