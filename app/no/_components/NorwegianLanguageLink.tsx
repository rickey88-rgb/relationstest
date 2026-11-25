"use client";

import { usePathname } from "next/navigation";
import { norwegian, swedishToNorwegian } from "../../_content/market";

export function NorwegianLanguageLink({ placement = "header" }: { placement?: "header" | "footer" }) {
  const pathname = usePathname();
  const isTestLanding = pathname === norwegian.test;
  if (isTestLanding !== (placement === "footer")) return null;
  const swedish = Object.keys(swedishToNorwegian).find(path => swedishToNorwegian[path] === pathname) ?? "/audhd-test";
  return <a href={swedish} lang="sv" hrefLang="sv-SE" className={placement === "footer" ? "inline-flex min-h-11 items-center text-xs text-neutral-600 underline underline-offset-4" : "py-3 underline underline-offset-4"}>Svenska</a>;
}
