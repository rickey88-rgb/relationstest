import type { Metadata } from "next";
import { swedishToNorwegian } from "../../_content/market";
import { norwayIndexable } from "../../_lib/norwayLaunch.server";

export const site = "https://www.relationsvarning.se";

export function norwegianMetadata(path: string, title: string, description: string, options?: { article?: boolean; image?: string; private?: boolean }): Metadata {
  const swedish = Object.keys(swedishToNorwegian).find(key => swedishToNorwegian[key] === path);
  const index = norwayIndexable() && !options?.private;
  return {
    title: title + " | Relationsvarning",
    description,
    alternates: {
      canonical: site + path,
      ...(index && swedish ? { languages: { "nb-NO": site + path, "sv-SE": site + swedish } } : {}),
    },
    robots: { index, follow: !options?.private, googleBot: { index, follow: !options?.private, "max-image-preview": "large" } },
    openGraph: { title, description, url: site + path, siteName: "Relationsvarning", locale: "nb_NO", type: options?.article ? "article" : "website", ...(options?.image ? { images: [site + options.image] } : {}) },
  };
}

export function StructuredData({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
