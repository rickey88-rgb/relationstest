import { testConfig } from "../_analytics/config";
import { guideRecommendations } from "./guideRecommendations";
import TrackedLink from "./TrackedLink";

export default function GuideNextSteps({ sourcePage }: { sourcePage: string }) {
  const item = guideRecommendations[sourcePage];
  if (!item) return null;
  const related = item.related.filter((link) => link.href !== sourcePage).slice(0, 2);
  if (!related.length && !item.test) return null;

  return <section data-rv="panel" aria-labelledby="guide-next-steps" className="mt-12 min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-neutral-900 sm:p-7">
    <h2 id="guide-next-steps" className="text-2xl font-semibold tracking-tight">Nästa steg</h2>
    {related.length > 0 && <div className="mt-5">
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">Relaterat</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">{related.map((link, index) => <TrackedLink key={link.href} href={link.href} event="related_guide_click" params={{ source_page: sourcePage, destination_page: link.href, position: index + 1 }} className="rv-card block min-w-0 rounded-xl border border-neutral-200 bg-white p-4 hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6B4F]">
        <span className="font-semibold">{link.title} <span aria-hidden="true">→</span></span>
        <span className="mt-1 block text-sm leading-6 text-neutral-600">{link.description}</span>
      </TrackedLink>)}</div>
    </div>}
    {item.test && <div className="mt-6 border-t border-neutral-200 pt-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">Vill du undersöka din egen situation?</p>
      <h3 className="mt-2 text-lg font-semibold">{item.test.title}</h3>
      <p className="mt-2 leading-7 text-neutral-700">{item.test.description}</p>
      <TrackedLink href={testConfig[item.test.testId].path} event="guide_to_test_click" params={{ source_page: sourcePage, destination_test: item.test.testId, cta_label: item.test.label }} className="rv-button mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#2F6B4F] px-5 py-3 text-center font-semibold text-white hover:bg-[#285C44] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2F6B4F] sm:w-auto">{item.test.label}</TrackedLink>
    </div>}
  </section>;
}
