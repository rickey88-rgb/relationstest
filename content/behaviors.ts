import data from "./behaviors.json";

export type ContentSection = { heading: string; paragraphs: string[] };
export type ContentLink = { href: string; label: string };
export type Behavior = {
  slug: string;
  group: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  directAnswer: string;
  urgent?: { heading: string; text: string };
  sections?: ContentSection[];
  examples?: string[];
  warningSigns?: string[];
  normalVsProblematic?: { normal: string; problematic: string };
  whyItMatters?: string;
  whatYouCanDo: string[];
  importantContext?: string;
  relatedBehaviors: string[];
  relatedGuides: string[];
  primaryTest?: ContentLink;
  sources: string[];
};

export const behaviors: Behavior[] = data;
export const findBehavior = (slug: string) => behaviors.find((page) => page.slug === slug);
export const canonicalHost = "https://www.relationsvarning.se";

export const guideLabels: Record<string, string> = {
  "/digitalt-vald": "Digitalt våld och övervakning",
  "/ekonomiskt-vald": "Ekonomiskt våld och ekonomisk kontroll",
  "/kontrollerande-relation": "Kontrollerande partner – tecken och gränser",
  "/psykiskt-vald": "Psykiskt våld – en översikt",
  "/psykiskt-vald/vad-raknas-som": "Vad räknas som psykiskt våld?",
  "/psykiskt-vald/hjalp": "Stöd och hjälp vid psykiskt våld",
  "/gaslighting-relation": "Gaslighting i relationer",
  "/silent-treatment-relation": "Silent treatment och bestraffande tystnad",
};

export const sources: Record<string, ContentLink> = {
  violence: {
    href: "https://www.1177.se/liv--halsa/vald-overgrepp-och-sexuella-trakasserier/att-bli-utsatt-for-vald-i-nara-relationer/",
    label: "1177: Att bli utsatt för våld i nära relationer",
  },
  digital: {
    href: "https://jamstalldhetsmyndigheten.se/mans-vald-mot-kvinnor/information-om-valdsutsatthet/digitala-dimensioner-av-vald/",
    label: "Jämställdhetsmyndigheten: Digitala dimensioner av våld",
  },
  economic: {
    href: "https://jamstalldhetsmyndigheten.se/mans-vald-mot-kvinnor/information-om-valdsutsatthet/ekonomiskt-vald/",
    label: "Jämställdhetsmyndigheten: Ekonomiskt våld",
  },
  suicide: {
    href: "https://www.1177.se/sjukdomar--besvar/psykiska-sjukdomar-och-besvar/sjalvmordstankar/hur-kan-du-hjalpa-en-person-som-har-sjalvmordstankar/",
    label: "1177: Hur kan du hjälpa en person som har självmordstankar?",
  },
  bankid: {
    href: "https://www.bankid.com/privat/taenk-pa-saekerheten/id-kapning",
    label: "BankID: Säkerhet och ID-kapning",
  },
  budget: {
    href: "https://www.konsumentverket.se/ekonomi/kommunal-budget-och-skuldradgivning/",
    label: "Konsumentverket: Kommunal budget- och skuldrådgivning",
  },
};

// Fail the build on editorial references that would otherwise create broken links.
const slugs = new Set(behaviors.map((page) => page.slug));
if (slugs.size !== behaviors.length) throw new Error("Duplicate behavior slug");
for (const page of behaviors) {
  if (page.relatedBehaviors.some((slug) => !slugs.has(slug) || slug === page.slug)) {
    throw new Error(`Invalid related behavior on ${page.slug}`);
  }
  if (page.relatedGuides.some((href) => !guideLabels[href]) || page.sources.some((id) => !sources[id])) {
    throw new Error(`Invalid guide or source on ${page.slug}`);
  }
}
