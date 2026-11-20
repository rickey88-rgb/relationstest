"use client";
import {useEffect,useLayoutEffect,useRef,useState} from "react";
import Link from "next/link";
import Fingerprint from "../persona/_components/Fingerprint";
import {CHAPTERS} from "../persona/_domain/versions";
import {questions} from "../persona/_domain/v3/questions";
import PersonaJourney from "../persona/test/PersonaJourney";
import PersonaQuestion from "../persona/test/PersonaQuestion";
import PersonaPaywall from "../persona/test/PersonaPaywall";
import styles from "../persona/persona.module.css";
import supplements from "./supplements.module.css";
import {analyzePersonaV61,type V61Preview} from "./actions";
import {emptyDraft,restoreDraft,serializeDraft,submissionFor,type Draft} from "./draft";
import {V61_STORAGE_KEY} from "./constants";

export default function PersonaV61Flow(){
  const [draft,setDraft]=useState<Draft>(emptyDraft);
  const [hydrated,setHydrated]=useState(false);
  const [notice,setNotice]=useState("");
  const [pending,setPending]=useState(false);
  const [preview,setPreview]=useState<{key:string;value:V61Preview}|null>(null);
  const [error,setError]=useState(false);
  const [retry,setRetry]=useState(0);
  const [extra,setExtra]=useState<Record<string,string>>({});
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null),lock=useRef(false);
  const heading=useRef<HTMLHeadingElement>(null);
  const current=useRef(draft);
  useLayoutEffect(()=>{current.current=draft;},[draft]);
  /* eslint-disable react-hooks/set-state-in-effect -- One-time hydration and write failures synchronize the external browser-owned draft. */
  useEffect(()=>{
    try {const raw=localStorage.getItem(V61_STORAGE_KEY);if(raw){const restored=restoreDraft(raw);setDraft(restored);setExtra(restored.supplement);}}
    catch {setNotice("Tidigare svar kunde inte återställas. Du kan börja en ny omgång här.");}
    setHydrated(true);
    return ()=>{if(timer.current)clearTimeout(timer.current);};
  },[]);
  useEffect(()=>{
    if(!hydrated)return;
    try{localStorage.setItem(V61_STORAGE_KEY,serializeDraft(draft));}
    catch{setNotice("Svaren kan inte sparas i den här webbläsaren. Du kan fortsätta, men lämna inte sidan.");}
  },[draft,hydrated]);
  /* eslint-enable react-hooks/set-state-in-effect */
  useLayoutEffect(()=>{heading.current?.focus({preventScroll:true});},[draft.phase,draft.cursor]);
  const requestKey=draft.phase==="result"?JSON.stringify(submissionFor(draft)):"";
  useEffect(()=>{
    if(!requestKey)return;
    let active=true;
    analyzePersonaV61(JSON.parse(requestKey)).then(value=>{
      if(active){setPreview({key:requestKey,value});setError(false);}
    }).catch(()=>{if(active)setError(true);});
    return ()=>{active=false;};
  },[requestKey,retry]);
  const result=preview?.key===requestKey?preview.value:null;
  function cancel(){if(timer.current)clearTimeout(timer.current);timer.current=null;lock.current=false;setPending(false);}
  function advance(){
    const d=current.current;if(d.answers[d.cursor]===null)return;
    const next=d.cursor+1;
    setDraft({...d,cursor:Math.min(next,39),phase:next===40?"result":next%10===0?"chapter":"question"});
    lock.current=false;setPending(false);timer.current=null;
  }
  function select(value:number){
    if(lock.current)return;
    setDraft(d=>({...d,answers:d.answers.map((a,i)=>i===d.cursor?value:a),supplement:{}}));
    setPreview(null);setExtra({});setError(false);
  }
  function answer(value:number){
    if(lock.current)return;
    select(value);lock.current=true;setPending(true);
    // One timer, synchronously locked; Back cancels it and no effect schedules navigation.
    timer.current=setTimeout(advance,350);
  }
  function back(){
    cancel();setPreview(null);setError(false);
    setDraft(d=>({...d,cursor:d.phase==="result"?39:Math.max(0,d.cursor-1),phase:d.phase!=="result"&&d.cursor===0?"chapter":"question",supplement:{}}));
    setExtra({});
  }
  function restart(){
    if(!window.confirm("Radera de lokala svaren för den här omgången och börja om?"))return;
    cancel();setDraft(emptyDraft());setPreview(null);setExtra({});setError(false);
  }
  if(!hydrated)return <p className={styles.flowLoading} role="status">Din resa förbereds.</p>;
  const chapter=CHAPTERS[Math.floor(draft.cursor/10)];
  if(draft.phase==="landing")return <section className={styles.hero}>
    <Fingerprint className={styles.fingerprint}/><p className={styles.eyebrow}>40 påståenden · Fyra kapitel</p>
    <h1 className={styles.heroTitle}><span>PERSONA</span><em>Vem är du egentligen?</em></h1>
    <p className={styles.heroLead}>Lär känna dina mönster, dina styrkor och vad som hjälper dig framåt.</p>
    <p className={styles.heroDescription}>En personlig insikt utan kostnad. När underlaget räcker kan du välja hela porträttet för 79 kr. Ingen registrering krävs.</p>
    <button className={styles.primary} onClick={()=>setDraft(d=>({...d,phase:"chapter"}))}>Upptäck din personlighet →</button>
    {notice&&<p role="status">{notice}</p>}
  </section>;
  if(draft.phase!=="result")return <PersonaJourney homePath="/persona-v61" chapter={chapter.id} chapterTitle={chapter.title}
    count={draft.answers.filter(a=>a!==null).length} questionStep={draft.phase==="question"} entering={false} onBack={back}
    notice={notice} viewKey={draft.phase+"-"+draft.cursor} transition="idle"
    footer={<details><summary>Svar och lokal sparning</summary><p>Svaren finns kvar i den här webbläsaren. För analys skickas de till servern utan beständig lagring. Vid köp sparas de krypterat efter ditt samtycke. På en delad enhet kan andra se lokala svar.</p><button onClick={restart}>Radera och börja om</button></details>}>
    {draft.phase==="chapter"?<section className={styles.chapterIntro} data-persona-chapter>
      <p className={styles.eyebrow}>{chapter.id===1?"Här börjar din resa":"Nästa del av resan"}</p>
      <h1 className={styles.editorialTitle} ref={heading} tabIndex={-1}>{chapter.title}</h1>
      <p>Tänk på hur du brukar vara just nu. Välj hur väl varje påstående stämmer in på dig.</p>
      <button className={styles.primary} onClick={()=>setDraft(d=>({...d,phase:"question"}))}>Fortsätt →</button>
    </section>:<PersonaQuestion question={questions[draft.cursor]} selected={draft.answers[draft.cursor]} locked={pending}
      pending={pending} position={draft.cursor+1} total={40} last={draft.cursor===39} headingRef={heading}
      onAnswer={answer} onSelect={select} onNext={()=>{if(!lock.current)advance();}}/>}
  </PersonaJourney>;
  return <div className={styles.flow} data-persona-flow><section className={styles.preview}>
    <Fingerprint className={styles.smallFingerprint}/><p className={styles.eyebrow}>En första inblick</p>
    <h1 ref={heading} tabIndex={-1} className={styles.editorialTitle}>Ditt första mönster</h1>
    {!result&&!error&&<p role="status">Vi sammanställer din personliga insikt…</p>}
    {error&&<div role="alert"><p>Analysen kunde inte hämtas. Dina svar finns kvar.</p><button className={styles.secondary} onClick={()=>{setError(false);setRetry(n=>n+1);}}>Försök igen</button></div>}
    {result&&<>
      <div className={styles.insight} data-persona-insight><h2 className={styles.insightTitle}>{result.title}</h2><p className={styles.insightText}>{result.text}</p></div>
      {result.state==="ready"?<section className={styles.premium}>
        <div className={styles.premiumTop}><p className={styles.eyebrow}>Hela ditt porträtt</p><span className={styles.lock}>◇ LÅST</span></div>
        <h2>Se fler sidor av dig själv</h2><p>Din första insikt är början. Rapporten ger dig sex personliga perspektiv och konkreta råd att prova i vardagen.</p>
        <ul className={styles.reportValue}><li><strong>Din PERSONA</strong><span>Ett sammanhängande porträtt av hur dina personlighetsdrag samspelar.</span></li><li><strong>Styrkor, blinda fläckar och relationer</strong><span>Fler perspektiv som bygger på just dina svar.</span></li><li><strong>Din utvecklingskompass</strong><span>Konkreta förslag, återöppning via Mina sidor och utskrift/PDF.</span></li></ul>
        <div className={styles.price}><span>Premiumrapport</span><strong>79 <small>kr</small></strong><span>Engångsbetalning</span></div>
        <PersonaPaywall submission={submissionFor(draft)} eligible={!error} description="Sex individuella rapportdelar, konkreta råd och utskrift/PDF. 79 kr totalt, som engångsbetalning."/>
      </section>:<div className={styles.insight}><h2>{result.state==="limited"?"Ett avgränsat resultat":"Ditt kostnadsfria resultat"}</h2><p className={styles.insightText}>{result.description}</p><p>Inget premiumköp erbjuds för det här underlaget. Du behöver inte ändra dina svar.</p></div>}
      {result.questions.length>0&&<form className={styles.premium} onSubmit={event=>{
        event.preventDefault();setPreview(null);setError(false);
        setDraft(d=>({...d,supplement:Object.fromEntries(result.questions.map(q=>[q.id,extra[q.id]??"skip"]))}));
        setRetry(n=>n+1);
      }}><h2>Vill du ge lite mer sammanhang?</h2><p>Högst fyra frivilliga frågor. Du kan hoppa över dem och behålla ditt gratisresultat.</p>
        <div className={supplements.questions}>{result.questions.map(q=><label className={styles.processingConsent} key={q.id}><span>{q.prompt}<select aria-label={q.prompt} value={extra[q.id]??"skip"} onChange={e=>setExtra(a=>({...a,[q.id]:e.target.value}))}><option value="skip">Jag hoppar över den här frågan.</option>{q.options.map(o=><option key={o.id} value={o.id}>{o.label}</option>)}</select></span></label>)}
        </div><button className={styles.secondary} type="submit">Uppdatera mitt gratisresultat</button>
      </form>}
    </>}
    <div className={styles.previewActions}><button className={styles.secondary} onClick={back}>Granska mina svar</button><button className={styles.back} onClick={restart}>Radera och börja om</button><Link className={styles.textLink} href="/mina-sidor">Mina sidor</Link></div>
    <p className={styles.storageNote}>En självskattning, inte en diagnos. Svaren sparas lokalt på den här enheten. Vid ett frivilligt köp lagras de krypterat för leverans. Kontosparning väljs separat efter köpet.</p>
  </section></div>;
}
