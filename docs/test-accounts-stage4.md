# Testintegration etapp 4 – autism

Endast lokal implementation i C:\src\relationsvarning. Ingen produktionsmigrering, skarp betalning, kunddataändring, abonnemangsändring, commit, push eller publicering.

## Inventering före ändring

- Gästtestet har 30 heltalssvar 0–4 och sparar svar, index och unlocked i localStorage under `relationsvarning_autism_state_v1`. Payment Link använder `AUTISM_STRIPE_URL`, 39 SEK. Återkomst med `paid=true` och befintlig lokal upplåsning hanteras som tidigare av klienten/shared payment hook.
- `GET /api/autism-recovery/redeem?token=...` verifierar HMAC-signaturen, version 1, produkt autism, kind support-recovery, giltighetstid och nonce. Giltig token ger en separat browser-unlock-cookie `rv_autism_recovery` och 303 till `/autism-test/test?recovery=success`. Cookien är HttpOnly, SameSite=Lax, host-only, path / och Secure i produktion, med högst 365 dagars browsergiltighet. Ogiltig token ger recovery=invalid utan cookie.
- `GET /api/autism-recovery/status` verifierar den separata browser-unlock-token och svarar `{unlocked}` med no-store. Klientens `restoreSupportRecovery` använder detta svar, inte recovery=success som bevis. Nätfel eller ogiltig cookie låser inte upp. Tidigare svar finns bara i webbläsaren; om de saknas kan kunden svara igen utan nytt köp.
- Support-cookien innehåller ingen Stripe-session, betalningsreferens, kontoägare eller svar. Det äldre stateless recovery-flödet kontrollerar inte en aktuell betalning/återbetalning och gör ingen per-konto-behörighetsprövning. Det lämnas funktionellt orört och är därför uttryckligen **inte** ett bevis för den nya kontomotorn. Ingen historikimport från denna cookie eller lokal paid-flagga införs.

## Implementerat

Separat adapter `autism_test`, slug autism, 39 SEK, frågeversion `autism-questions-v1` och rapportversion `autism-report-v1`. Exakt 30 kompletta heltal 0–4 och exakt svarsenvelop accepteras; upplåsningsflaggor, recovery, e-post eller klientberäknade resultat godtas inte. Adaptern använder originalets calculate utan ändring. Samtliga sex delskalor, fem produktprofiler, nivågränser, stödjande/nyanserande text och individuella vardags-/historiksvar bevaras.

Premiumanalysen är extraherad till en delad `ReportView`; samma analyskomponent används i tidigare klientrapport och serververifierad gäst-/kontoläsning. Befintlig köprekommendation och redigering/omstart ligger kvar på ursprungliga gästsidan. Originalets analysmarkup, copy och tolkningar är frysta som oberoende testreferenser. Ursprungliga frågor, modell, texter, Payment Link och recovery-serverfiler är oförändrade och hashkontrollerade.

Den gemensamma motorn hanterar nya betalningsbundna testförsök/Stripe Checkout, frivilligt versionerat samtycke, bekräftad Auth, kryptering, ägarlås, återbetalningskontroll, separat köphistorik, återöppning och radering. Inga parallella tabeller eller nya säkerhets-/driftsystem införs. Den återöppningsbara kontokopian lever oberoende av sjudagarsförsöket och följer samma tolvmånadersgräns och externa raderingsjournal som tidigare adaptrar.

Enda nya gästundantaget i proxy är `/mina-sidor/gast/autism/<uuid-v4>`. Servern kräver fortfarande rätt produkt, browsersecret för det nya testförsöket, aktuell giltig Stripe-betalning, giltig lagringstid och tomt raderingsregister. Kontoägarskap kontrolleras innan Stripe/dekryptering. En signerad gammal support-cookie eller hash av den matchar inte detta nya browsersecret. Inte heller samma mejladress, inskickad owner eller paid=true kan ersätta beviset. Annat kontos analyser förblir otillgängliga även för en innehavare av giltig legacy-cookie.

Alla nya checkout/save/read/import-flaggor är oberoende och av som standard. När checkout är av fortsätter befintlig Payment Link, lokal lagring, betalningsåterkomst, omstart och support-recovery. Ingen autismpost kan skapas i kontomotorn genom endast det gamla recovery-flödet. Import förblir spärrad.

## Avgränsad gemensam rättning

Ett strikt testschemafall med en gles JavaScript-array fångade att gemensamma `parseAnswers` använde every direkt, vilket hoppar över saknade element. Kontrollen använder nu Array.from före every och avvisar saknade svar. Detta ändrar inte giltiga svar eller beräkningar. JSON-klienter skickar redan null för sådana luckor, vilket nekades även tidigare; ingen ny möjlighet till betalningsbevis eller kontoåtkomst införs. AuDHD:s specifika schema/kryptering och ADHD:s beräkningsmodell ändras inte.

Tidigare verifieringsskript är historiskt pinnade även till denna gamla gemensamma fil. Etapp 4:s förberedelseskript samlar därför de befintliga explicita filmanifesten direkt, med frysta hashkontroller för alla beroenden utom etappens granskade delade filer. De gamla manifesten/skripten ändras inte. Samma tidigare godkända två-raders loggingfix i recovery-testet rekonstrueras från HEAD; andra pågående recovery-ändringar kopieras inte.

## Tester

