# Kontointegration etapp 6 – lokal leverans

## Omfattning

Narcissist i en relation, Traumabindning och Psykisk misshandel är anslutna till den befintliga gemensamma kontomotorn. Ingen ny datamodell, migrering, Stripe-verifierare, lagringsnyckel, rensningsrutin eller driftanslutning införs. AuDHD-specifik implementation är orörd. Alla nya flaggor är avstängda som standard; historikimport förblir blockerad även om dess flagga sätts.

Varje adapter accepterar exakt 30 heltal 0–4, frågeversion och rapportversion. Saknade/sparse/null/extra/felversionerade svar avvisas före kontoköp/sparning. Den äldre klientmodellens hantering av ofullständiga gästsvar är oförändrad. Endast serverns registrerade modell och pris kan väljas. Ett lokalt `paid=true` eller samma mejladress ger aldrig kontorättigheter.

| Test | Produktnyckel | Slug | Variabelprefix | Pris före aktivering |
| --- | --- | --- | --- | --- |
| Narcissist i en relation | `narcissist_partner` | `narcissist-i-en-relation` | `TEST_ACCOUNTS_PARTNER` | Verifiera aktivt engångspris 3900 öre, SEK, live |
| Traumabindning | `trauma_bond_test` | `traumabindningtest` | `TEST_ACCOUNTS_TRAUMA_BOND` | Verifiera aktivt engångspris 3900 öre, SEK, live |
| Psykisk misshandel | `psychological_abuse_test` | `psykisk-misshandel-relation` | `TEST_ACCOUNTS_PSYCHOLOGICAL_ABUSE` | Verifiera aktivt engångspris 3900 öre, SEK, live |

Frågeversionerna är `<slug>-questions-v1`, rapportversionerna `<slug>-report-v1`. Varje prefix har separata CHECKOUT/SAVE/READ/LEGACY_IMPORT_ENABLED samt PRICE_ID, se env-exemplet. Ändra endast konfiguration efter godkännande; inga riktiga ID:n eller hemligheter har lästs eller ändrats här.

## Bevarade analyser och säkerhetsinformation

Originalens frågor, skalor, vikter, avrundning, trösklar, tolkningar och fulla premiumavsnitt flyttas till rena modeller och gemensamma rapportkomponenter. Narcissisttestet och psykisk misshandel viktar avrundade delskalor; traumabindning avrundar totalsumman. Inga poängmodeller eller resultattexter ändras.

Psykisk misshandel behåller särskilt legalAreasHigh (delområden >=50), överlappstexternas villkor för antal områden samt pattern/impact (40/50), och säkerhetsrådens hot/tvång/övervakningströskel >=75. Akuta råd ska visas även om totalpoängen är låg. Originalens juridiska texter återges oförändrade, utan ny juridisk bedömning. Narcissisttestets diagnosförbehåll och misshandeltestets fördjupningslänkar visas även i serverrapporterna. Inga befintliga skyddstexter tas bort.

Gamla sidor behåller exakt sina köp-, omstarts-, svarshanterings-, localStorage- och betalningsåterkomstfunktioner. Endast en flaggstyrd checkout-gren och ett generiskt felmeddelande tillkommer. När den nya vägen valts sker aldrig tyst återfall till en annan köpväg vid fel. Analytics-refen följer befintlig komponentstandard. Två äldre sidors synkroniserande localStorage-/paid-return-effekter har en avgränsad ESLint-kommentar; deras kroppar är oförändrade och jämförs automatiskt.

## Gör om testet

Originalsidornas omstartsknappar behåller den ursprungliga funktionen. De nya gäst-/kontorapporterna har samma text och utseende men använder en vanlig länk med klienthantering: just det testets gamla lokala svar raderas före navigation till dess testsida. Samma removeItem/felfallback används som i originalets omstart. Köphistorik, sparad analys, andra tester och befintliga betalmarkörer raderas inte. Länken fungerar som navigation även utan JavaScript; utan JavaScript kan lokala svar inte rensas. Detta är den enda avsiktliga kontrollskillnaden i rapporterna.

## Säkerhet och verifiering

Samma betalningsbindning, produkt-/beloppskontroller, återbetalnings-/tvistkontroll, uttryckligt samtycke, ägarskap, kryptering och raderingsjournal används. Krypterade gästsvar behålls i sju dagar och en separat samtyckt kontokopia inom den tidigare fastställda gränsen på högst tolv månader. Köp kan finnas kvar efter resultatradering. Återställning av äldre backup kräver befintlig underhålls-/journalavstämning innan åtkomst tillåts.

Tester använder frysta original från arbetsstarten, syntetiska svar, simulerad Stripe/R2 och befintlig PGlite-SQL-harness. Ingen verklig betalning eller kunddata används. Fel med syntetiskt privat innehåll injiceras i prisleverantör, sparande/radering och rapportläsning: innehållet får varken loggas eller skickas tillbaka i svaren. Schemafel visas generiskt.

Avgränsningen finns exakt i `scripts/test-accounts-stage6-files.json`. Manifestet skiljer nya filer från ändrade befintliga filer och fryser övriga tidigare leveransberoenden. Verifieringskopian består av HEAD plus uttryckliga allowlists; övrigt pågående arbete tas inte med. Den tidigare godkända två-raders loggningsfixen i recovery-testet rekonstrueras från HEAD, utan att kopiera andra recovery-ändringar. Inga tidigare manifest skrivs om.

