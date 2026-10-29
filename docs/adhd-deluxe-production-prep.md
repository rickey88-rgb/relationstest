# ADHD DELUXE – verifierade produktionsförberedelser

Utfört 29 oktober 2026 efter ägarens uttryckliga godkännande av privat filuppladdning och exakt tre Vercel-variabler. Ingen push, deployment, ompublicering, försäljningsaktivering, Stripe-ändring eller betald provtransaktion har utförts.

## Kod och produktionsbas

- Isolerad branch: `release/adhd-deluxe-v1-1`.
- Granskad applikationskod: `712c343ed5954ec79be4e7c40695da3dadbecddb`.
- GitHub main och Vercel Production: `dd4a00a4390786f793d8cb496932709c7e0fa473`.
- Production-deployment: `92954HUx9DXChBDU8tNnL8CmyqaK`, Ready, `relationstest-5vbx3k8na-rickey88-rgbs-projects.vercel.app`.
- Main är en direkt anfader till releasen. Inga senare main-ändringar finns att integrera vid denna kontroll. Autismbokreleasen ingår i basen och har bevarats.
- Endast dokumentationen har uppdaterats efter den granskade applikationscommitten. Slutrapporten anger den slutliga lokala releasecommitten.

## R2: genomförd uppladdning och återläsning

Bucket: `relationsvarning-private`. Public Access är fortsatt Disabled. Tre nya objekt skapades under `books/adhd-deluxe/v1.1/`; äldre objekt har inte skrivits över eller raderats. Inga bucketbehörigheter, publika domäner eller lagringshemligheter har ändrats.

| Objekt under versionsprefixet | Byte | SHA-256 efter faktisk R2-återläsning |
| --- | ---: | --- |
| `ADHD-DELUXE_Elias-Voss.pdf` | 12978467 | `621a4c64848ef4204ab05cbecb96f6a4cdb486b208816163ec2e384d316719cb` |
| `Arbetsblad_Ifyllbara.pdf` | 110695 | `045bfadea1864bf906736da177bc136146e8292ed0a4a4949c960f0b815bc823` |
| `Arbetsblad_Utskrift.pdf` | 65662 | `d3ff80672d49accf02cb8949a10b3b35921f59757565617bda6f3d418a07ccf1` |

Alla tre matchar exakt de godkända originalen och releasemanifestet. De återlästa filerna har 120, 10 respektive 10 sidor. Den ifyllbara versionen har 50 tomma formulärfält; utskriftsversionen har inga formulärfält. Alla 50 fält har provats med svenska tecken och sparats/öppnats igen i det lokala testet.

## Vercel: exakt genomförda inställningar

Endast Production, typ Config. De sparade värdena har lästs tillbaka från Vercels gränssnitt och jämförts med manifestet.

| Variabel | Åtgärd | Sparat värde |
| --- | --- | --- |
| `ADHD_DELUXE_BOOK_R2_KEY` | Uppdaterad befintlig | `books/adhd-deluxe/v1.1/ADHD-DELUXE_Elias-Voss.pdf` |
| `ADHD_DELUXE_WORKSHEETS_R2_KEY` | Tillagd | `books/adhd-deluxe/v1.1/Arbetsblad_Ifyllbara.pdf` |
| `ADHD_DELUXE_WORKSHEETS_PRINT_R2_KEY` | Tillagd | `books/adhd-deluxe/v1.1/Arbetsblad_Utskrift.pdf` |

Inga andra miljövariabler eller hemligheter har ändrats. Vercel bekräftade att en ny deployment krävs för att värdena ska börja gälla; ingen sådan har startats. Nuvarande Production använder sin befintliga miljöbild. Markeringen Needs Attention beror på att Vercel tolkar variabelnamn som slutar på KEY som möjliga hemligheter. Värdena ovan är enbart objektsökvägar och innehåller inga autentiseringsuppgifter; den befintliga Config-typen har bevarats.

## Stripe: kontrollerat utan ändringar

Båda befintliga live Payment Links är aktiva. Produktnamnen är redan ADHD Deluxe – digital bok respektive ADHD Deluxe – digital bok kundpris. Prisraderna är 14900 respektive 9900 öre i SEK, engångsköp, antal ett, med exakt de produkt- och Price-ID:n som dokumenteras i `adhd-deluxe-release.md`. Båda länkarna returnerar till `https://www.relationsvarning.se/adhd-deluxe/tack?session_id={CHECKOUT_SESSION_ID}`. Inga namn, priser, länkar eller returadresser har ändrats.

## Verifiering och avgränsning

- 9 av 9 releaseprogram och 15 av 15 ärvda regressionsprogram godkända efter uppladdningen.
- 213 kontroller av betalning, cookie, tre filströmmar och signering godkända med de faktiska R2-återlästa PDF-filerna som testunderlag. 22 negativa betalningsfall avvisas.
- 50 HTTP-kontroller mot det faktiska lokala produktionsbygget godkända. Tre filknappar, obehörig åtkomst, returflöde och stängd försäljning ingår. Utvecklingspreview kan inte öppna produktionsförsäljningen.
- Återlästa PDF-filer har verifierats igen efter leveranstesterna: identiska byte och korrekta sidor/formulärfält.
- TypeScript, tidigare produktionsbygge för samma applikationskod (152 sidor) och riktad lint är godkända. Hela projektets 17 ärvda ESLint-fel i oförändrade filer kvarstår; inga regler har försvagats.
- Scope-kontrollen skyddar autismboken, andra bokverifierare, testpriser/paywalls, Mina sidor och gemensamma försäljningsflaggor. ADHD-försäljningen är fortsatt avstängd; autismförsäljningen är fortsatt aktiv.

De automatiserade leveranstesterna använder lokala ersättare för Stripe och lagring. De verkliga R2-objekten är verifierade via separat nedladdning. Detta bevisar inte hela leveranskedjan genom den ännu opublicerade appen i Production.

## Beslutsläge och nästa steg

Tekniskt GO för kontrollerad publicering med ADHD-försäljningen avstängd, först efter ägarens separata godkännande av slutdiffen och push/publicering. Inget godkännande har givits för push i detta steg.

Efter godkänd publicering: kontrollera deploymentens exakta commit, båda erbjudandena, 403 utan behörighet och alla tre auktoriserade nedladdningar genom den riktiga appen. Jämför de nedladdade filernas SHA-256 mot tabellen. Använd ägarens befintliga giltiga bokbehörighet om tillgänglig. Inget nytt betalt provköp får göras utan separat godkännande.

NO-GO för försäljningsöppning innan produktionskontrollerna är klara och aktiveringen uttryckligen godkänts. Den ärvda produktcookien gäller 180 dagar och omprövar inte återbetalningar efter utfärdande; övriga begränsningar finns i huvudrapporten. Vid problem hålls ADHD-försäljningen avstängd. En äldre deployment påverkas inte av de sparade nya miljövärdena; en ny ompublicering av äldre kod kan däremot använda dem. Återställning av huvudfilnyckeln kräver därför ett uttryckligt, dokumenterat återställningsbeslut.
