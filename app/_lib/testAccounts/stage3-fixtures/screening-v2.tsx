// Original paid rendering frozen before stage 3; test reference only.
import Link from "next/link";
import type { Ref } from "react";
import { answerLabels, band, domainCopy, domains } from "../../../test/screening";
import type { ScreeningReport } from "../../../test/report";
const section = "mt-8 space-y-4 rounded-2xl border border-neutral-200 p-5 leading-7 sm:p-6";
const link = "underline underline-offset-4 decoration-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-4";
export default function Original({ result, heading }: { result: ScreeningReport; heading?: Ref<HTMLHeadingElement> }) { const { profile, analysis } = result; return <>
      {profile.safety && <aside data-flow="inset" aria-label="Stöd och säkerhet" className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6">
        <p><strong>Känner du dig otrygg i relationen?</strong> Du kan läsa om <Link href="/psykiskt-vald/hjalp" className={link}>stöd och hjälp</Link> här. Vid akut fara, ring 112.</p>
      </aside>}
        <section data-flow="card" className={section} aria-labelledby="result-heading"><h2 id="result-heading" ref={heading} tabIndex={-1} className="text-2xl font-semibold outline-none">Din analys</h2>{analysis.paragraphs.map((text,i) => <p key={i}>{text}</p>)}</section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Så hänger dina svar ihop</h2>{analysis.connections.map(item => <p key={item.id} data-insight={item.id}>{item.text}</p>)}</section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Det här sticker ut i dina svar</h2>
          {analysis.observations.map(item => <div key={item.domain} className="space-y-3 border-t border-neutral-200 pt-4"><h3 className="text-xl font-semibold">{item.heading}</h3><p>{item.text}</p><p className="rounded-xl bg-neutral-50 p-3 text-sm">Ett konkret svar: ”{item.marker.text}” — {answerLabels[item.marker.value]}.</p><p>{item.reflection}</p><Link href={item.guide} className={link}>{item.guideLabel}</Link></div>)}
          {analysis.zero && <><p>Inget av de efterfrågade mönstren finns rapporterat. Vad fick dig att söka testet: ett behov, en enskild situation eller något som frågorna inte tog upp?</p><p>Fundera på vad du själv upplever fungerar, till exempel utrymme för egna val, privatliv och ett nej utan rädsla. Det är sådant du kan vilja bevara.</p><Link href="/beteenden" className={link}>Utforska guiden om beteenden i relationer</Link></>}
        </section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Vad kan du göra med resultatet?</h2><ol className="list-decimal space-y-4 pl-5">{analysis.nextSteps.map(text => <li key={text}>{text}</li>)}</ol></section>
        <section data-flow="card" className={section}><h2 className="text-xl font-semibold">Din fullständiga profil</h2><div className="grid gap-3 sm:grid-cols-2">{domains.map(domain => {
          const level = profile.scores[domain] >= 65 ? 4 : profile.scores[domain] >= 45 ? 3 : profile.scores[domain] >= 25 ? 2 : 1;
          return <div data-flow="inset" key={domain} className="min-w-0 rounded-xl bg-neutral-50 p-3"><h3 className="text-sm font-semibold">{domainCopy[domain].label}</h3><p className="mt-1 text-sm text-neutral-600">{band(profile.scores[domain])}</p><div className="mt-2 flex gap-1" aria-hidden="true">{[1,2,3,4].map(part => <span key={part} className={`h-1 flex-1 rounded ${part <= level ? "bg-neutral-500" : "bg-neutral-200"}`} />)}</div></div>;
        })}</div></section>
      <section className="mt-8 space-y-2 text-sm leading-6 text-neutral-600"><h2 className="font-semibold text-neutral-900">Om resultatet</h2><p>Screeningen är ett reflektionsverktyg baserat på dina egna svar. Den ställer inte diagnoser och avgör inte juridiskt om ett brott har begåtts.</p><Link href="/metodik" className={link}>Läs om metodiken</Link></section></>; }
