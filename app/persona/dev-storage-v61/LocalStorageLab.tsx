"use client";
import { useEffect, useState } from "react";
import styles from "../dev-report-v6/preview.module.css";
type View={profile:string;id:string;revision:number;quality:{state:string};supplement:Record<string,string>;resume:{screen:"questions"|"supplement"|"result";questionIndex:number|null};digest:string};
const referenceKey="persona_v61_local_result_reference";
export default function LocalStorageLab() {
  const [view,setView]=useState<View|null>(null),[reference,setReference]=useState(""),[authorized,setAuthorized]=useState(false);
  const [profile,setProfile]=useState("F21"),[message,setMessage]=useState(""),[busy,setBusy]=useState(false);
  const [goal,setGoal]=useState("voice"),[screen,setScreen]=useState<"questions"|"supplement"|"result">("supplement");
  function accept(value:View) {
    setView(value);setProfile(value.profile);setReference(value.id);sessionStorage.setItem(referenceKey,value.id);
    setScreen(value.resume.screen);setGoal(value.supplement.S04??"voice");
  }
  async function request(body?:Record<string,unknown>,id?:string) {
    const response=await fetch("/persona/dev-storage-v61/api"+(id?"?result="+encodeURIComponent(id):""),{
      method:body?"POST":"GET",credentials:"same-origin",cache:"no-store",
      ...(body?{headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}:{})});
    if(response.status===401)setAuthorized(false);
    if(!response.ok)throw Error(response.status===409?"Nyare svar finns sparade. Öppna resultatet igen innan du sparar.":
      response.status===401?"Sessionen saknas eller har gått ut. Ett resultat-ID räcker inte för åtkomst.":"Resultatet är inte tillgängligt i den här sessionen.");
    return response.json();
  }
  useEffect(()=>{
    let active=true;
    const id=sessionStorage.getItem(referenceKey)??"";setReference(id);
    request().then(async(session)=>{
      if(!active)return;setAuthorized(true);
      const restoreId=id||session.lastResultId;
      if(restoreId){const saved=await request(undefined,restoreId);if(active){accept(saved);setMessage("Session och sparade svar återställda.");}}
    }).catch(error=>{if(active)setMessage(error.message);});
    return()=>{active=false;};
  },[]);
  async function run(action:()=>Promise<void>) {
    if(busy)return;setBusy(true);setMessage("");
    try{await action();}catch(error){setMessage(error instanceof Error?error.message:"Åtgärden kunde inte genomföras.");}finally{setBusy(false);}
  }
  return <section className={styles.toolbar}>
    <h1>Isolerad databas- och sessionstest</h1>
    <p>Enbart syntetiska profiler. Lokal PGlite, krypterade svar och serverutfärdad session. Inga köp.</p>
    <p role="status">{authorized?"Session auktoriserad.":"Ingen auktoriserad session."} {message}</p>
    <form onSubmit={event=>event.preventDefault()}>
      <button type="button" disabled={busy} onClick={()=>void run(async()=>{
        await request({action:"new-session"});setAuthorized(true);setView(null);setMessage("Ny testsession skapad. Tidigare resultat byter inte ägare.");
      })}>Ny testsession</button>
      <button type="button" disabled={busy||!authorized} onClick={()=>void run(async()=>{
        await request({action:"end-session"});setAuthorized(false);setView(null);setMessage("Sessionen avslutad. Resultat-ID:t ger ingen åtkomst på egen hand.");
      })}>Avsluta session</button>
      <label>Syntetisk profil<select value={profile} onChange={event=>setProfile(event.target.value)}>
        {Array.from({length:24},(_,i)=>"F"+String(i+1).padStart(2,"0")).map(id=><option key={id}>{id}</option>)}
      </select></label>
      <label>Återställningsläge<select value={screen} onChange={event=>setScreen(event.target.value as typeof screen)}>
        <option value="questions">Grundfrågor, position 12</option><option value="supplement">Kompletteringar</option><option value="result">Resultat</option>
      </select></label>
      <label>Simulerad prioritering<select value={goal} onChange={event=>setGoal(event.target.value)}>
        <option value="voice">Uttrycka egen vilja</option><option value="start">Komma igång</option><option value="preserve">Bevara rutin</option><option value="skip">Hoppa över</option>
      </select></label>
      <button type="button" disabled={busy||!authorized} onClick={()=>void run(async()=>{
        const supplement=["F13","F16","F21","F22","F23","F24"].includes(profile)?
          {S01:"context",S02:"writing",S03:"asked",S04:goal}:null;
        const saved=await request({action:view?"save":"create",...(view?{id:view.id,revision:view.revision}:{}),
          profile,supplement,resume:{screen,questionIndex:screen==="questions"?11:null}});
        accept(saved);setMessage("Sparat krypterat. Du kan uppdatera sidan eller avbryta och öppna igen.");
      })}>{view?"Spara ändring":"Spara nytt testresultat"}</button>
      <label>Opakt resultat-ID<input aria-label="Opakt resultat-ID" value={reference} onChange={event=>setReference(event.target.value)} style={{color:"#101626",background:"#F5F0E7",border:"1px solid #C9A86B",borderRadius:4,minHeight:44,padding:8,width:"100%",minWidth:0}}/></label>
      <button type="button" disabled={busy||!reference} onClick={()=>void run(async()=>{accept(await request(undefined,reference));setAuthorized(true);setMessage("Resultatet återöppnat med serverkontrollerad session.");})}>Öppna sparat resultat</button>
    </form>
    {view&&<p>Revision {view.revision}. Kvalitet: {view.quality.state}. Sparat läge: {view.resume.screen}.<br/>Kontrollsumma: {view.digest}</p>}
    <p>Webbläsaren sparar bara resultatets opaka referens. Sessionens hemlighet finns i en HttpOnly-cookie.</p>
  </section>;
}
