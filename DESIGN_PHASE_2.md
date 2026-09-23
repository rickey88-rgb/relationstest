# Visuell migration – fas 2

12 test-routes har migrerats till startsidans godkända designsystem. Frågor, svar, analysövergångar, teasers, paywalls, resultat, delområden och rekommendationer omfattas. Ingen deploy har gjorts.

## Gemensam presentation

Ny serverkomponent: TestShell, som återanvänder Brand, EditorialSurface och befintliga design tokens. TestShell.module.css är en avgränsad utökning av fas 1:s presentation. Befintliga JSX-element märks med data-flow för frågekort, frågetext, svar via aria-pressed, progress/diagram, analys, paywall, resultatkort, inset-kort, grid och CTA. Inga nya stateful testkomponenter eller alternativa beräkningsmodeller har skapats.

Knappar har minst 52 px höjd, tydlig focus/hover/pressed, rosé köp-CTA och neutrala sekundära handlingar. Diagrammens data och dimensioner är oförändrade. Analysindikatorn respekterar prefers-reduced-motion. Befintlig låsemoji visas som en diskret CSS-symbol. Psykisk misshandel-testets svar får aria-pressed från samma befintliga svarsvärde. Footerns färganpassning gäller bara sidor med TestShell.

På de två gratis testerna ligger den allmänna förklaringssektionen nu efter själva testet. Texten finns kvar; den första frågan kommer tidigare på mobil.

## Routes och verifiering

| Route | Mobil genom hela flödet | Desktop genom hela flödet | Paywall och upplåst resultat |
| --- | --- | --- | --- |
| /test | Ja, 42 frågor | Ja | Ja |
| /adhd-test/test | Ja, 30 frågor | Ja | Ja |
| /autism-test/test | Ja, 30 frågor | Ja | Ja |
| /narcissism-sjalvtest/test | Ja, 30 frågor | Ja | Ja |
| /gaslightingtest/test | Ja, 30 frågor | Ja | Ja |
| /anknytningstest/test | Ja, 30 frågor | Ja | Ja |
| /psykisk-misshandel-relation/test | Ja, 30 frågor | Ja | Ja |
| /medberoendetest/test | Ja, 30 frågor | Ej separat komplett UI-körning | Ja |
| /narcissist-i-en-relation/test | Ja, 30 frågor | Ej separat komplett UI-körning | Ja |
| /traumabindningtest/test | Ja, 30 frågor | Ej separat komplett UI-körning | Ja |
| /ar-min-relation-sund | Ja, 12 frågor | Ja | Gratis resultat, ingen paywall |
| /roda-flaggor-relation-test | Ja, 12 frågor | Ja | Gratis resultat, ingen paywall |

Mobil: 390 px. Desktop: 1440 px. Samtliga tolv resultatvyer kontrollerades även vid 320 px; ett långt diagramnamn fick förbättrad radbrytning för att hålla poängetiketten inom kortet. Flödena kördes via riktiga UI-klick i den lokala produktionsbyggnaden med syntetiska svar och avvisad statistik. Betalbara resultat låstes upp med den befintliga lokala paid=true-returen och kontrollerades efter omladdning. Ingen riktig betalning eller Stripe-redirect gjordes i webbläsaren.

## Kontroller

