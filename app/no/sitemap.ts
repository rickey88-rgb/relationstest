import type { MetadataRoute } from "next";
import { norwegian } from "../_content/market";
import { norwegianGuides } from "../_content/norwegianGuides";
import { norwayIndexable } from "../_lib/norwayLaunch.server";
import { site } from "./_components/norwegianSeo";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!norwayIndexable()) return [];
  return [norwegian.test, norwegian.book, ...Object.keys(norwegianGuides).map(slug => `/no/${slug}`)]
    .map(path => ({ url: site + path }));
}
