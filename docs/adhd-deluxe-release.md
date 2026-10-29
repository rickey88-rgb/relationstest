# ADHD DELUXE – isolerad release, utgåva 1.1

Förberedd lokalt den 29 oktober 2026. Branch: `release/adhd-deluxe-v1-1`.
Basen är GitHub main och verifierad Vercel Production: `dd4a00a4390786f793d8cb496932709c7e0fa473`.
Den äldre lokala projektkopian uppdaterades först i denna isolerade kopia; originalprojektet ändrades inte.

**Produktionsförberedelser uppdaterade 29 oktober 2026 efter ägarens uttryckliga godkännande:** de tre PDF-filerna har laddats upp till privat R2 och lästs tillbaka med identiska SHA-256. Endast de tre angivna Vercel-variablerna har sparats för Production. Ingen push, kodpublicering, ompublicering, Stripe-ändring eller betald provtransaktion har utförts. Separat godkännande krävs fortfarande före push och publicering. Se `adhd-deluxe-production-prep.md` för genomförda driftkontroller och kvarstående verifiering.

## Inventering av den tidigare ADHD-boken

- Landning: `/adhd-deluxe`. Äldre text angav 16 kapitel, ett femfrågesystem och en personlig erfarenhetsbok. Den nya boken har 14 kapitel, 28 verktyg och 10 separata A4-arbetsblad.
- Startsida: ADHD-kortet visade den gamla `adhd-bok-mockup.png` och ”Kommer snart”, utan boklänk.
- Privat leverans: Stripe-verifierad retur på `/adhd-deluxe/tack?session_id={CHECKOUT_SESSION_ID}` utfärdar den signerade, HttpOnly produktcookien `rv_adhd_deluxe_book_access`.
- `/api/books/adhd-deluxe/download` kontrollerar cookien och skapar en signerad R2-länk som gäller i 60 sekunder. Huvudfilen konfigureras med `ADHD_DELUXE_BOOK_R2_KEY`.
- Den tidigare Vercel-nyckeln var `books/adhd-deluxe/ADHD-Deluxe_Elias-Voss.pdf`. Det gamla objektet finns kvar orört i `relationsvarning-private`, 9,33 MB, ändrat 8 oktober 2026. Den nya konfigurationen använder versionsnycklarna nedan; den börjar gälla vid nästa godkända deployment. Bucketens dashboard visar fortsatt **Public Access: Disabled**.
- ADHD-försäljningen är pausad med `ADHD_DELUXE_SALE_ENABLED=false`. Autismförsäljningen är aktiv i basen och har lämnats oförändrad.

### Befintlig Stripe-konfiguration – direkt verifierad, oförändrad

| | Ordinarie | Analyserbjudande |
| --- | --- | --- |
| Belopp | 149 SEK, engångsköp | 99 SEK, engångsköp |
| Product | `prod_VOqtgXhtdgZKMy` | `prod_VOqwK7476vttvG` |
| Nuvarande namn | ADHD Deluxe – digital bok | ADHD Deluxe – digital bok kundpris |
| Price | `price_1UO3C0AgF4ugWkEkklryPLKO` | `price_1UO3F6AgF4ugWkEkRCM7L9yX` |
| Payment Link | `plink_1UO3CpAgF4ugWkEkyWAfIbus` | `plink_1UO3FGAgF4ugWkEkniqT0FGP` |
| Köp-URL | `https://buy.stripe.com/9B614melj8Mp5Kngrm0gw0x` | `https://buy.stripe.com/6oU28q3GF3s5fkXa2Y0gw0y` |

Båda länkarna är aktiva i live mode. Deras faktiska prisrader, belopp och produkter är kontrollerade. Båda behåller exakt `https://www.relationsvarning.se/adhd-deluxe/tack?session_id={CHECKOUT_SESSION_ID}`. Produktnamnen matchar redan den nya boktiteln; inget namnbyte krävs. Ingen pris-, Payment Link-, returadress-, skatte- eller produktkartändring behövs. Ingen riktig betalning har gjorts.

## Genomförda ändringar

