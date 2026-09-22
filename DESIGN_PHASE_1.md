# Designmigration fas 1

Den godkända startsidedesignen är införd på 90 routes genom 76 sidmoduler. Inga nya routes har skapats. Förhandsvisning: http://localhost:3013/adhd-test. Ändringarna är inte publicerade.

## Omfattning och skydd

- Presentationen aktiveras uttryckligen i varje migrerad sidmodul genom EditorialSurface. Den ligger inte i en delad route-layout.
- Alla testflöden (inklusive /test och nästlade /test-routes), analysövergångar, resultat och paywalls är utanför denna fas.
- /ar-min-relation-sund och /roda-flaggor-relation-test är lämnade oförändrade eftersom de innehåller testflödet direkt i samma sida.
- /integritet, /villkor och /kontakt är oförändrade. /metodik ingår som redaktionell informationssida.
- Globals.css, root-layout, footer, analytics, samtycke, testlogik, scoring, lagring, Stripe och betalningskomponenter är oförändrade.
- Metadata, canonical, robots, Pinterest-verifiering, strukturerad data och sitemap är oförändrade.

## Återanvändning

ContentGuide, GuideSection, GuideLinks, SupportNotice, SeoClusterGuide, ADHDGuide, AutismGuide, GuideNextSteps, TrackedLink, ArticleImage och Next Link återanvänds. Deras innehåll, destinationer och event-parametrar behålls. De gemensamma guidekomponenterna har endast fått presentationsmarkörer som används inom EditorialSurface.

Nya gemensamma delar:

- EditorialSurface: serverrenderad opt-in-ram för redaktionella sidor. Tillför ingen klientlogik.
- EditorialSurface.module.css: gemensam artikeltypografi, läsbredd, knappar, innehållskort, callouts och CTA-paneler. Äldre inline-stilar hanteras av avgränsade kompatibilitetsregler.
- design.module.css: startsidans befintliga färger, serif/sans-typsnitt, hörnradier, knappmått och fokusfärg. Inga globala :root-tokens.
- Brand: exakt samma två-hjärtan-symbol som på startsidan, återanvänd där sajtens header redan finns.

Startsidan återanvänder nu tokens och Brand med samma visuella utfall. Den befintliga mobilgränsen 700 px återanvänds. Inga typsnitt, bilder, UI-bibliotek eller paket har lagts till.

## Verifiering

- Produktionsbygge: npx next build godkänt; 109 statiska genereringssteg. next-sitemaps postbuild kördes inte eftersom sitemap ska bevaras.
- TypeScript: npx tsc --noEmit godkänt.
- ESLint: samtliga 82 nya/ändrade TSX-filer, inga fel eller varningar.
- git diff --check: godkänt.
- 108 HTML-sidor jämförda före/efter: identisk metadata, strukturerad data, ordning och destination för länkar samt renderad text.
- 106 unika interna länkvägar: samtliga svarade HTTP 200.
- Samtliga 90 migrerade routes kontrollerade i webbläsaren vid 320 och 1440 px: ingen horisontell overflow, korrekt serif-rubrik och inga CTA-ytor under 44 px. En H1 per sida verifierad på mobil.
- Startsidan jämförd vid 390 och 1440 px: samma 330 element med identiska mått, färger, bakgrunder, fontfamiljer, fontstorlekar, marginaler, padding, hörnradier och display-värden.
- Tangentbordsfokus verifierat på test-CTA. Navigation från ADHD-landningen till /adhd-test/test verifierad; testflödet behåller sin tidigare sans-serif-design och saknar EditorialSurface.
- Visuella stickprov av testlandningar, guide med artikelbild, äldre inline-stylad guide och dynamisk beteendesida.
- Befintliga oescapade citattecken i /psykiskt-vald/exempel kodades som HTML-entiteter för lint; visad text är identisk.
- Core Web Vitals i produktion och fysisk iOS/Safari är inte uppmätta.

## Migrerade sidmoduler och exakta filer

Varje rad motsvarar en ändrad page.tsx. Den befintliga sidans innehåll omsluts av EditorialSurface; vid behov tillkommer presentationsmarkörer för befintliga containrar, CTA:er och kort.

