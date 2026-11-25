"use client";

import { usePathname } from "next/navigation";
import { swedishToNorwegian } from "../../_content/market";

export function NorwegianLanguageLink() {
  const pathname = usePathname();
  const swedish = Object.keys(swedishToNorwegian).find(path => swedishToNorwegian[path] === pathname) ?? "/audhd-test";
  return <a href={swedish} lang="sv" hrefLang="sv-SE" className="py-3 underline underline-offset-4">Svenska</a>;
}