## Produktionsberoenden – kräver separat godkännande

1. Godkänn tidigare konto-/driftleveranser och generell migrering innan denna etapp tas i bruk. Befintliga sekretess-/RLS-, nyckel-, raderings-, journal-/backup- och övervakningskrav kvarstår. Ingen ny migrering behövs för etapp 6.
2. Verifiera faktiska Stripe-produkter och tre aktiva engångspriser på 39 SEK, live. Lägg respektive Price ID i rätt befintlig produktnyckels priceIds i STRIPE_PAYMENT_PRODUCT_MAP_JSON och i adaptervariabeln PRICE_ID. Bevara gamla pris-/produktmappningar och Payment Links. Priserna är kontrollvärden, inte verifierade skarpa ID:n i denna lokala leverans.
3. Godkänn utökad integritetsinformation och uttryckligt frivilligt lagringssamtycke. Svar kan röra andra personer, hälsa, våld eller påstådda brott; tidigare bedömning av rättslig grund och särskilda skydd för dessa uppgifter måste omfatta dessa tester före aktivering. Inga fria texter eller personidentifierare tillförs. Befintliga juridiska resultattexter har bevarats, inte sakgranskats här.
4. Efter godkännande: kontrollera verkliga tjänsteanslutningar, cookie-/returflöden, mobil, omstart, återöppning efter gästrensning, återbetalningar, raderingsjobb och larm. Simulering ersätter inte denna driftsverifiering. Ingen skarp provbetalning utförs inom uppdraget.
5. Aktivera ett test i taget: READ, SAVE, sist CHECKOUT. Behåll import avstängd. Vid fel: stäng det testets nya CHECKOUT/SAVE och återställ kod efter kontroll; behåll fungerande READ, radering, rensning och journal/larm. Återställ inte gamla data för att backa enbart kod. Om databasåterställning krävs: underhållsläge, återställning, extern journalavstämning och verifiering före upplåsning enligt tidigare driftplan.

## Verifieringsresultat

Samtliga 68 testprogram passerar, inklusive tidigare 63 och det ursprungliga gästflödestestet för psykisk misshandel. TypeScript utan fel. ESLint utan fel, med tre befintliga tracking-beroendevarningar i de äldre betalningsreturernas engångseffekter. Produktionsbygge med webpack och postbuild godkänt, 144 statiska sidor. Två avslutande tomrader i extraherade sidor har städats; inga funktionsändringar efter testkörningen. Paritetskörningen omfattar 47 627 analysjämförelser, 1 991 kompletta rapportjämförelser och 1 315 direkta säkerhetsgränsfall. Ingen konstaterad analysavvikelse.

## Exakt filförteckning

35 filer: 26 nya och nio ändrade från arbetsstarten. Tidigare leveranser är beroenden, inte nytillkomna filer i denna etapp.

### Ändrade befintliga filer

- `app/_components/useTestAccountCheckout.ts`
- `app/_lib/testAccounts/adapter.ts`
- `app/_lib/testAccounts/stage2-flow.test.cjs`
- `app/mina-sidor/tester/ReportView.tsx`
- `app/mina-sidor/tester/integritet/page.tsx`
- `app/narcissist-i-en-relation/test/page.tsx`
- `app/psykisk-misshandel-relation/test/page.tsx`
- `app/traumabindningtest/test/page.tsx`
- `proxy.ts`

### Nya filer

- `app/_components/TestRestartLink.tsx`
- `app/_lib/testAccounts/adapters/partner.ts`
- `app/_lib/testAccounts/adapters/psychologicalAbuse.ts`
- `app/_lib/testAccounts/adapters/traumaBond.ts`
- `app/_lib/testAccounts/stage6-fixtures/material.json`
- `app/_lib/testAccounts/stage6-fixtures/narcissist-i-en-relation-model-v1.ts`
- `app/_lib/testAccounts/stage6-fixtures/narcissist-i-en-relation-report-v1.tsx`
- `app/_lib/testAccounts/stage6-fixtures/psykisk-misshandel-relation-model-v1.ts`
- `app/_lib/testAccounts/stage6-fixtures/psykisk-misshandel-relation-report-v1.tsx`
- `app/_lib/testAccounts/stage6-fixtures/traumabindningtest-model-v1.ts`
- `app/_lib/testAccounts/stage6-fixtures/traumabindningtest-report-v1.tsx`
- `app/_lib/testAccounts/stage6-flow.test.cjs`
- `app/_lib/testAccounts/stage6-http-ui.test.cjs`
- `app/_lib/testAccounts/stage6-parity.test.cjs`
- `app/_lib/testAccounts/stage6-safety.test.cjs`
- `app/narcissist-i-en-relation/test/ReportView.tsx`
- `app/narcissist-i-en-relation/test/model.ts`
- `app/psykisk-misshandel-relation/test/ReportView.tsx`
- `app/psykisk-misshandel-relation/test/model.ts`
- `app/traumabindningtest/test/ReportView.tsx`
- `app/traumabindningtest/test/model.ts`
- `docs/test-accounts-stage6.env.example`
- `docs/test-accounts-stage6.md`
- `scripts/prepare-test-accounts-stage6.cjs`
- `scripts/test-accounts-stage6-files.json`
- `scripts/test-test-accounts-stage6.cjs`
