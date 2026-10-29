import Link from "next/link";
import type { Ref } from "react";
import { dimensionNames, dimensions, formatPercent, dimensionLevel, type Result } from "./model";
import { interpretation, profileAnalysis } from "./interpretation";
const section = "mt-8 space-y-4 rounded-2xl border border-neutral-200 p-5 leading-7 sm:p-6";
const link = "underline underline-offset-4 decoration-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-4";
export default function ReportView({ result, heading }: { result: Result; heading?: Ref<HTMLHeadingElement> }) { return <>
      <section data-flow="card" className={section} aria-labelledby="result-heading">
        <h2 id="result-heading" ref={heading} tabIndex={-1} className="text-2xl font-semibold outline-none">Din övergripande profil</h2>
        <p className="text-xl font-semibold">{result.level}</p><p className="text-4xl font-semibold tabular-nums">{formatPercent(result.percent)} %</p>
        <p className="text-sm text-neutral-600">Andel av självtestets möjliga poäng, inte en sannolikhet.</p>

        <p className="rounded-xl bg-neutral-50 p-4"><span className="block text-sm text-neutral-600">Profiltyp</span><strong>{result.profileType}</strong></p>
      </section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Din personliga analys</h2>{profileAnalysis(result).map((text,i) => <p key={i}>{text}</p>)}</section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Dina sex dimensionsresultat</h2><p className="text-sm text-neutral-600">Högre värden visar mer av de drag som frågorna mäter. För empati och ömsesidighet betyder ett högre värde större svårigheter.</p><div className="grid gap-3 sm:grid-cols-2">{dimensions.map(d => <div data-flow="inset" key={d} className="min-w-0 rounded-xl bg-neutral-50 p-4"><h3 className="font-semibold">{dimensionNames[d]}</h3><p className="mt-1 text-sm">{dimensionLevel(result.scores[d])} · {formatPercent(result.scores[d])} %</p><div className="mt-3 h-2 overflow-hidden rounded bg-neutral-200" aria-hidden="true"><div data-flow="fill" className="h-full rounded bg-neutral-700" style={{width: `${result.scores[d]}%`}} /></div></div>)}</div></section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Så kan områdena märkas i ditt liv</h2>{result.ranked.map(d => { const text = interpretation(result,d); return <div key={d} className="space-y-3 border-t border-neutral-200 pt-5"><h3 className="text-xl font-semibold">{dimensionNames[d]}</h3><p>{text.summary}</p><p><strong>I vardagen: </strong>{text.everyday}</p><p><strong>I nära relationer: </strong>{text.relationship}</p><p className="rounded-xl bg-neutral-50 p-4"><strong>Att reflektera över: </strong>{text.reflection}</p></div>; })}</section>
        <section data-flow="card" className={section}><h2 className="text-xl font-semibold">Ta med dig en konkret fråga</h2><p>Välj en situation som du kände igen dig i när du svarade. Vad hände, vad behövde du och vilket utrymme fick den andra personen? Börja med en liten förändring du själv kan påverka, till exempel att uttrycka ett önskemål tydligt eller lyssna färdigt innan du svarar.</p><Link href="/narcissism-sjalvtest" className={link}>Läs mer om de sex områdena</Link></section>
</>; }
