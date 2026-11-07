> Historisk leveransbeskrivning. Aktuell frågebank och analys är nu PERSONA v2; se [persona-v2.md](persona-v2.md).

# PERSONA – leverans och releasegrind

Datum: 2026-11-07. Gren: `codex/persona-stage1`. Ingen push eller deploy ingår.

## Implementerad produkt

Den godkända v1-frågebanken och hela analysmotorn är oförändrade. De 34 fasta
och sex deterministiskt valda följdfrågorna använder samma versionerade material.
Den manuellt förbättrade frågekomponenten, desktop-CSS och 350 ms-timern är
oförändrade av betalningsarbetet.

`app/persona/report/PersonaReportView.tsx` visar alla åtta avsnitt från motorn,
utan att skriva om analysen eller hitta på nya personliga slutsatser:

1. Personlighetsporträtt
2. Personlig signatur
3. Fem personlighetsdimensioner
4. Drivkrafter
5. Relationella mönster
6. Inre motsägelser
7. Styrkor och blinda fläckar
8. Personlig kompass

Rapporten har marinblå/guldig formgivning, fingeravtryck, intern
dimensionsvisualisering med tillgängliga mätare, metod-/kvalitetsförklaringar,
öppningsbart svarunderlag och separat utskriftsbilaga. Alla personliga texter
kommer direkt från den frysta motorn. Utskrift kan göras till papper eller PDF
via webbläsaren. Inga normerade percentiler eller kliniska slutsatser införs.

## Köp och åtkomst

`PersonaPaywall.tsx` kopplar en enda gratis insikt till 79 kr engångsköp.
Köp förutsätter färdig, tillräcklig förhandsvisning, matchande versioner,
serverns capability och separat samtycke till rapportbehandling. Ett synkront
lås hindrar dubbla submits. Fel ger ett neutralt meddelande och möjlighet att
försöka igen; ett tidigare köp hänvisas till Mina sidor.

Den befintliga direktanslutningen återanvänds:

1. Webbläsaren skickar versionsbundna svar direkt till den befintliga
   Supabase Edge-funktionen via `startDirectCheckout`.
2. PERSONA-adaptern validerar hela payloaden, återställer rätt följdfrågor och
   nekar försäljning när motorns kvalitetsgräns inte nås.
3. Befintlig SQL-/krypteringskod skapar ett köpunderlag. Stripe får endast
   köpidentifierare, inte testsvar.
4. Servern skapar Stripe Checkout med en servervald allowlistad Price,
   quantity 1, 7 900 öre SEK, engångsbetalning och utan rabattkoder.
5. Returen går till Mina sidor med identifierare i fragment. URL, klientflaggor,
   e-postadress eller lokal lagring ger ingen rätt till rapporten.
6. Varje gäst-/kontoöppning verifierar Checkout Session, Price, belopp, valuta,
   PaymentIntent och charge samt återbetalning och tvist på servern.
7. Gäståtkomst kräver köpets hemliga innehavsbevis. Kontosparning kräver dessutom
   verifierad Supabase Auth-identitet och ett separat uttryckligt lagringssamtycke.
8. Versionsbundna krypterade svar återskapar exakt rapport även vid återöppning.
   Ändrade lokala testsvar skriver inte över ett köpt resultat.