- Helt ny ADHD-landning med hero, ägarens nya mockup, korrekt säljtext, innehåll, sex faktiska verktygsexempel, alla kapitel, arbetsblad, målgrupp, FAQ och köpknappar för de två befintliga erbjudandena.
- Fyra verkliga utdrag från bokutgåva 1.1: boksidor 8, 10 och 43 samt A01 ur arbetsbladens utskriftsversion. Dessa rasterutdrag är offentliga. Hela kundfiler är inte offentliga.
- Separat ADHD-galleri med förstoring, större läsläge, föregående/nästa, piltangenter, Escape och återställt tangentbordsfokus. Övriga böckers gallerier är orörda.
- Startsidan ändras endast i ADHD-kortet: ny bild, titel, text, omfattning och länk till landningen. Det äldre mockup-filnamnet innehåller nu samma nya bild, så inga dolda ADHD-ytor kan visa det äldre omslaget.
- Ny titel/utgåva i bokmetadata och tre tydliga nedladdningar efter köp: bok, ifyllbara blad och utskriftsblad.
- Samma cookie- och privata R2-modell som autismboken. Den befintliga nedladdningsrutten väljer endast `book`, `worksheets` eller `print`; klienten får aldrig ange en lagringsnyckel eller främmande URL. Okända val avvisas.
- ADHD-köp verifieras som live, completed/paid, payment mode, SEK, en befintlig ADHD Payment Link, en tillåten prisrad, antal ett och rätt befintligt belopp. PaymentIntent måste ha lyckats och Charge vara betald och debiterad utan återbetalning eller tvist. Övriga bokverifierare är oförändrade.

## Avgränsning

Ingen migrering, historisk kundåtkomst, fallback till gammal PDF, ny kontomodell eller databasändring har byggts. Den tidigare boken ersätts helt av utgåva 1.1 vid aktivering.

Mina sidor-kandidaten, andra boklandningar och leveransrutter, testfrågor, analyspriser, paywalls, Payment Links och delad produktkarta ändras inte. Även de gemensamma försäljningsflaggorna och rekommendationskatalogen är oförändrade. Scope-testet jämför mot den aktuella produktionsbasen, inklusive att hemsidans diff enbart gäller ADHD-kortet och att andra funktioner i den delade bokfilen är identiska.

## Privata kundfiler

Ägarens nya PDF från den färdiga bokproduktionen används utan innehållsändring. Mockupkälla: `C:/Users/thoma/OneDrive/Skrivbord/adhddeluxemockup.png`, 1064 × 1479 pixlar. PDF-filerna förbereds lokalt i den git-ignorerade katalogen `.artifacts/adhd-deluxe/private/` och ingår inte i `public`, Git-diffen eller appens kodimporter.

Exakta filnamn, storlekar, SHA-256 och verifierade privata R2-nycklar finns i `adhd-deluxe-release-assets.json`. Följande tre utgivningsobjekt har laddats upp:

| Fil | R2-nyckel |
| --- | --- |
| ADHD-DELUXE_Elias-Voss_v1.1.pdf | `books/adhd-deluxe/v1.1/ADHD-DELUXE_Elias-Voss.pdf` |
| ADHD-DELUXE_Arbetsblad_Ifyllbara_v1.1.pdf | `books/adhd-deluxe/v1.1/Arbetsblad_Ifyllbara.pdf` |
| ADHD-DELUXE_Arbetsblad_Utskrift_v1.1.pdf | `books/adhd-deluxe/v1.1/Arbetsblad_Utskrift.pdf` |

Samtliga tre filer har hämtats tillbaka från R2 och jämförts med originalen: alla SHA-256 stämmer. Den gamla privata filen har inte raderats eller skrivits över.

## Lokal granskning och reproduktion

Med låsta projektberoenden installerade:

1. Starta `next dev` med `ADHD_DELUXE_LOCAL_PREVIEW=1` och de två befintliga publika 79 SEK-länkar som projektet redan behöver för ADHD- och autismtestet. Dessa testlänkar ska bevaras. Previewväxeln fungerar endast när `NODE_ENV=development`; den ger ingen filåtkomst och kan inte aktivera försäljning i produktion.
2. Granska `/adhd-deluxe`, `/adhd-deluxe?offer=analysis` och `/#bocker`.
3. Kör `node scripts/test-adhd-deluxe-release.cjs` och `node scripts/test-autism-book-release.cjs --output .artifacts/adhd-deluxe/inherited-regressions.json`. Testerna använder syntetiska Stripe-data och en lokal HTTP-lagringsmodell, aldrig riktiga betalningar eller R2-skrivningar.
4. Kör `python scripts/adhd-deluxe-verify-pdfs.py` efter leveranstestet. Det kräver `pypdf` och jämför de verkliga filernas byte, 120/10/10 sidor och alla 50 formulärfält, inklusive spara/öppna igen.
5. Kör TypeScript, ESLint för ändrade filer och `next build --webpack`. Stoppa dev-servern före produktionsbygget. Produktionsbygget ska behålla den avstängda ADHD-försäljningen. `next-sitemap` kan köras efter en direkt Next-build; genererade tidsstämpeländringar i övriga sidors sitemap ingår inte i denna release.

De 213 leveranskontrollerna omfattar båda befintliga prisnivåerna, tre riktiga PDF-strömmar, oförändrade filhashar, separata filnycklar, obehöriga/förfalskade/utgångna cookies, cookies för andra böcker, felaktiga filer, utebliven konfiguration och 22 nekade betalningsfall. Den verkliga AWS-signeringen provas separat för 60 sekunders giltighet. Kontrollerna har körts om med de faktiska filerna återlästa från R2. Den lokala testlagringen ersätter externa tjänster; hela kedjan från den nya produktionsappen via signerade R2-länkar återstår efter godkänd publicering.