| Route | Fil | Typ |
| --- | --- | --- |
| /add-test | [app/add-test/page.tsx](app/add-test/page.tsx) | Guide/artikel |
| /adhd-autism | [app/adhd-autism/page.tsx](app/adhd-autism/page.tsx) | Guide/artikel |
| /adhd-i-vardagen | [app/adhd-i-vardagen/page.tsx](app/adhd-i-vardagen/page.tsx) | Guide/artikel |
| /adhd-kvinnor | [app/adhd-kvinnor/page.tsx](app/adhd-kvinnor/page.tsx) | Guide/artikel |
| /adhd-kvinnor-symtom | [app/adhd-kvinnor-symtom/page.tsx](app/adhd-kvinnor-symtom/page.tsx) | Guide/artikel |
| /adhd-och-relationer | [app/adhd-och-relationer/page.tsx](app/adhd-och-relationer/page.tsx) | Guide/artikel |
| /adhd-symtom-vuxna | [app/adhd-symtom-vuxna/page.tsx](app/adhd-symtom-vuxna/page.tsx) | Guide/artikel |
| /adhd-test | [app/adhd-test/page.tsx](app/adhd-test/page.tsx) | Testlandning |
| /adhd-utan-hyperaktivitet | [app/adhd-utan-hyperaktivitet/page.tsx](app/adhd-utan-hyperaktivitet/page.tsx) | Guide/artikel |
| /adhd-vuxna | [app/adhd-vuxna/page.tsx](app/adhd-vuxna/page.tsx) | Guide/artikel |
| /anknytning | [app/anknytning/page.tsx](app/anknytning/page.tsx) | Guide/artikel |
| /anknytningstest | [app/anknytningstest/page.tsx](app/anknytningstest/page.tsx) | Testlandning |
| /asperger-test | [app/asperger-test/page.tsx](app/asperger-test/page.tsx) | Guide/artikel |
| /autism-kvinnor | [app/autism-kvinnor/page.tsx](app/autism-kvinnor/page.tsx) | Guide/artikel |
| /autism-kvinnor-symtom | [app/autism-kvinnor-symtom/page.tsx](app/autism-kvinnor-symtom/page.tsx) | Guide/artikel |
| /autism-symtom-vuxna | [app/autism-symtom-vuxna/page.tsx](app/autism-symtom-vuxna/page.tsx) | Guide/artikel |
| /autism-test | [app/autism-test/page.tsx](app/autism-test/page.tsx) | Testlandning |
| /autism-vuxna | [app/autism-vuxna/page.tsx](app/autism-vuxna/page.tsx) | Guide/artikel |
| /beteenden | [app/beteenden/page.tsx](app/beteenden/page.tsx) | Beteendeöversikt |
| /brak-i-relation | [app/brak-i-relation/page.tsx](app/brak-i-relation/page.tsx) | Guide/artikel |
| /bygga-upp-tillit-efter-otrohet | [app/bygga-upp-tillit-efter-otrohet/page.tsx](app/bygga-upp-tillit-efter-otrohet/page.tsx) | Guide/artikel |
| /destruktivt-forhallande | [app/destruktivt-forhallande/page.tsx](app/destruktivt-forhallande/page.tsx) | Guide/artikel |
| /digitalt-vald | [app/digitalt-vald/page.tsx](app/digitalt-vald/page.tsx) | Guide/artikel |
| /ekonomiskt-vald | [app/ekonomiskt-vald/page.tsx](app/ekonomiskt-vald/page.tsx) | Guide/artikel |
| /emotionellt-otillganglig-partner | [app/emotionellt-otillganglig-partner/page.tsx](app/emotionellt-otillganglig-partner/page.tsx) | Guide/artikel |
| /gaslighting-relation | [app/gaslighting-relation/page.tsx](app/gaslighting-relation/page.tsx) | Guide/artikel |
| /glider-isar | [app/glider-isar/page.tsx](app/glider-isar/page.tsx) | Guide/artikel |
| /granser-i-relation | [app/granser-i-relation/page.tsx](app/granser-i-relation/page.tsx) | Guide/artikel |
| /grona-flaggor-relation | [app/grona-flaggor-relation/page.tsx](app/grona-flaggor-relation/page.tsx) | Guide/artikel |
| /har-jag-adhd | [app/har-jag-adhd/page.tsx](app/har-jag-adhd/page.tsx) | Guide/artikel |
| /har-jag-autism | [app/har-jag-autism/page.tsx](app/har-jag-autism/page.tsx) | Guide/artikel |
| /jag-ar-radd-att-min-partner-ska-sla-mig | [app/jag-ar-radd-att-min-partner-ska-sla-mig/page.tsx](app/jag-ar-radd-att-min-partner-ska-sla-mig/page.tsx) | Guide/artikel |
| /kontrollerande-relation | [app/kontrollerande-relation/page.tsx](app/kontrollerande-relation/page.tsx) | Guide/artikel |
| /love-bombing-relation | [app/love-bombing-relation/page.tsx](app/love-bombing-relation/page.tsx) | Guide/artikel |
| /manipulativ-partner | [app/manipulativ-partner/page.tsx](app/manipulativ-partner/page.tsx) | Guide/artikel |
| /maskering-autism | [app/maskering-autism/page.tsx](app/maskering-autism/page.tsx) | Guide/artikel |
| /medberoende | [app/medberoende/page.tsx](app/medberoende/page.tsx) | Guide/artikel |
| /medberoende-i-relation | [app/medberoende-i-relation/page.tsx](app/medberoende-i-relation/page.tsx) | Guide/artikel |
| /medberoendetest | [app/medberoendetest/page.tsx](app/medberoendetest/page.tsx) | Testlandning |
| /metodik | [app/metodik/page.tsx](app/metodik/page.tsx) | Guide/artikel |
| /narcissism-sjalvtest | [app/narcissism-sjalvtest/page.tsx](app/narcissism-sjalvtest/page.tsx) | Testlandning |
| /narcissist-i-en-relation | [app/narcissist-i-en-relation/page.tsx](app/narcissist-i-en-relation/page.tsx) | Guide/artikel |
| /olika-sexlust-i-relation | [app/olika-sexlust-i-relation/page.tsx](app/olika-sexlust-i-relation/page.tsx) | Guide/artikel |
| /otrohet-i-relation | [app/otrohet-i-relation/page.tsx](app/otrohet-i-relation/page.tsx) | Guide/artikel |
| /partner-ljuger | [app/partner-ljuger/page.tsx](app/partner-ljuger/page.tsx) | Guide/artikel |
| /psykisk-misshandel | [app/psykisk-misshandel/page.tsx](app/psykisk-misshandel/page.tsx) | Guide/artikel |
| /psykisk-misshandel-relation | [app/psykisk-misshandel-relation/page.tsx](app/psykisk-misshandel-relation/page.tsx) | Guide/artikel |
| /psykiskt-vald | [app/psykiskt-vald/page.tsx](app/psykiskt-vald/page.tsx) | Guide/artikel |
| /psykopatiska-drag-relation | [app/psykopatiska-drag-relation/page.tsx](app/psykopatiska-drag-relation/page.tsx) | Guide/artikel |
| /roda-flaggor-relation | [app/roda-flaggor-relation/page.tsx](app/roda-flaggor-relation/page.tsx) | Guide/artikel |
| /silent-treatment-relation | [app/silent-treatment-relation/page.tsx](app/silent-treatment-relation/page.tsx) | Guide/artikel |
| /skillnad-psykopat-narcissist | [app/skillnad-psykopat-narcissist/page.tsx](app/skillnad-psykopat-narcissist/page.tsx) | Guide/artikel |
| /stanna-eller-ga | [app/stanna-eller-ga/page.tsx](app/stanna-eller-ga/page.tsx) | Guide/artikel |
| /stonewalling-relation | [app/stonewalling-relation/page.tsx](app/stonewalling-relation/page.tsx) | Guide/artikel |
| /sund-relation | [app/sund-relation/page.tsx](app/sund-relation/page.tsx) | Guide/artikel |
| /svartsjuk-partner | [app/svartsjuk-partner/page.tsx](app/svartsjuk-partner/page.tsx) | Guide/artikel |
| /tecken-pa-psykopat | [app/tecken-pa-psykopat/page.tsx](app/tecken-pa-psykopat/page.tsx) | Guide/artikel |
| /traumabindning-i-relation | [app/traumabindning-i-relation/page.tsx](app/traumabindning-i-relation/page.tsx) | Guide/artikel |
| /vald-i-nara-relation | [app/vald-i-nara-relation/page.tsx](app/vald-i-nara-relation/page.tsx) | Guide/artikel |
| /adhd-och-relationer/partner-med-adhd | [app/adhd-och-relationer/partner-med-adhd/page.tsx](app/adhd-och-relationer/partner-med-adhd/page.tsx) | Guide/artikel |
| /anknytning/angslig-anknytning | [app/anknytning/angslig-anknytning/page.tsx](app/anknytning/angslig-anknytning/page.tsx) | Guide/artikel |
| /anknytning/desorganiserad-anknytning | [app/anknytning/desorganiserad-anknytning/page.tsx](app/anknytning/desorganiserad-anknytning/page.tsx) | Guide/artikel |
| /anknytning/trygg-anknytning | [app/anknytning/trygg-anknytning/page.tsx](app/anknytning/trygg-anknytning/page.tsx) | Guide/artikel |
| /anknytning/undvikande-anknytning | [app/anknytning/undvikande-anknytning/page.tsx](app/anknytning/undvikande-anknytning/page.tsx) | Guide/artikel |
| /beteenden/[slug] | [app/beteenden/[slug]/page.tsx](app/beteenden/[slug]/page.tsx) | Guide/artikel |
| /granser-i-relation/partner-blir-arg-nar-jag-sager-nej | [app/granser-i-relation/partner-blir-arg-nar-jag-sager-nej/page.tsx](app/granser-i-relation/partner-blir-arg-nar-jag-sager-nej/page.tsx) | Guide/artikel |
| /medberoende/bryta-medberoende | [app/medberoende/bryta-medberoende/page.tsx](app/medberoende/bryta-medberoende/page.tsx) | Guide/artikel |
| /medberoende/tecken | [app/medberoende/tecken/page.tsx](app/medberoende/tecken/page.tsx) | Guide/artikel |
| /psykiskt-vald/bevis | [app/psykiskt-vald/bevis/page.tsx](app/psykiskt-vald/bevis/page.tsx) | Guide/artikel |
| /psykiskt-vald/exempel | [app/psykiskt-vald/exempel/page.tsx](app/psykiskt-vald/exempel/page.tsx) | Guide/artikel |
| /psykiskt-vald/hjalp | [app/psykiskt-vald/hjalp/page.tsx](app/psykiskt-vald/hjalp/page.tsx) | Guide/artikel |
| /psykiskt-vald/ny-lag-2026 | [app/psykiskt-vald/ny-lag-2026/page.tsx](app/psykiskt-vald/ny-lag-2026/page.tsx) | Guide/artikel |
| /psykiskt-vald/polisanmalan | [app/psykiskt-vald/polisanmalan/page.tsx](app/psykiskt-vald/polisanmalan/page.tsx) | Guide/artikel |
| /psykiskt-vald/straff | [app/psykiskt-vald/straff/page.tsx](app/psykiskt-vald/straff/page.tsx) | Guide/artikel |
| /psykiskt-vald/vad-raknas-som | [app/psykiskt-vald/vad-raknas-som/page.tsx](app/psykiskt-vald/vad-raknas-som/page.tsx) | Guide/artikel |
| /stanna-eller-ga/gar-relationen-att-radda | [app/stanna-eller-ga/gar-relationen-att-radda/page.tsx](app/stanna-eller-ga/gar-relationen-att-radda/page.tsx) | Guide/artikel |