- Production build: godkänd med npx next build; sitemap/postbuild kördes inte.
- TypeScript: npx tsc --noEmit godkänd.
- Befintliga tester: 29/29 godkända i åtta testfiler.
- Utökad isolerad komponentkontroll: samtliga tio verkliga betalbara sidkomponenter passerar dubbelklick, 219/220 ms-gränsen, sista svaret, sparade svar, exakt 3 000 ms analys, dubbel checkout, paid=true och beständig upplåsning efter ny mount. Checkout utfördes mot en simulerad window.location, utan nätverk eller köp.
- Befintlig recovery/analytics-svit passerar: fliksynk, blockerad lagring, återställd betalning, checkout-spärr, consent, eventnamn/parametrar, purchase 39 SEK och deduplicering.
- Källkodsjämförelse: alla 27 ändrade befintliga filer är likadana efter att presentationsattribut, serverwrapper, låsmarkering och den avsiktligt flyttade informationssektionen räknats bort. Inga handlers, state, timers, scoring, copy, Stripe-länkar, metadata eller analytics-uttryck ändrades.
- HTML-jämförelse: samma metadata, schema och länkar på alla 108 byggda HTML-sidor. De 96 sidorna utanför migreringen har identiskt sidinnehåll/HTML, inklusive startsidan och fas 1, efter normalisering av befintligt byggdatum på /integritet och /villkor. Dessa två sidors automatiska datum gick från 2026-09-22 till 2026-09-23 under arbetet; deras källkod är oförändrad. Befintliga gemensamma designsystemfiler och globala CSS-regler är oförändrade.
- Lint: INTE helt grön sedan tidigare. Samma 5 fel och 10 varningar före och efter; inga nya fynd. Felen kommer från react-hooks/refs på befintlig tracking.paywallRef i äldre tester. Varningarna gäller befintliga hook-beroenden och oanvänd funktion. TestShell har 0 fel och 0 varningar. Ingen logik eller lint-konfiguration ändrades för att dölja detta.
- git diff --check: godkänd.

## Avgränsningar och manuell kontroll

Love bombing och destruktiv relation har inga separata aktiva test-routes; deras redan migrerade guider och screeningens områden finns kvar. Ingen aktiv test-route har utelämnats. /kontakt, /integritet och /villkor är informations-/villkorssidor utan testflöden och lämnades oförändrade, liksom startsidan och de 90 fas 1-routes som skulle bevaras.

Riktig Stripe-betalning, mottagning i GA4 och fysisk iPhone/Safari med browser chrome har inte provats. Kontrollera dessa i relevant testmiljö före deploy. Desktopwebbläsarens mobilviewport ersätter inte en fysisk Safari-kontroll. Befintlig beteendedetalj: reload mitt under 220 ms-övergången kan återställa den senaste frågan med svaret redan markerat; svaret är sparat. Ingen ändring gjordes i detta state-flöde.

## Exakt ändrade filer

- app/_components/PaywallCheckoutCTA.tsx
- app/_components/PostPurchaseRecommendation.tsx
- app/_components/ShareTest.tsx
- app/_components/TestShell.module.css
- app/_components/TestShell.tsx
- app/adhd-test/test/layout.tsx
- app/adhd-test/test/page.tsx
- app/anknytningstest/test/layout.tsx
- app/anknytningstest/test/page.tsx
- app/ar-min-relation-sund/HealthyRelationshipTest.tsx
- app/ar-min-relation-sund/page.tsx
- app/autism-test/test/layout.tsx
- app/autism-test/test/page.tsx
- app/gaslightingtest/test/layout.tsx
- app/gaslightingtest/test/page.tsx
- app/medberoendetest/test/layout.tsx
- app/medberoendetest/test/page.tsx
- app/narcissism-sjalvtest/test/layout.tsx
- app/narcissism-sjalvtest/test/page.tsx
- app/narcissist-i-en-relation/test/layout.tsx
- app/narcissist-i-en-relation/test/page.tsx
- app/psykisk-misshandel-relation/test/layout.tsx
- app/psykisk-misshandel-relation/test/page.tsx
- app/roda-flaggor-relation-test/Quickcheck.tsx
- app/roda-flaggor-relation-test/page.tsx
- app/test/layout.tsx
- app/test/page.tsx
- app/traumabindningtest/test/layout.tsx
- app/traumabindningtest/test/page.tsx
- DESIGN_PHASE_2.md (denna rapport)

Totalt: 27 befintliga kodfiler, 2 nya presentationsfiler och denna rapport. Brand, EditorialSurface, design tokens, root-layout, globala stilar, analytics, betalningshook, testmodeller och testfiler är oförändrade.

Lokala verifieringsunderlag ligger i ignorerade .cache/design-phase2/: source-invariants.json, html-invariants.json, lint.json och all-flows.json med tillhörande skript och före-versioner.