## Genomförd slutkontroll

- 24 av 24 riktade testprogram godkända: nio i ADHD-releasen och femton befintliga regressionsprogram.
- 213 kontroller av betalning, cookie, tre filströmmar och signering godkända.
- 50 HTTP-kontroller mot det faktiska lokala produktionsbygget godkända, inklusive att utvecklingspreview inte öppnar försäljning i produktion.
- Verkliga PDF-filer jämförda efter lokal leverans: identiska SHA-256, 120/10/10 sidor, 50 tomma interaktiva fält i rätt arbetsbladsfil. Samtliga 50 fält sparade och öppnade igen med svenska tecken.
- TypeScript utan fel. Produktionsbygge med Webpack godkänt, inklusive alla 152 genererade sidor. Sitemap-generering godkänd; dess orelaterade tidsstämpeldiff återställd.
- Ändrade JavaScript-/TypeScript-filer: noll ESLint-fel och noll varningar. Projektets 17 befintliga ESLint-fel ligger i basfiler vars innehåll är oförändrat.
- Desktop och mobil visuellt granskade. 320, 390, 768 och 1440 pixels bredd har kontrollerats utan sidledsöverflöde. Galleri, större läsläge, nästa/föregående, Escape och återställt fokus har provats.
- 167 produktionsspårfiler kontrollerade: inga importer av de tre privata kund-PDF:erna. Inga kompletta nya ADHD-filer i public.

## Vad som återstår före push och publicering

**Innan någon push eller publicering: ägarens separata godkännande av den slutliga diffen. Uppladdning och de tre miljövariablerna är redan genomförda inom det tidigare uttryckliga godkännandet.**

1. Kontrollera att main och Vercel Production fortfarande motsvarar den granskade basen. Vid nyare ändringar ska bara denna ADHD-diff integreras och relevanta kontroller köras om. Mina sidor-kandidaten får inte blandas in eller ändras.
2. Klart: de tre manifestkontrollerade PDF-filerna ligger på separata versionsnycklar i den befintliga privata bucketen. Återläsning ger identiska SHA-256. Public Access Disabled har bevarats. Inga nya publika URL:er, behörigheter eller hemligheter har skapats.
3. Klart: endast `ADHD_DELUXE_BOOK_R2_KEY` har uppdaterats och `ADHD_DELUXE_WORKSHEETS_R2_KEY` samt `ADHD_DELUXE_WORKSHEETS_PRINT_R2_KEY` lagts till för Production enligt env-exemplet. Delade R2-/Stripe-/tokenvärden och andra produkters variabler har bevarats. Ingen deployment har startats; värdena gäller nästa deployment.
4. Publicera först med ADHD-försäljningen fortsatt pausad. Verifiera alla tre auktoriserade nedladdningar, faktiska filer, 403 utan åtkomst och båda erbjudandenas länkar i den riktiga miljön. Ingen betald provtransaktion ingår utan särskilt mandat.
5. Aktivera därefter endast ADHD-bokens försäljningsflagga efter godkännande. Observera att den befintliga gemensamma flaggan också styr ADHD-bokens rekommendation efter testet. Om även den aktiveringen ska ingå måste den uttryckligen omfattas av publiceringsgodkännandet; testens egna priser och paywalls ska fortfarande vara oförändrade.
6. Vid fel: håll ADHD-försäljningen pausad och återgå till en fungerande ADHD-releasekonfiguration. Andra böcker, konton, tester och gemensamma hemligheter ska inte påverkas. Inga tidigare kundmigreringar behövs enligt ägarens besked. Efter första nya försäljningen måste samtliga tre utlovade filer fortsätta kunna levereras även under en eventuell paus.

## Praktiska begränsningar

Den ärvda produktcookien gäller i 180 dagar och binder produkt, inte en viss Stripe Session. Återbetalningar och tvister kontrolleras före utfärdande; de omprövas inte vid varje nedladdning under en redan utfärdad cookie. Rensade cookies eller byte av webbläsare kräver manuell support, precis som den nuvarande bokmodellen. Ingen automatisk e-postleverans eller Mina sidor-integration utlovas.

Hela projektets ESLint har 17 fel i oförändrade basfiler. Dessa är dokumenterade och har inte döljts genom regeländringar eller ändringar i andra testflöden. Ändrade releasefiler kontrolleras separat.

Produktionsbasen innehåller också den tidigare tillfälliga offentliga AuDHD-supportfilen. Den är en annan bok och har lämnats orörd. Att denna nya ADHD-release inte exponerar kompletta PDF-filer ska inte tolkas som att hela webbplatsen saknar andra offentliga bokfiler.
