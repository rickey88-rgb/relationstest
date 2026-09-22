import type { Metadata } from "next";
import { getArticleImageMetadata, getArticleImageSchema } from "./articleImages";

const SITE_URL = "https://www.relationsvarning.se";

type EditorialSeoInput = {
  route: `/${string}`;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
};

export function getEditorialMetadata({ route, title, description }: EditorialSeoInput): Metadata {
  const url = `${SITE_URL}${route}`;
  const imageMetadata = getArticleImageMetadata(route);
  const openGraphImages = imageMetadata.openGraph?.images;
  const twitterImages = imageMetadata.twitter?.images;

  return {
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      ...(openGraphImages ? { images: openGraphImages } : {}),
    },
    twitter: {
      card: twitterImages ? "summary_large_image" : "summary",
      title,
      description,
      ...(twitterImages ? { images: twitterImages } : {}),
    },
  };
}

export function getEditorialArticleSchema({ route, title, description, datePublished, dateModified }: EditorialSeoInput) {
  const url = `${SITE_URL}${route}`;
  const image = getArticleImageSchema(route);
  const organization = { "@type": "Organization", name: "Relationsvarning", url: SITE_URL };

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished,
    dateModified,
    author: organization,
    publisher: organization,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(image ? { image } : {}),
  };
}

export function EditorialArticleJsonLd({ data }: { data: ReturnType<typeof getEditorialArticleSchema> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
