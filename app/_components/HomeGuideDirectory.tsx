"use client";

import { useState } from "react";
import Link from "next/link";

export type HomeGuide = { href: string; label: string; group: string };

const featuredHrefs = [
  "/psykiskt-vald",
  "/kontrollerande-relation",
  "/gaslighting-relation",
  "/silent-treatment-relation",
  "/love-bombing-relation",
  "/destruktivt-forhallande",
  "/manipulativ-partner",
  "/traumabindning-i-relation",
];

export default function HomeGuideDirectory({ guides }: { guides: HomeGuide[] }) {
  const [expanded, setExpanded] = useState(false);
  const featured = featuredHrefs.flatMap((href) => guides.filter((guide) => guide.href === href));
  const remaining = guides.filter((guide) => !featuredHrefs.includes(guide.href));
  const groups = [...new Set(remaining.map((guide) => guide.group))];
  const linkClass = "inline-flex min-h-11 items-center underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700";

  return (
    <>
      <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
        {featured.map((guide) => <li key={guide.href}><Link href={guide.href} className={linkClass}>{guide.label}</Link></li>)}
      </ul>

      <div id="all-guides" hidden={!expanded} className="mt-7 space-y-7 border-t border-neutral-200/70 pt-7">
        {groups.map((group) => (
          <section key={group} aria-labelledby={`guide-group-${group.replaceAll(" ", "-").toLowerCase()}`}>
            <h4 id={`guide-group-${group.replaceAll(" ", "-").toLowerCase()}`} className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">{group}</h4>
            <ul className="mt-2 grid gap-x-8 sm:grid-cols-2">
              {remaining.filter((guide) => guide.group === group).map((guide) => <li key={guide.href}><Link href={guide.href} className={linkClass}>{guide.label}</Link></li>)}
            </ul>
          </section>
        ))}
      </div>

      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="all-guides"
        onClick={() => setExpanded((value) => !value)}
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
      >
        {expanded ? "Visa färre guider" : "Visa alla guider"}
      </button>
    </>
  );
}
