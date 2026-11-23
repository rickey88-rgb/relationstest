# Lansering av Du tänker sönder dig själv

Adrian Falk · Relationsvarning.se · PDF på 120 sidor · 149 SEK

Kandidaten ligger på den lokala branchen `codex/boklansering-adrian-falk`, baserad på `main` vid `5ea0077`. JYCKEN inspekterades för ansvarsfördelningen. Dess inventering och SEO-arbetslista ingår i en senare etapp.

## Kartläggning

| Område | Befintligt mönster | Ny bok |
|---|---|---|
| Stripe | AuDHD-boken, AUTISM ALL INCLUSIVE och ADHD DELUXE har egna Payment Links. Servern verifierar Checkout Session, tillåtna Price-ID:n och betalning. Ordinarie erbjudanden ligger på 149 kr, analysbundna erbjudanden på 79 eller 99 kr. | En serverstartad Checkout Session med ett förkonfigurerat Price-ID, en rad och 14900 öre i SEK. Ingen rabattlänk eller prissättning från webbläsaren. |
| Webhook | `/api/stripe/webhook` verifierar Stripes signatur, hämtar session och rader och skriver idempotent till betalningsloggen. | Ny produktnyckel `overthinking_book` i samma katalog. Signaturverifiering, webhook och övriga produktmappningar återanvänds. |
| Lagring | Befintliga böcker använder privata Cloudflare R2-objekt och kortlivade signerade länkar. | Egen privat Supabase-bucket enligt uppdraget. Servern hämtar ett fast objekt efter verifiering och kontrollerar filens storlek och SHA-256 före leverans. |
| Ägarskap | Befintliga bokreturer ger en produktspecifik åtkomstcookie. Kontobiblioteket hade ett tomt läge för böcker. | Ett verifierat Supabase-konto binds till Checkout Session innan Stripe-länken lämnas ut. Konto-ID och besökarens testdata skickas inte till Stripe som metadata. |
| Återöppning | Mina sidor har både direktportalen och ett SSR-alternativ. | Mitt bibliotek i båda portalerna. Servern avgör ägare och verifierar aktuellt Stripe-besked vid nedladdning. Inloggning på samma konto fungerar även utan Stripe-retur och på en annan enhet. |
| Analys | Samtyckesstyrda bokvisningar och köpknappsklick. Verifierad betalningslogg. GA4:s befintliga serverkö för verifierad konvertering är knuten till AuDHD-testet. | Samtyckesstyrd `book_landing_view` och `book_checkout_click`. Verifierade köp kan räknas i Stripe-loggen på `overthinking_book`, live, SEK, 14900 och paid/complete. Ingen separat GA4- eller Ads-händelse för bokköp i den här etappen. |
| SEO | Enskilda metadata för varje bok och genererad webbplatskarta. | Egen kanonisk URL, delningsbild och strukturerad Book-data. Indexering, startsideskort och köp öppnas med lanseringsflaggan. |

Biblioteket verifierar exakt produkt, mängd, belopp, valuta, läge och fångad betalning. Återbetalningar och tvister spärrar nya nedladdningar. Session-ID i en URL, en e-postmatchning och en vanlig bokcookie ger ingen behörighet. PDF-svaret är privat och kan inte cachelagras.

## Lokalt underlag

- Landningssida `/du-tanker-sonder-dig-sjalv`, med den tillhandahållna omslagsmockupen, framsidan och förhandsbild av ett riktigt skrivblad.
- Konto- och köpendpoint `/api/books/du-tanker-sonder-dig-sjalv`.
- Nedladdning `/api/books/du-tanker-sonder-dig-sjalv/download`.
- Migration `202611230001_overthinking_book_checkouts.sql` för ägarskapskoppling. Tabellen ligger bakom RLS och saknar klientbehörigheter.
- Det säljbara PDF-originalet ligger utanför Git och webbplatsens `public`.

Kör `npm run build` med befintliga juridikvärden för den verkliga miljön. Lokala byggen kan använda syntetiska `LEGAL_RESPONSIBLE_NAME` och `LEGAL_BUSINESS_ADDRESS`. Håll `OVERTHINKING_BOOK_CHECKOUT_ENABLED=false` vid visuell förhandsgranskning. Köpflödet kan köras offline med följande test efter att `OVERTHINKING_BOOK_TEST_PDF` pekar på den privata originalfilen.

```text
node app/api/books/du-tanker-sonder-dig-sjalv/purchase-flow.test.cjs
```

Testet använder fiktiva Stripe-besked och Supabase-svar, riktiga route handlers och lokalt PostgreSQL i PGlite. Det verifierar att den exakta PDF-filen kommer tillbaka byte för byte. Inga produktionsnycklar behövs.

## Verifiering och öppna punkter

