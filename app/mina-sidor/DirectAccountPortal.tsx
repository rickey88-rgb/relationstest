"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import ReportView from "./tester/ReportView";
import AudhdReport from "../audhd-test/test/ReportView";
import type { Report as AudhdResult } from "../audhd-test/test/model";
import type { AnswerDescription } from "../_lib/testAccounts/answerDescriptions";
import { directAuthClient, directLoginRedirect, directRequest, forgetPending, pendingPurchase, pendingPurchases, readLoginFragment, type PendingPurchase } from "../_lib/testAccounts/directClient";

type Purchase = { id: string; product: string; purchased_at: string; expires_at: string | null };
type Entry = { product: string; title: string; result: unknown; answers: AnswerDescription[]; expiresAt: string };
type Test = { product: string; title: string };
const card = "rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7";
const button = "min-h-12 rounded-xl bg-[#27666A] px-5 py-3 font-semibold text-white disabled:opacity-50";
/** Vercel renders only this public shell. All personal requests and Auth go directly to Supabase. */
export default function DirectAccountPortal() {
  const [email, setEmail] = useState(""), [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null), authUser = useRef<string | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]), [pending, setPending] = useState<PendingPurchase[]>([]);
  const [entry, setEntry] = useState<Entry | null>(null), [selected, setSelected] = useState<PendingPurchase | null>(null);
  const [tests, setTests] = useState<Test[]>([]), [consentVersion, setConsentVersion] = useState("");
  const [consent, setConsent] = useState(false), [notice, setNotice] = useState(""), [busy, setBusy] = useState(false);
  const [loginToken, setLoginToken] = useState<string | null>(null), [ownedId, setOwnedId] = useState<string | null>(null);
  const [opening, setOpening] = useState(true);
  const analysis = useRef<HTMLElement>(null), entryOwner = useRef<string | null>(null);
  const loginReturn = useRef<string | null>(null), loginInFlight = useRef(false), viewRevision = useRef(0);
  const fail = useCallback(() => setNotice("Det gick inte att genomföra åtgärden. Försök igen. Dina befintliga köp påverkas inte."), []);
  const refresh = useCallback(async () => {
    const owner = authUser.current;
    const value = await directRequest({ action: "list" }, { authenticated: true });
    if (owner && owner === authUser.current) setPurchases(value.purchases);
  }, []);
  const guest = useCallback(async (item: PendingPurchase) => {
    const revision = ++viewRevision.current;
    setBusy(true); setOpening(true); setNotice(""); setConsent(false);
    setEntry(null); setSelected(null); setOwnedId(null); entryOwner.current = null;
    try {
      const value = await directRequest({ action: "guest", ...item }, { possession: true });
      if (revision === viewRevision.current) { setEntry(value); setSelected(item); setOwnedId(null); }
    }
    catch { if (revision === viewRevision.current) fail(); }
    finally { if (revision === viewRevision.current) { setBusy(false); setOpening(false); } }
  }, [fail]);
  useEffect(() => {
    let mounted = true;
    const captureLogin = () => {
      const token = readLoginFragment(window.location.hash);
      if (!token) return;
      loginReturn.current = token;
      ++viewRevision.current;
      setLoginToken(token); setOpening(false); setBusy(false); setNotice("");
      setEntry(null); setSelected(null); setOwnedId(null); entryOwner.current = null;
      history.replaceState(null, "", "/mina-sidor");
    };
    // Email apps/Safari may reuse this document and change only its fragment.
    // Keep the token in memory; merely opening/scanning the link never consumes it.
    captureLogin();
    window.addEventListener("hashchange", captureLogin);
    window.addEventListener("pageshow", captureLogin);
    const token = loginReturn.current;
    const attempts = pendingPurchases(); setPending(attempts);
    const returned = new URLSearchParams(window.location.hash.slice(1)).get("attempt");
    const candidate = returned ? attempts.find(item => item.id === returned) : pendingPurchase();
    // Strip credential fragments before any subsequent navigation/referrer.
    if (window.location.hash) history.replaceState(null, "", "/mina-sidor");
    void directRequest({ action: "capabilities" }).then(value => { if (mounted) { setTests(value.tests); setConsentVersion(value.consentVersion); } }).catch(fail);
    if (candidate && !token) void guest(candidate); else setOpening(false);
    const cleanupReturn = () => {
      mounted = false;
      window.removeEventListener("hashchange", captureLogin);
      window.removeEventListener("pageshow", captureLogin);
    };
    let auth;
    try { auth = directAuthClient(); }
    catch {
      setOpening(false);
      setNotice("Inloggningen kunde inte startas i webbläsaren. Öppna länken i din vanliga webbläsare och kontrollera att webbplatsdata tillåts.");
      return cleanupReturn;
    }
    const { data: subscription } = auth.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUserEmail(session?.user.email ?? null);
      const next = session?.user.id ?? null;
      setUserId(next);
      if (authUser.current !== next) {
        setPurchases([]);
        // Guest access is possession-verified and must survive initial Auth/login.
        // Account-owned results still disappear immediately on logout/account switch.
        if (entryOwner.current) { setEntry(null); setOwnedId(null); entryOwner.current = null; }
        authUser.current = next;
      }
    });
    return () => { cleanupReturn(); subscription.subscription.unsubscribe(); };
  }, [guest, fail]);
  useEffect(() => {
    if (!entry) return;
    analysis.current?.focus({ preventScroll: true });
    analysis.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [entry]);
  useEffect(() => { if (userId) void refresh().catch(fail); }, [userId, refresh, fail]);
  async function login() {
    setBusy(true); setNotice("");
    try {
      const { error } = await directAuthClient().auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: directLoginRedirect(window.location.origin) } });
      if (error) throw error;
      setNotice("Kontrollera din mejl. Öppna länken och bekräfta inloggningen. Spara köpet i samma webbläsare som du använde vid betalningen.");
    } catch { fail(); } finally { setBusy(false); }
  }
  async function confirmLogin() {
    if (!loginToken || loginInFlight.current) return;
    loginInFlight.current = true;
    setBusy(true); setNotice("");
    try {
      const { data, error } = await directAuthClient().auth.verifyOtp({ token_hash: loginToken, type: "email" });
      if (loginReturn.current !== loginToken) return;
      if (error) {
        if (error.code === "otp_expired") {
          loginReturn.current = null; setLoginToken(null);
          setNotice("Inloggningslänken har gått ut eller har redan använts. Begär en ny länk nedan.");
          return;
        }
        throw error;
      }
      if (!data.session || !data.user) throw new Error("Session unavailable");
      loginReturn.current = null;
      setLoginToken(null); setNotice("Du är inloggad. Välj en analys och bekräfta om du vill spara den på kontot.");
    } catch { fail(); } finally { loginInFlight.current = false; setBusy(false); }
  }
  async function logout() {
    setBusy(true);
    try { const { error } = await directAuthClient().auth.signOut(); if (error) throw error; setNotice("Du är utloggad. Dina kontosparade tester finns kvar när du loggar in igen."); }
    catch { fail(); } finally { setBusy(false); }
  }
  async function save() {
    const owner = authUser.current;
    if (!selected || !consent || !consentVersion || !owner) return;
    setBusy(true);
    try {
      await directRequest({ action: "save", ...selected, consent: consentVersion }, { authenticated: true, possession: true });
      if (owner !== authUser.current) return;
      entryOwner.current = owner;
      forgetPending(selected.id); setPending(pendingPurchases()); setOwnedId(selected.id); setSelected(null);
      await refresh(); setNotice("Analysen och alla dina testsvar är sparade på ditt konto. Du kan logga ut och öppna dem igen senare.");
    } catch { fail(); } finally { setBusy(false); }
  }
  async function open(purchase: Purchase) {
    const revision = ++viewRevision.current;
    setBusy(true); setOpening(true); setNotice(""); setSelected(null); setEntry(null); setOwnedId(null); entryOwner.current = null;
    const owner = authUser.current;
    try {
      const value = await directRequest({ action: "open", id: purchase.id, product: purchase.product }, { authenticated: true });
      if (revision === viewRevision.current && owner && owner === authUser.current) { entryOwner.current = owner; setEntry(value); setOwnedId(purchase.id); }
    }
    catch { if (revision === viewRevision.current) fail(); }
    finally { if (revision === viewRevision.current) { setBusy(false); setOpening(false); } }
  }
  async function remove() {
    if (!ownedId || !entry || !window.confirm("Radera de sparade svaren och analysen? Köphistoriken finns kvar. Det går inte att ångra.")) return;
    setBusy(true);
    try { await directRequest({ action: "delete", id: ownedId, product: entry.product }, { authenticated: true }); setEntry(null); setOwnedId(null); await refresh(); setNotice("De sparade svaren och analysen har raderats."); }
    catch { fail(); } finally { setBusy(false); }
  }
  const title = (product: string) => tests.find(test => test.product === product)?.title ?? "Köpt test";
  if (opening && !entry) return <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 sm:px-7"><p role="status">Hämtar ditt resultat och kontrollerar åtkomsten…</p></main>;
  return <main className="mx-auto min-h-screen max-w-5xl space-y-7 px-4 py-10 sm:px-7">
    {entry && <section ref={analysis} tabIndex={-1} data-paid-analysis className="scroll-mt-4 space-y-6 outline-none" aria-label="Din köpta analys">
      {selected && <p role="status" className="text-lg font-semibold text-[#27666A]">Betalningen lyckades! Här är din personliga analys.</p>}
      <h1 className="text-3xl font-semibold">{entry.title} – din fullständiga analys</h1>
      {entry.product === "audhd_test" ? <AudhdReport report={entry.result as AudhdResult} onRestart={() => window.location.assign("/audhd-test/test")} /> : <ReportView product={entry.product} result={entry.result} />}
      <details className={card}><summary className="cursor-pointer text-xl font-semibold">Alla dina testsvar ({entry.answers.length})</summary><ol className="mt-5 space-y-5">{entry.answers.map((answer, index) => <li key={index}><p className="font-semibold">{index + 1}. {answer.question}</p>{answer.visual && <div className="my-2 grid max-w-xs gap-2" style={{ gridTemplateColumns: "repeat(" + answer.visual.size + ", 1fr)" }}>{answer.visual.cells.map((cell, cellIndex) => <span className="rounded border p-3 text-center" key={cellIndex}>{cell}</span>)}</div>}<p className="mt-1">Ditt svar: {answer.answer}</p></li>)}</ol></details>
      <p className="text-sm text-neutral-600">Tillgänglig till {new Date(entry.expiresAt).toLocaleDateString("sv-SE")}. Kontosparade svar och analys kan raderas tidigare.</p>
      {selected && <section className={card}><h2 className="text-xl font-semibold">Spara frivilligt på ditt konto</h2><label className="my-4 flex items-start gap-3"><input type="checkbox" className="mt-1 size-5" checked={consent} onChange={event => setConsent(event.target.checked)} /><span>Jag vill spara mina testsvar och min analys på mitt konto och samtycker uttryckligen till lagringen, även när uppgifterna rör min hälsa. Lagringen är frivillig, gäller högst tolv månader och jag kan radera uppgifterna tidigare. <a className="underline" href="/integritet" target="_blank" rel="noreferrer">Läs integritetsinformationen</a>.</span></label>{userEmail ? <button className={button} disabled={busy || !consent} onClick={() => void save()}>Spara svar och analys på kontot</button> : <p>Logga in nedan för att spara. Du kan läsa ditt betalda resultat utan konto.</p>}</section>}
      {ownedId && <button className="min-h-11 text-red-800 underline" disabled={busy} onClick={() => void remove()}>Radera mina sparade svar och min analys</button>}
    </section>}
    {!entry && <header><p className="text-sm uppercase tracking-widest text-[#27666A]">Relationsvarning</p><h1 className="mt-3 text-4xl font-semibold">Mina sidor</h1><p className="mt-3 text-neutral-600">Dina köpta tester, svar och personliga analyser. Ingen prenumeration behövs.</p></header>}
    {notice && <p className={card} role="status">{notice}</p>}
    {loginToken && <section className={card}><h2 className="text-xl font-semibold">Bekräfta din inloggning</h2><p className="my-4">Tryck här för att använda din personliga inloggningslänk.</p><button className={button} disabled={busy} onClick={() => void confirmLogin()}>Logga in</button></section>}
    {userEmail ? <section className={card}><p>Inloggad som {userEmail}</p><button className="mt-3 underline" disabled={busy} onClick={() => void logout()}>Logga ut</button></section>
      : !loginToken && <form className={card} onSubmit={event => { event.preventDefault(); void login(); }}><h2 className="text-xl font-semibold">Logga in med en mejllänk</h2><label className="my-4 block">Mejladress<input type="email" required autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-2 block min-h-12 w-full rounded-xl border p-3" /></label><button className={button} disabled={busy}>Skicka inloggningslänk</button></form>}
    {pending.length > 0 && <section className={card}><h2 className="text-xl font-semibold">Köp i den här webbläsaren</h2><p className="my-3">Öppna ditt betalda resultat. Välj sedan om du vill spara det på kontot. Gäståtkomsten gäller i högst sju dagar.</p><ul className="space-y-3">{pending.map(item => <li key={item.id}><button className="min-h-11 underline" disabled={busy} onClick={() => void guest(item)}>Öppna {title(item.product)}</button></li>)}</ul></section>}
    {userEmail && <section className={card}><h2 className="text-xl font-semibold">Sparat på ditt konto</h2>{purchases.length === 0 ? <p className="mt-3">Du har inga kontosparade tester ännu.</p> : <ul className="mt-4 space-y-4">{purchases.map(item => <li key={item.id} className="flex flex-wrap items-center justify-between gap-3"><span>{title(item.product)} · {new Date(item.purchased_at).toLocaleDateString("sv-SE")}</span>{item.expires_at ? <button className="min-h-11 underline" disabled={busy} onClick={() => void open(item)}>Öppna svar och analys</button> : <span>Analysen är raderad eller har löpt ut</span>}</li>)}</ul>}</section>}
  </main>;
}