- Ny jämförelse: 931 kompletta syntetiska original-/klient-/server-/portalrapporter. 15 625 delskale-/profilkombinationer och 3 125 individuella vardags-/historikkombinationer. Täcker alla fem profiler, fyra påverkanstolkningar, gränser 25/45/65/80, 15-poängsdominans, bred profil med strikt mindre-än-15-gräns och delskalornas hela råpoängsintervall 0–20. Vardagspåverkan ändrar aldrig symptomindex eller produktprofil.
- Gemensamma verkliga SQL-/simulerade Stripe-tester för korrekt köp, fel produkt/ägare, samtycke, självständig återöppning, återbetalning, utgång, radering, kvarvarande köphistorik och återställning från äldre backup.
- Signerade syntetiska support-token/cookie testas genom verkliga befintliga redeem/status-handlers. Manipulerade, utgångna, fel produkt och fel tokenkind nekas. Giltig support-cookie fungerar för äldre upplåsning men nekas vid nya konto-claims och åtkomst till annat konto. Avvisning sker före Stripe när rätt nya browsersecret saknas.
- Samtliga tidigare 53 program plus befintliga autismmodell-, klientflödes-, recovery/analytics- och support-tokenprogram ingår. Äldre flow-testets renderer har endast fått stöd att gå in i den extraherade rapportkomponenten och ett explicit avstängt capability-svar; dess gamla beteendeassertioner finns kvar.

Kör `node scripts/prepare-test-accounts-stage4.cjs`, använd utskriven isolerad katalog och kör `node scripts/test-test-accounts-stage4.cjs` (60 testprogram), TypeScript med --noEmit --incremental false och `npm run build -- --webpack`. Endast syntetiska användare/svar, simulerad Stripe/R2 och lokal PGlite används. Inga verkliga betalningar eller kunduppgifter. Tidigare dokumenterad begränsning för PGlites advisory locks och verkliga tjänstekopplingar kvarstår.

## Filer och isolering

Exakt lista och startens hashvärden finns i `scripts/test-accounts-stage4-files.json`. Verifieringskopian innehåller endast HEAD + explicita tidigare leveranser + etapp 4:s allowlist. Övrigt pågående arbete följer inte med. Arbetsstartens fulla hashlista och verifieringsunderlag ligger lokalt i ignorerade `.artifacts/test-accounts-stage4/`.

Inga AuDHD-specifika filer, migrationsfiler, riktiga miljöfiler, package-filer, Vercel-konfiguration, Stripe-webhook eller recovery-serverfiler redigeras. Alla nya funktionsflaggor förblir av som standard. Inget är avsett att stageas eller pushas av skripten.

## Produktionsberoenden – kräver godkännande

1. Tidigare kontoleveranser, den generella migreringen och beslutade driftförutsättningar måste vara publicerade/verifierade. Ingen egen migrering, cronpost, monitor, krypteringsnyckel eller bucket behövs för autism.
2. Välj ett godkänt aktivt engångspris 39 SEK (3900 öre), live mode. Lägg det i autism_test.priceIds i befintliga STRIPE_PAYMENT_PRODUCT_MAP_JSON och sätt TEST_ACCOUNTS_AUTISM_PRICE_ID. Bevara gamla mappningar, Payment Link, returinställningar och AUTISM_RECOVERY_TOKEN_SECRET. Förväxla inte autism_test med audhd_test eller autism_bok.
3. Godkänn utökad integritetsinformation, frivilligt lagringssamtycke och information om gästlagring före köp. Gör ingen automatisk import av gamla lokala eller recovery-upplåsta analyser.
4. Verifiera verkliga tjänsteanslutningar, priser, betal-/returflöde, recovery och mobil före aktivering. Den befintliga verifieraren accepterar live mode; inga skarpa provbetalningar eller externa testmodeadaptrar har införts här.
5. Aktivera READ, sedan SAVE, sist CHECKOUT för autism först efter godkänt prov. Behåll importen avstängd. Vid fel stäng nya köp/sparningar för autism men behåll radering/rensning/övervakning och tidigare kunders legacy-recovery. Äldre recovery verifierar ingen återbetalning; den begränsningen ska inte förväxlas med nya motorns live Stripe-kontroll vid kontoläsning.

## Verifierat lokalt

- Samtliga 60 testprogram godkända, inklusive de tidigare 53 och de fyra befintliga autism-/supportprogrammen.
- Inga analys- eller rapportavvikelser i 931 kompletta rapportfall och 18 750 nya delskale-/profil-/vardags-/historikkombinationer.
- Signerad recovery fungerar fortsatt, och både direkt serverclaim och verklig HTTP-claim med endast giltig support-cookie nekas. Annat konto får ingen analysåtkomst. Radering, återbetalning, oberoende återöppning och gammal-backupskydd passerar samma SQL/Stripe-harness som tidigare.
- Separat TypeScript-kontroll utan fel, även efter byggets typgenerering. ESLint för leveransens ändrade runtime-/test-/skriptkod utan fel eller varningar.
- Produktionsbygge med webpack inklusive postbuild godkänt, 144 statiska sidor. Privata rapportvägar är dynamiska och ska inte finnas i genererad sitemap.
- 23 leveransfiler: 14 nya, 9 ändrade från arbetsstarten. Full filmanifest, baslinjehashar och lokalt verifieringsunderlag visar att andra då befintliga filer är orörda. Inget staged, ingen commit, ingen push och ingen produktionsändring.
