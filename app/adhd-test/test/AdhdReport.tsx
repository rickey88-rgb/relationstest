import type { Ref } from "react";
import { areaNames, areas, formatPercent, type Result } from "./model";
import { describeArea, impactText, standoutText } from "./interpretation";
import { levelTexts, profileTexts } from "./copy";
const section = "mt-8 space-y-4 rounded-2xl border border-neutral-200 p-5 leading-7 sm:p-6";
const link = "underline underline-offset-4 decoration-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-4";
export default function AdhdReport({ result, heading }: { result: Result; heading?: Ref<HTMLHeadingElement> }) {
  return <>
        <section data-flow="card" className={section} aria-labelledby="result-heading"><h2 id="result-heading" ref={heading} tabIndex={-1} className="text-2xl font-semibold outline-none">Din samlade profil</h2>
          <p className="text-xl font-semibold">{result.level}</p><p className="text-4xl font-semibold tabular-nums">{formatPercent(result.symptomIndex)} / 100</p>
          <p className="text-sm text-neutral-600">Symptomindex för fem områden. Detta är självskattningspoäng, inte sannolikheten att ha ADHD.</p>
          <p>{levelTexts[result.level]}</p>
          {result.impactModifier !== "standard" && <p>{impactText(result).title}. {impactText(result).text}</p>}
        </section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Det som sticker ut mest</h2><p>{standoutText(result)}</p></section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Dina sex delresultat</h2><div className="grid gap-3 sm:grid-cols-2">{areas.map(area => <div data-flow="inset" key={area} className="min-w-0 space-y-3 rounded-xl bg-neutral-50 p-4"><h3 className="font-semibold">{areaNames[area]}</h3><p className="tabular-nums">{formatPercent(result.scores[area])} / 100</p><div className="h-2 overflow-hidden rounded bg-neutral-200" aria-hidden="true"><div data-flow="fill" className="h-full rounded bg-neutral-700" style={{ width: result.scores[area] + "%" }} /></div><p>{describeArea(area, result.scores[area])}</p></div>)}</div></section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Din profiltyp</h2><h3 className="text-xl font-semibold">{result.profileType}</h3><p>{profileTexts[result.profileType]}</p><p className="text-sm text-neutral-600">Profilen är en beskrivning inom detta självtest, inte en klinisk diagnos eller en officiell ADHD-subtyp.</p></section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Vardagspåverkan</h2><h3 className="text-xl font-semibold">{impactText(result).title}</h3><p>{impactText(result).text}</p></section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Det som talar för ADHD-liknande mönster</h2>{result.supporting.length ? <ul className="list-disc space-y-3 pl-5">{result.supporting.map(text => <li key={text}>{text}</li>)}</ul> : <p>Dina svar ger inte tydligt stöd för de kombinationer av förhöjda områden, vardagspåverkan eller tidigare svårigheter som den här modellen lyfter fram.</p>}</section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Det som gör bilden mindre entydig</h2>{result.lessClear.length ? <ul className="list-disc space-y-3 pl-5">{result.lessClear.map(text => <li key={text}>{text}</li>)}</ul> : <p>Inga av modellens särskilda dämpande faktorer framträder i dina svar. Det betyder inte att andra förklaringar har uteslutits.</p>}</section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Andra möjliga förklaringar</h2><p>Liknande svårigheter kan också förekomma vid exempelvis långvarig stress, sömnbrist, ångest, depression eller annan belastning. Resultatet bör därför ses som en strukturerad självskattning, inte som en diagnos.</p></section>
        <p className="mt-8 text-sm leading-6 text-neutral-600">Det här resultatet ställer ingen diagnos. Om svårigheterna påverkar vardagen tydligt och har funnits under lång tid kan en professionell bedömning vara relevant. <a href="https://www.1177.se/sjukdomar--besvar/hjarna-och-nerver/neuropsykiatriska-funktionsnedsattningar/adhd/" className={link}>Läs om ADHD och att söka stöd på 1177.</a></p>

  </>;
}
