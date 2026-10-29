# Testintegration etapp 2 – HSP, ångest och PTSD

Endast lokal implementation i C:\src\relationsvarning. Inga produktionsändringar, migreringar, betalningar, commits, publiceringar eller pushar.

## Implementerat

Tre separata adaptrar använder samma befintliga kontomotor och samma fem tabeller från etapp 1. Inga nya migrationsfiler behövs för etapp 2. HSP kostar enligt befintlig modell 49 kr, ångest och PTSD 39 kr. Varje adapter har egen strikt validering: exakt 30 heltal 0–4, endast fälten answers/questionVersion/reportVersion och exakta versioner `hsp-questions-v1`/`hsp-report-v1`, `angest-questions-v1`/`angest-report-v1`, `ptsd-questions-v1`/`ptsd-report-v1`. Alla checkout/save/read/import-flaggor är oberoende och av som standard.

Adaptrarna anropar respektive ursprungliga `calculate`; inga alternativa poängmodeller införs. HSP behåller råpoäng inklusive +1 per svar, normalisering, rangordning och profilmönster. Ångest behåller sina sex områden, totalpoäng och stödjande/nyanserande faktorer. PTSD behåller olikstora områden, avrundning, frågedrivare och befintliga tolkningar. Frågor/modeller är orörda och deras version 1-material är hashbundet i testerna.

Premiumrapporterna har extraherats till delade `ReportView`-komponenter. HSP:s och PTSD:s rena textfunktioner ligger i respektive `interpretation.ts`. Samma komponent används av klientens tidigare gästrapport och den serververifierade gäst-/kontoläsningen. Frysta originalrapporter från före etapp 2 ligger som oberoende regressionsreferenser i `stage2-fixtures`. Klientens redigering/omstart, fria utdrag och köprekommendationer ligger kvar på den gamla sidan.

## Återanvändning och säkerhetsgränser

- Befintlig Stripe-kedja, kryptering med produkt-/versions-/köp-/ägarbindning, Auth, samtycke, ägarlås, självständig kontokopia, tidsgränser, raderingsregister, rensning, larm och restore-reconcile återanvänds. Inga parallella lagrings- eller betalningssystem införs.
- Checkout-orchestration har flyttats till `handlers.server.ts`. ADHD:s ursprungliga API-adress exporterar samma handlers via en adapterinställning; dess gamla testkontrakt, pris, flöden och webbadresser bevaras. Nya produkter använder `/api/test-accounts/[test]/[action]`. Gemensam klienttransport används även via ADHD:s befintliga hook-kontrakt, så samma felhantering och dubbelklicksskydd används.
- Save och öppning för en bestämd rapport binder produkt på servern innan Stripe/dekryptering. Den gamla ADHD-rapportvägen kan inte läsa en annan produkts analys. Innehav av en sessionsreferens, lokal paid-flagga eller samma mejladress ger ingen kontorättighet.
- De tre nya gästvägarna är `/mina-sidor/gast/hsp/<uuid-v4>`, `/mina-sidor/gast/angest/<uuid-v4>` och `/mina-sidor/gast/ptsd/<uuid-v4>`. Proxy-undantaget har endast utökats med dessa exakta slugs. Serverläsaren kräver fortfarande browsersecret, rätt produkt, aktivt driftläge, ej utgånget/ej raderat underlag och en aktuell giltig Stripe-betalning. AuDHD:s proxy-/rapportvägar och specifika implementation är orörda.
- Mina tester visar produktnamn och korrekta rapport-/raderingslänkar. Det finns ingen automatisk historikimport; nya produkters import nekas även om någon slår på importflaggan.
- När checkout-flaggorna är av ligger tidigare Payment Links, lokal lagring, upplåsning och recovery kvar. Tester jämför den gamla checkout-funktionen med den nya efter att den enda flaggstyrda avgreningen tagits bort.

Gästkopian varar högst sju dagar, kontokopian högst tolv månader (tekniskt tolv månader minus tio dagar), samma som etapp 1. Kontokopian öppnas utan originalförsöket. Raderad analys får inte återexponeras från en äldre backup, oavsett produkt. Ägaren behöver godkänna och kommunicera gästlagringen före köp innan aktivering, liksom i etapp 1.

## Verifiering

Kör `node scripts/prepare-test-accounts-stage2.cjs` och använd den utskrivna isolerade katalogen. Därefter `node scripts/test-test-accounts-stage2.cjs`, `npm run build -- --webpack` och separat TypeScript-kontroll med rotens installerade tsc, `--noEmit --incremental false`. Kör inte rotens postbuild över pågående sitemap-arbete.

