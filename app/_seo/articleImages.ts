import type { Metadata } from "next";

const SITE_URL = "https://www.relationsvarning.se";

export type ArticleImagePlan = {
  route: `/${string}`;
  priority: number;
  concept: string;
  heading: string;
  alt: string;
  fileName: `${string}.webp`;
  placement: string;
  aspectRatio: "4:5";
  useAsOpenGraph: boolean;
  width: number;
  height: number;
  ogImage?: {
    heading: string;
    brief: string;
    fileName: `${string}.webp`;
    width: 1200;
    height: 630;
    /** Set only after the reviewed OG export exists in public/seo-images. */
    sourcePath?: `/seo-images/${string}`;
  };
  /** Set only after the reviewed asset exists in public/seo-images. */
  sourcePath?: `/seo-images/${string}`;
};

export type PublishedArticleImage = ArticleImagePlan & {
  sourcePath: `/seo-images/${string}`;
};

export const articleImagePlans: readonly ArticleImagePlan[] = [
  { route: "/gaslighting-relation", priority: 1, concept: "Ett vertikalt femstegsflöde uppifrån och ned: 1. Något händer. 2. Händelsen förnekas eller förvrängs. 3. Du börjar tvivla på ditt eget minne. 4. Du söker mer bekräftelse. 5. Den andres version får större makt.", heading: "Gaslighting – hur mönstret kan utvecklas", alt: "Vertikalt femstegsdiagram över hur gaslighting kan utvecklas från en händelse och förnekande till självtvivel, bekräftelsesökande och ökad makt för den andres version", fileName: "gaslighting-hur-monstret-kan-utvecklas.webp", placement: "Efter definitionen och före listan med tecken.", aspectRatio: "4:5", useAsOpenGraph: true, width: 1200, height: 1500, ogImage: { heading: "Gaslighting – hur mönstret kan utvecklas", brief: "Stor rubrik och en förenklad antydan till förnekande, självtvivel och förskjuten makt. Högst tre korta stödpunkter; inga små etiketter. Samma grafit-, varmvit- och dämpat gröna identitet som artikelbilden, komponerad för liten social preview.", fileName: "gaslighting-hur-monstret-kan-utvecklas-og.webp", width: 1200, height: 630 } },
  { route: "/psykisk-misshandel-relation", priority: 2, concept: "En vertikal översikt med fem stora block: kontroll, isolering, nedvärdering, hot och förskjutet ansvar.", heading: "Mönster som kan ingå i psykisk misshandel", alt: "Översikt över mönster vid psykisk misshandel som kontroll, isolering, nedvärdering, hot och ansvarsförskjutning", fileName: "psykisk-misshandel-monster-oversikt.webp", placement: "Efter introduktionen och före den första längre teckensektionen.", aspectRatio: "4:5", useAsOpenGraph: true, width: 1200, height: 1500 },
  { route: "/kontrollerande-relation", priority: 3, concept: "En vertikal modell med högst fem stora block där närliggande kontrollområden grupperas, exempelvis socialt liv och telefon, ekonomi, tid, kläder samt beslut.", heading: "Kontroll kan synas på flera områden", alt: "Diagram över vanliga områden för kontroll i en relation: socialt liv, telefon, ekonomi, kläder, tid och beslut", fileName: "kontrollerande-relation-omraden.webp", placement: "Efter sidans definition och tidiga CTA, före teckenlistan.", aspectRatio: "4:5", useAsOpenGraph: true, width: 1200, height: 1500 },
  { route: "/love-bombing-relation", priority: 4, concept: "Ett vertikalt femstegsflöde från intensiv uppmärksamhet via snabb anknytning och kontroll till distans och en ny intensiv fas.", heading: "När intensiv uppmärksamhet blir ett återkommande mönster", alt: "Processdiagram över love bombing från intensiv uppmärksamhet och snabb anknytning till kontroll, distans och ny intensiv fas", fileName: "love-bombing-cykel-intensitet-kontroll.webp", placement: "Efter definitionen och före de tio tecknen.", aspectRatio: "4:5", useAsOpenGraph: true, width: 1200, height: 1500 },
  { route: "/traumabindning-i-relation", priority: 5, concept: "En vertikal femstegssekvens: spänning, konflikt eller kränkning, försoning, lättnad och ny spänning.", heading: "Cykeln som kan förstärka en traumabindning", alt: "Cirkeldiagram över traumabindning med spänning, konflikt, försoning, lättnad och ny spänning", fileName: "traumabindning-cykel-spanning-forsoning.webp", placement: "Efter förklaringen av begreppet och före tecken eller mekanismer.", aspectRatio: "4:5", useAsOpenGraph: true, width: 1200, height: 1500 },
  { route: "/silent-treatment-relation", priority: 6, concept: "En vertikal jämförelse i fyra stora block mellan en uttalad paus för reglering och tystnad som används för att straffa eller kontrollera.", heading: "Paus eller silent treatment?", alt: "Jämförelse mellan en trygg kommunikationspaus och silent treatment som skapar osäkerhet eller kontroll", fileName: "silent-treatment-paus-eller-kontroll.webp", placement: "Efter definitionen och före listan med kännetecken.", aspectRatio: "4:5", useAsOpenGraph: true, width: 1200, height: 1500 },
  { route: "/narcissist-i-en-relation", priority: 7, concept: "En vertikal beteendemodell i fyra stora steg: idealisering, krav på anpassning, nedvärdering och återkommande återkoppling.", heading: "Ett återkommande relationsmönster", alt: "Diagram över ett narcissistiskt relationsmönster med idealisering, anpassning, nedvärdering och återkoppling", fileName: "narcissistisk-relation-monster.webp", placement: "Efter introduktionen, innan de konkreta relationsmönstren.", aspectRatio: "4:5", useAsOpenGraph: true, width: 1200, height: 1500 },
  { route: "/manipulativ-partner", priority: 8, concept: "En vertikal översikt med fem stora block: skuld, förvirring, press, förnekande och växlande närhet.", heading: "Hur manipulation kan påverka handlingsutrymmet", alt: "Översikt över manipulation genom skuld, förvirring, press, förnekande och växlande närhet", fileName: "manipulativ-partner-paverkansmonster.webp", placement: "Efter definitionen och före exemplen.", aspectRatio: "4:5", useAsOpenGraph: true, width: 1200, height: 1500 },
  { route: "/psykiskt-vald", priority: 9, concept: "En vertikal skala med högst fem tydliga nivåer från subtil begränsning till systematisk kontroll, med markering att allvar inte avgörs av en enskild händelse.", heading: "Psykiskt våld kan bestå av flera samverkande mönster", alt: "Pedagogisk översikt över hur begränsning, hot, isolering och kontroll kan samverka vid psykiskt våld", fileName: "psykiskt-vald-samverkande-monster.webp", placement: "Efter inledande definition och säkerhetsinformation.", aspectRatio: "4:5", useAsOpenGraph: true, width: 1200, height: 1500 },
  { route: "/vald-i-nara-relation", priority: 10, concept: "En vertikal översikt med fem stora block där former av våld och kontroll grupperas och följs av en tydlig väg till stöd.", heading: "Våld i nära relationer kan ta flera former", alt: "Översikt över psykiskt, fysiskt, sexuellt, ekonomiskt och digitalt våld samt vägar till stöd", fileName: "vald-i-nara-relation-former-och-stod.webp", placement: "Efter akut säkerhetsinformation, före fördjupande innehåll.", aspectRatio: "4:5", useAsOpenGraph: true, width: 1200, height: 1500 },
  { route: "/anknytning", priority: 11, concept: "Fyra stora vertikalt staplade block för trygga och otrygga anknytningsmönster, beskrivna som mönster och inte fasta identiteter.", heading: "Fyra vanliga anknytningsmönster", alt: "Fyrfältsdiagram över trygg, ängslig, undvikande och desorganiserad anknytning", fileName: "anknytning-fyra-monster.webp", placement: "Efter begreppsförklaringen och före fördjupningen om mönstren.", aspectRatio: "4:5", useAsOpenGraph: true, width: 1200, height: 1500 },
  { route: "/medberoende-i-relation", priority: 12, concept: "En vertikal fyrastegssekvens där ansvarstagande, anpassning, kort lättnad och nya krav förstärker varandra.", heading: "Hur ett medberoendemönster kan hållas igång", alt: "Cirkeldiagram över medberoende med ansvarstagande, anpassning, kort lättnad och nya krav", fileName: "medberoende-relation-kretslopp.webp", placement: "Efter definitionen och före teckenlistan.", aspectRatio: "4:5", useAsOpenGraph: true, width: 1200, height: 1500 },
  { route: "/adhd-symtom-vuxna", priority: 13, concept: "En vertikal översikt med fem stora block där aktivitet och impulsivitet grupperas: uppmärksamhet, aktivitet och impulsivitet, tidsuppfattning, organisering samt känsloreglering.", heading: "Områden där ADHD-symtom kan märkas i vuxenlivet", alt: "Diagram över sex områden där ADHD-symtom kan märkas hos vuxna", fileName: "adhd-symtom-vuxna-sex-omraden.webp", placement: "Efter introduktionen och före symtomgenomgången.", aspectRatio: "4:5", useAsOpenGraph: true, width: 1200, height: 1500 },
  { route: "/autism-symtom-vuxna", priority: 14, concept: "En vertikal översikt med fem stora block där specialintressen och rutiner grupperas: social kommunikation, sinnesintryck, rutiner och intressen, återhämtning samt maskering.", heading: "Områden där autistiska drag kan märkas", alt: "Diagram över områden där autistiska drag kan märkas hos vuxna, inklusive sinnesintryck, rutiner och maskering", fileName: "autism-symtom-vuxna-omraden.webp", placement: "Efter introduktionen och före den detaljerade symtomgenomgången.", aspectRatio: "4:5", useAsOpenGraph: true, width: 1200, height: 1500 },
  { route: "/adhd-och-relationer", priority: 15, concept: "Ett vertikalt fyrastegsflöde från missad signal via tolkning och reaktion till konflikt, med tydliga brytpunkter.", heading: "När vardagssvårigheter blir ett relationsmönster", alt: "Processdiagram över hur en missad signal kan leda till tolkning, reaktion och konflikt i en relation med ADHD", fileName: "adhd-relationer-samspelsmonster.webp", placement: "Efter introduktionen och före exemplen på vardagspåverkan.", aspectRatio: "4:5", useAsOpenGraph: true, width: 1200, height: 1500 },
  { route: "/maskering-autism", priority: 16, concept: "En vertikal före-under-efter-modell i tre stora block: förberedelse, social anpassning och återhämtningsbehov.", heading: "Maskering före, under och efter sociala situationer", alt: "Processdiagram över autismmaskering med förberedelse, social anpassning och återhämtning", fileName: "maskering-autism-process.webp", placement: "Efter definitionen och före tecken eller konsekvenser.", aspectRatio: "4:5", useAsOpenGraph: true, width: 1200, height: 1500 },
  { route: "/destruktivt-forhallande", priority: 17, concept: "En vertikal jämförelse i fyra stora block mellan enstaka konflikt och ett återkommande destruktivt mönster: ansvar, reparation, rädsla och handlingsutrymme.", heading: "Konflikt eller destruktivt mönster?", alt: "Jämförelse mellan enstaka relationskonflikt och ett återkommande destruktivt förhållande", fileName: "destruktivt-forhallande-konflikt-eller-monster.webp", placement: "Efter definitionen och före teckenlistan.", aspectRatio: "4:5", useAsOpenGraph: false, width: 1200, height: 1500 },
  { route: "/svartsjuk-partner", priority: 18, concept: "En vertikal fyrastegstrappa från känsla och behov av bekräftelse till övervakning, begränsningar och kontroll.", heading: "När svartsjuka övergår i kontroll", alt: "Stegdiagram över hur svartsjuka kan utvecklas från bekräftelsebehov till övervakning och kontroll", fileName: "svartsjuk-partner-fran-kansla-till-kontroll.webp", placement: "Efter introduktionen och före konkreta tecken.", aspectRatio: "4:5", useAsOpenGraph: false, width: 1200, height: 1500 },
] as const;

export function getArticleImagePlan(route: string) {
  return articleImagePlans.find((image) => image.route === route);
}

export function getPublishedArticleImage(route: string): PublishedArticleImage | undefined {
  const image = getArticleImagePlan(route);
  return image?.sourcePath ? (image as PublishedArticleImage) : undefined;
}

export function getArticleImageMetadata(route: string): Pick<Metadata, "openGraph" | "twitter"> {
  const image = getPublishedArticleImage(route);
  const ogImage = image?.ogImage;
  if (!image?.useAsOpenGraph || !ogImage?.sourcePath) return {};
  const url = `${SITE_URL}${ogImage.sourcePath}`;
  return {
    openGraph: { images: [{ url, width: ogImage.width, height: ogImage.height, alt: image.alt }] },
    twitter: { card: "summary_large_image", images: [{ url, alt: image.alt }] },
  };
}

export function getArticleImageSchema(route: string) {
  const image = getPublishedArticleImage(route);
  if (!image) return undefined;
  return {
    "@type": "ImageObject",
    url: `${SITE_URL}${image.sourcePath}`,
    width: image.width,
    height: image.height,
    caption: image.heading,
  };
}