### De 15 routes som renderas av beteenden/[slug]

- /beteenden/partner-anklagar-mig-for-otrohet
- /beteenden/partner-bestammer-vad-jag-far-ha-pa-mig
- /beteenden/partner-fornekar-saker-som-hant
- /beteenden/partner-hotar-att-gora-slut
- /beteenden/partner-hotar-att-skada-sig-sjalv
- /beteenden/partner-ignorerar-mig-som-straff
- /beteenden/partner-isolerar-mig
- /beteenden/partner-kontrollerar-min-ekonomi
- /beteenden/partner-kontrollerar-min-mobil
- /beteenden/partner-kraver-mitt-losenord
- /beteenden/partner-laser-mina-meddelanden
- /beteenden/partner-sager-att-jag-ar-for-kanslig
- /beteenden/partner-skyller-allt-pa-mig
- /beteenden/partner-vill-veta-var-jag-ar
- /beteenden/svartsjuk-kontrollerande-partner

## Övriga ändrade och nya filer

| Fil | Ändring |
| --- | --- |
| [app/page.tsx](app/page.tsx) | Återanvänder Brand; visuellt oförändrad. |
| [app/home.module.css](app/home.module.css) | Återanvänder extraherade designvärden; visuellt oförändrad. |
| [app/_components/ContentGuide.tsx](app/_components/ContentGuide.tsx) | Presentationsmarkörer på container, relaterade länkkort och stödnotis. |
| [app/_components/SeoClusterGuide.tsx](app/_components/SeoClusterGuide.tsx) | Presentationsmarkör på artikelcontainern. |
| [app/_components/GuideNextSteps.tsx](app/_components/GuideNextSteps.tsx) | Presentationsmarkörer på CTA-panel och spårade länkar; event/params oförändrade. |
| [app/_components/Brand.tsx](app/_components/Brand.tsx) | Ny gemensam varumärkeskomponent med befintlig hjärtsymbol. |
| [app/_components/EditorialSurface.tsx](app/_components/EditorialSurface.tsx) | Ny opt-in-ram för migrerade sidor. |
| [app/_components/EditorialSurface.module.css](app/_components/EditorialSurface.module.css) | Nya avgränsade gemensamma presentationsregler. |
| [app/_styles/design.module.css](app/_styles/design.module.css) | Nya delade tokens extraherade från startsidan. |
| [DESIGN_PHASE_1.md](DESIGN_PHASE_1.md) | Denna migrations- och verifieringsrapport. |