Detta följer principen att bekräftelse och leverans måste hanteras på servern,
inte lita på att kunden kommit tillbaka till en viss URL. Se
[Stripe Checkout fulfillment](https://docs.stripe.com/checkout/fulfillment.md?ui=full-page).

Inga Payment Links används för PERSONA. Befintliga andra produkters betalvägar,
Stripe-verifieringskrav, databasschema, TLS, raderingsjournal och lagringstider
har inte sänkts eller ersatts. Ingen migration behövs för produktregistreringen;
de befintliga tabellerna har redan ett produktfält.

Gäståtkomst gäller högst sju dagar. Frivilligt kontosparad analys gäller högst
tolv månader, med befintlig säkerhetsmarginal. Inget löfte om obegränsad
livstidslagring lämnas. Efter återbetalning spärras nya öppningar; redan
nedladdade/utskrivna kopior kan inte återkallas.

## Konfiguration utan produktionsändring

`deploy/persona.env.example` innehåller endast PERSONA-inställningar, default
avstängda. De befintliga kraven för direkt kundtjänst, Mina sidor, kryptering,
journal, databas, Auth, avsändare och cleanup gäller fortsatt.

Nya variabler på backend:

```text
TEST_ACCOUNTS_PERSONA_ENABLED
TEST_ACCOUNTS_PERSONA_CHECKOUT_ENABLED
TEST_ACCOUNTS_PERSONA_SAVE_ENABLED
TEST_ACCOUNTS_PERSONA_READ_ENABLED
TEST_ACCOUNTS_PERSONA_PRICE_ID
```

Registreringen exponeras först när `TEST_ACCOUNTS_PERSONA_ENABLED=true`.
Checkout-capability kräver också samtliga tre CHECKOUT/SAVE/READ-flaggor och
befintlig kontoaktivering. Kontoläsning och PERSONA-gästläsning kontrollerar READ.
Den publika frontendens befintliga direktkundsflagga behöver vara påslagen vid
bygge. Ingen ny flagga aktiveras automatiskt av denna leverans.

`persona_test` läggs till i den befintliga Price-mappen. Verktyget
`deploy/merge-persona-map.cjs` tar en redan granskad map och en PERSONA-Price,
skriver en ny JSON till stdout och ändrar inga tjänster eller miljöfiler.
Det bevarar alla andra produkter och historiska Price-ID:n och nekar att en
Price redan tillhör en annan produkt. Granska diffen före någon senare ändring.

```powershell
node deploy/merge-persona-map.cjs reviewed-map.json price_PERSONA
```

Bygg Edge-paketet på nytt från kanoniska källor vid en senare godkänd release.
Den gamla driftversionen känner inte till den nya adaptern innan paketet
uppdaterats. Backend, frontend, Price-mapp och flaggor måste passa ihop.

## Isolerad testkonfiguration

`tests/persona/isolated.config.json` beskriver den körda miljön:

- Stripe: kontraktsfixtur i minnet, inga API-anrop eller pengar.
- Supabase: riktig Auth-SDK mot minnestransport, WASM PostgreSQL/PGlite mot de
  oförändrade migrationsfilerna, faktisk svarskryptering.
- Resend: fångad utkorg i minnet, inga riktiga mejl.
- Extern raderingsjournal: minnesmodell som kan tvingas stänga åtkomst vid fel.
- Externa anslutningar spärras. Loopback tillåts för befintliga lokala
  HTTP-fixturer. Domänsviten behåller sin striktare ursprungliga nätverksspärr.
- Barnprocesserna ärver endast vitlistade OS-sökvägar och syntetiska testvärden,
  aldrig applikationsnycklar eller dotenv-filer.

```powershell
node scripts/test-persona-release.cjs
node scripts/test-persona-release.cjs --quick
node scripts/render-persona-samples.cjs
```

Den första körningen upptäcker samtliga Node-testfiler, kör dem separat och
redovisar också misslyckade tester; den maskerar inte fel med skips eller
ändringar i befintliga tester. Full projekt-TypeScript, riktad strikt ESLint
och hela projektets ESLint körs. Resultat/loggar ligger i
`.artifacts/persona-release`. `--quick` begränsar till PERSONA plus samma
kompilator-/lintkontroller.

**Detta är en offline kontrakts-/integrationstestmiljö, inte en genomförd
Stripe Sandbox- eller hostad Supabase/Resend-E2E.** Stripe-fixturerna har
syntetiskt `livemode:true` för att pröva den oförändrade produktionsgränsen.
De är inga verkliga livebetalningar. Befintlig Stripe-verifierare och
databasconstraint accepterar fortfarande endast live mode; inga testnycklar
kan kopplas till den vanliga produktionsvägen genom en ny miljöväxel.
Använd inte produktionsnycklar för att försöka få lokal QA grön.

Stripe beskriver användning av simulerade providersvar i automatiska tester och
skiljer det från verklig API-verifiering i en sandbox:
[Stripe automated testing](https://docs.stripe.com/automated-testing).

## Verifieringsresultat 2026-11-07

- PERSONA: 60/60 tester passerar (18 domän, 24 flöde/rendering/CSS, 18 köp/rapport/config/UI).
- Hela projektets TypeScript passerar. Strikt ESLint för alla ändrade kodfiler passerar.
- Full Next-build och sitemap-postbuild passerar i separat kopia, utan .env eller
  leverantörsnycklar; endast syntetisk juridisk testidentitet behövdes för befintlig juridiksida.
- Bred körning: 148 Node-testprogram plus fyra compiler-/lint-/PERSONA-kommandon.
  144 av 152 kommandon passerar. Åtta icke gröna kommandon är redovisade, inte dolda.
- Full ESLint har 13 fel och 25 varningar. Samma 38 regler/filpositioner är verifierade
  i separat orörd worktree vid 8193533; inga nya lintproblem från PERSONA.
- Ett separat verkligt PostgreSQL-test saknar AUDHD_TEST_DATABASE_URL.
- ADHD-bokens köptest saknar den privata PDF-fixturen.
- Autismbokens rekommendationstest fallerar identiskt i baslinjen.
- Tre gamla Git-scopekontroller jämför mot historiska uppdrag och fallerar redan i baslinjen.
- AuDHD-artikeltestet saknar .next-filer i projektroten, eftersom bygge görs isolerat.
  Samma testprogram passerar med 9/9 deltester mot den isolerade fulla byggkopian,
  även efter sitemap-genereringen.
- Supabase Edge-paketeringstestet passerar. Deno-runtime och verkliga leverantörer
  har inte körts. Visuell kontroll av nytt betalsteg/rapport/PDF är inte genomförd.

## Releasechecklista – kvar före aktivering

- [ ] Godkänn kod, rapporttexter, syntetiska rapportexempel och dessa begränsningar.
- [ ] Manuell mobil-/desktopgranskning av det nya betalsteget, premiumrapport,
  öppningsbara bevis, tangentbord, textförstoring och reducerad rörelse.
  Frågevyn är tidigare manuellt granskad av projektägaren; ny premiumvy är inte det.
- [ ] Granska faktisk A4/PDF-utskrift i Chrome och Safari, sidbrytningar,
  läsbarhet och att enbart rätt rapport kommer med. Ingen PDF-rendering påstås här.
- [ ] Lös eller godkänn separat de dokumenterade baslinjefelen i full ESLint och
  äldre testprogram. Nödvändiga privata PDF-fixturer och en separat PostgreSQL-
  testdatabas saknas för vissa kontroller.
- [ ] Verifiera hostad Supabase Edge-runtime/region och bygget med Deno i en
  separat godkänd miljö. Deno, Supabase CLI, Stripe CLI och PostgreSQL-CLI var inte tillgängliga i PATH.
- [ ] Genomför extern leverantörs-QA med separat Supabase/Auth, testavsändare och
  Stripe Sandbox; aldrig produktionens nycklar, databas eller kundmejl.
  Den befintliga live-only-kärnan är inte en sandbox-switch: en separat,
  granskad testvärd/providerkonfiguration krävs för verklig leverantörs-E2E.
- [ ] Kontrollera digitala köpvillkor, leveranstid, samtyckestext, lagringstider,
  eventuell information om ångerrätt, pris/moms och kontaktväg före försäljning.
- [ ] Skapa/granska rätt engångs-Price på 79 SEK i rätt Stripe-miljö. Spara
  granskad JSON-diff för Price-mappen; behåll andra produkter och historik.
- [ ] Kontrollera den befintliga direktkunds-/kontokonfigurationen, frisk cleanup,
  krypteringsnyckel, separat raderingsjournal, TLS och tillåtna Auth-returer.
- [ ] Kontrollera webhook-signering/routing och betald/async succeeded-händelse.
  Mejlåterställning behöver den befintliga recovery-aktiveringen och rätt avsändare.
- [ ] Efter ett separat godkännande: push och release av sammanhörande frontend
  och Edge-kod med PERSONA-köp avstängt. Ingen sådan åtgärd är utförd här.
- [ ] Efter godkänd driftkontroll: aktivera PERSONA enligt flaggplanen. Verifiera
  köp, avbrott, återöppning, konto, radering och återbetalning under uttryckligen
  godkända driftsförhållanden. Kontrollera även befintliga produkters köp.

## Återställningsplan

Stoppa i första hand nya PERSONA-köp genom CHECKOUT=false. Låt ENABLED och READ
vara på för befintliga kunder om säkerhetsläget tillåter det. Behåll adaptern,
v1-motorn, Price-historiken och rapportläsaren efter första försäljning: en
återställning som tar bort dem skulle göra köpta rapporter oläsbara. Stäng READ
vid misstänkt obehörig åtkomst; återöppna först efter utredd incident. Ändra inte
andra produkters flaggor, journaler, tabeller eller betalbevis för detta.

Lanseringsgrinden är inte helt grön enbart för att PERSONA:s lokala kontrakts-
tester passerar. Slutrapporten anger exakt vilka kontroller som körts och vilka
baslinje-/miljöhinder som återstår.