- Produktionsbuild (Next och next-sitemap) samt `npx tsc --noEmit` passerade. Builden använde två syntetiska juridikvärden lokalt.
- ESLint passerade för berörda filer. Repots fulla lint gav samma 13 fel och 25 varningar som en separat utcheckning av `main`.
- 37 befintliga konto- och kompatibilitetsprogram samt åtta riktade bok-, betalnings- och analysregressioner passerade. Autism-landningssidans befintliga produkt-ID-assertion fallerar även på `main`. ADHD DELUXE:s fulla nedladdningstest saknar sina privata referensfiler i båda utcheckningarna. Det fristående behörighetstestet för samma nedladdningsroute passerade.
- Den nya köpfixturen verifierade 14900 öre, idempotent bokföring, kontoägarskap, spärr vid annan produkt, återbetalning och tvist, fortsatt bibliotek efter stängd kassa samt leverans av den riktiga PDF-filen byte för byte.
- Chromium på den lokala produktionsbuilden kontrollerades vid 320, 375, 390, 768, 1024 och 1440 px. Bilder, huvud-CTA, FAQ, metadata, sitemap och avstängd kassa kontrollerades. De befintliga tre bok- och ADHD-, autism- och AuDHD-testsidorna svarade 200.
- Verklig Stripe Checkout, Supabase Auth, privat Storage och återöppning på en annan fysisk enhet återstår i isolerad miljö. En sådan körning kräver testkonfiguration och uppladdning enligt releaseordningen.
## Releaseordning efter separat godkännande

1. **Börja i isolerad miljö.** Använd ett separat Supabase-projekt och Stripe testläge med en HTTPS-förhandsadress i `AUTH_SITE_URL`. Sätt `OVERTHINKING_BOOK_STRIPE_TEST_MODE=true` endast där. Använd samma portalvariant och Auth-flöde som produktion samt dess definierade testpublik. Gör ett testköp och öppna boken från Mina sidor i en ny webbläsarsession.
2. **Produkt och pris.** Skapa Stripe Product **Du tänker sönder dig själv**. Skapa ett aktivt engångspris på **14 900 öre (149 SEK)**, utan föränderlig mängd eller rabatt. Kontrollera att kassan debiterar totalt 149 SEK. Spara det nya `price_…`-ID:t. Ingen Payment Link behövs. Behåll befintliga Stripe-produkter och övriga Price-ID:n. Den befintliga signerade webhooken ska ta emot `checkout.session.completed` och `checkout.session.async_payment_succeeded` på produktionsdomänen.
3. **Behörighetstabell.** Kör just migrationen `202611230001_overthinking_book_checkouts.sql` på samma Supabase/Postgres som används av betalningsloggen och Supabase Auth. Kontrollera att rollen för befintlig `DATABASE_URL` kan läsa och skriva boktabellen och läsa `stripe_payments`. Kontrollera att `anon` och `authenticated` saknar direkt tabellåtkomst.
4. **Privat PDF.** Skapa en privat Supabase Storage-bucket med ID **overthinking-book-private**, MIME-typ `application/pdf` och exempelvis 4 MB filgräns. Ladda upp **Du-tanker-sonder-dig-sjalv-Adrian-Falk.pdf** som `v1/Du-tanker-sonder-dig-sjalv-Adrian-Falk.pdf` med samma MIME-typ. Skapa ingen generell klientpolicy. Kontrollera att anonyma och vanliga inloggade klienter saknar direktåtkomst. Den serverhämtade filen ska vara **2 924 829 byte** med SHA-256 **30e800dc56139fd2485354010cef2db79e01c598cde086ffaadea08ac1509738**.
5. **Konfigurera servern.** Lägg till `OVERTHINKING_BOOK_PRICE_ID` med det nya ID:t och komplettera befintlig `STRIPE_PAYMENT_PRODUCT_MAP_JSON` med en enda ny post enligt exemplet nedan. Lägg in Supabase-servernyckeln som `OVERTHINKING_BOOK_STORAGE_SECRET_KEY` i servermiljön. Återanvänd `NEXT_PUBLIC_SUPABASE_URL`, dess Auth-konfiguration, `DATABASE_URL`, `STRIPE_SECRET_KEY` och `STRIPE_WEBHOOK_SECRET` från rätt miljö. Kontrollera att minst den avsedda portalvarianten är öppen för bokköpare. Låt `OVERTHINKING_BOOK_STRIPE_TEST_MODE` vara av i produktion.
6. **Sätt i drift i två steg.** Lägg först upp den godkända versionen med `OVERTHINKING_BOOK_CHECKOUT_ENABLED=false`. Bekräfta att landningssidan laddar, att köp är avstängt och att PDF-endpointen kräver behörighet. Sätt sedan flaggan till `true` och kör avtalat köp- och leveransprov i den skarpa kassan först efter godkännande. Kontrollera startsideskort, sitemap, rätt totalpris, webhookpost, bibliotek, PDF-hash och att övriga bokprodukter går att öppna. Kontrollera GA4-visning och klick efter uttryckligt samtycke.
7. **Återställning vid fel.** Stäng av `OVERTHINKING_BOOK_CHECKOUT_ENABLED` och rulla om med bokbibliotekets konfiguration kvar. Det stoppar nya köp och tar bort startsideskortet. Redan verifierade köp kan hämtas vidare. Inaktivera endast den nya produktens Stripe-pris om det behövs. Behåll ägarskapsrader, historisk prisallowlist och den privata filen för köpare.

Lägg till följande fält i det befintliga JSON-objektet. Behåll alla övriga fält.

```json
{
  "overthinking_book": { "priceIds": ["price_NYTT_VERIFIERAT_ID"] }
}
```

Inga externa resurser har ändrats för den lokala kandidaten.