Nya tester jämför 280 syntetiska svarsmönster per test: exakt server-/klientresultat, fryst originalrapport och portalrapport. Därtill faktisk SQL med befintlig migration för köp, ägare, samtycke, produktspärr, kryptering, återöppning efter raderad gästkopia, delåterbetalning, utgång, radering och återställning av en tidigare raderad analys/gästkopia. HTTP-/UI-tester omfattar korrekta produkt-URL:er/priser, avstängda flaggor, CSRF, kroppsstorlek, Auth, gästläsning utan konto, aktivt samtycke och smalt proxy-undantag. Samtliga 45 program från etapp 1 och två befintliga HSP-/PTSD-modellprogram ingår också: totalt 50 program.

Endast syntetiska uppgifter används. Stripe och det externa raderingsregistret är simulerade; PGlite kör riktig SQL men har som tidigare inget verkligt advisory-lock-backendstöd. Ett godkänt lokalt bygge är inte ett genomfört produktionsprov.

## Isolering

Exakt etapp-2-lista och baslinjehashar finns i `scripts/test-accounts-stage2-files.json`. Arbetsstartens fulla filhashlista ligger ignorerad under `.artifacts/test-accounts-stage2/`. Förberedelseskriptet bygger HEAD + de uttryckliga AuDHD-/etapp-1-beroendena + endast etapp 2-listan. Det verifierar frysta beroenden innan kopiering. Inga befintliga AuDHD-filer, migreringar, miljöfiler, package-filer, Vercel-konfiguration, Stripe-webhook, recovery eller sitemap ändras. Inga testadaptrar utöver dessa tre läggs till.

## Återstående produktionsberoenden

1. Etapp 1:s godkända publicering och generella migration samt de tidigare beslutade driftförutsättningarna behöver finnas på plats. Den nya etappen behöver ingen egen migrering, cronpost, monitor, krypteringsnyckel eller R2-bucket.
2. Välj och kontrollera separata allowlistade engångspriser: HSP 49 SEK, ångest/PTSD 39 SEK. Ange respektive servervariabel och korrekt produktmappning i rätt miljö. Inga faktiska Stripe-priser eller miljövärden har ändrats här.
3. Godkänn utökad integritetstext/samtycke och klassificering av potentiellt känsliga svar för dessa tester. Den privata informationstexten omfattar nu de fyra generella testprodukterna; detta ersätter inte tidigare kvarvarande rättsliga beslut eller granskning av ansvarig.
4. Bekräfta fungerande gemensam rensning, extern övervakning/larm, skyddat register och kontrollerad restore-rutin. Genomför godkänd verklig tjänste-/betalnings- och mobilverifiering. Som i etapp 1 accepterar verifieraren live mode; ingen skarp betalning eller extern testmodeadapter har införts här.
5. Aktivera en produkt åt gången: READ, sedan SAVE, sist CHECKOUT efter godkänt prov. Låt alla nya flaggor för övriga produkter vara av. Vid fel stäng den produktens CHECKOUT/SAVE, men behåll radering, rensning och journal. Historikimport förblir av.

Ingen av dessa produktionsåtgärder utförs utan uttryckligt godkännande.

## Resultat för denna lokala leverans

- 50 testprogram passerade, inklusive samtliga 45 från etapp 1. Inga avvikelser hittades mellan server-/klientanalys eller mellan de tre rapportvyerna och de frysta originalrapporterna: 840 svarsmönster jämfördes sammanlagt.
- Mina testers faktiska komponent testades med alla fyra generella produkter för korrekta namn, öppningslänkar, raderingslänkar och inloggad ägare.
- Separat TypeScript-kontroll utan fel. Produktionsbygge med webpack och postbuild godkänt, 144 statiska sidor; de privata rapportvägarna är dynamiska.
- ESLint för etappens kod: 0 fel, två redan befintliga HSP-varningar (oanvänd `link` och effektens `tracking`-beroende). Inga nya varningar från extraherade rapporter eller gemensam motor.
- Exakt 38 leveransfiler: 27 nya och 11 ändrade sedan arbetsstarten. Inga övriga då befintliga filer har ändrats. Fullständig lista i etappens filmanifest, verifieringshashar och resultat lokalt under ignorerade `.artifacts/test-accounts-stage2/`.
- Produktionsschema, verkliga Stripe-priser, externa driftanslutningar, betalningar och mobilflöde har inte provats eller ändrats i produktion. Alla nya flaggor är fortsatt av som standard. Inga commits, ingen staging och ingen push.
