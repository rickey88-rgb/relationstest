"use client";
import { usePathname } from "next/navigation";
import { norwegian, swedishToNorwegian } from "../_content/market";

export default function NorwegianSwitch() {
  const path = usePathname();
  return <a href={swedishToNorwegian[path] ?? norwegian.test} lang="nb-NO" hrefLang="nb-NO" className="inline-flex min-h-11 items-center px-2 text-xs underline underline-offset-4">Norsk</a>;
}
