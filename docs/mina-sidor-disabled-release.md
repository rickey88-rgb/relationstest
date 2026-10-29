# Kontrollerad kodpublicering utan kundaktivering

Uppföljning av dd95876. Ingen ny migrering ska köras; de två tabellmigreringarna är redan genomförda i produktion.

## Stängd som standard

Serverflaggan ACCOUNT_PORTAL_ENABLED kräver exakt true. Saknad variabel, false eller felstavade värden stänger kontoytan före Auth och databasåtkomst. Ingen NEXT_PUBLIC-flagga används för denna behörighet.

Spärren omfattar /mina-sidor inklusive nya gästanalysvägar, /logga-in, /auth/confirm, /api/account, /api/test-accounts, /api/account-maintenance samt de två nya konto-cronrutterna inklusive deras hälsokontroller. Proxyspärren returnerar 503 och no-store även för inloggade kunder. Route handlers, inloggningsaction, layout, databasfabriker och lagringskontroll har kompletterande spärrar.

Utloggning fungerar för befintliga sessioner. Befintliga gästbetalningar, lokala analyser, AuDHD-checkout/recovery, autism-recovery, Stripe-webhook och skyddade böcker omfattas inte av spärren. Den nya checkouten kan inte kringgå spärren genom att en produktflagga eller ett lagringsläge av misstag är active.

Vid första kodpublicering: lämna ACCOUNT_PORTAL_ENABLED frånvarande eller false, ACCOUNT_STORAGE_MODE och TEST_ACCOUNTS_STORAGE_MODE disabled, och alla nya produktflaggor false/frånvarande. Behåll samtliga befintliga betalnings-ID och Stripe-produktmappningen.

## Cron

vercel.json registrerar endast det befintliga jobbet /api/cron/audhd-checkout-cleanup kl. 03:15 UTC.

De nya jobbens kod finns kvar men schemaläggs inte. En senare separat godkänd release kan återinföra /api/cron/account-analysis-cleanup kl. 02:00 UTC och /api/cron/test-account-cleanup kl. 03:30 UTC efter verifierad journal, två monitorer och larmprov. Lanseringsspärren måste då hanteras uttryckligen; skapa inga produktionsscheman för att kringgå den.

## TLS och databas

Båda kontodatabasklienterna använder den tidigare verifierade officiella Supabase-CA:n, rejectUnauthorized true och Node:s ordinarie checkServerIdentity. Certifikatet är offentligt, inte en privat nyckel. Fel värdnamn nekas och anslutningssträngens sslmode får inte försvaga dessa inställningar.

Ingen global TLS-inställning ändras. Gästklienter ändras inte. DATABASE_URL är serverhemlighet och får inte skrivas i rapporter, terminalutdata eller Git. Produktionsanslutningen måste verifieras säkert innan push; en hemlighet som bara har funnits i en äldre deployment räcker inte som bevis för nästa deployment.

## Lokala verifieringskommandon

node scripts/test-disabled-release.cjs kör alla aktuella fristående app-/rotprogram samt prisregressioner, med syntetiska data och en explicit aktiverad flagga i varje isolerad testprocess för den befintliga aktiva funktionslogiken. accountLaunch.server.test.cjs varierar/avlägsnar själv flaggan och bevisar stängt grundläge utan nätverks- eller lagringsanrop.

Recovery-programmet kräver AUDHD_TEST_DATABASE_URL till en separat lokal testdatabas med befintligt gästschema. ADHD-bokens befintliga byte-/hashprov kräver ADHD_PRIVATE_ASSETS till de tre lokalt verifierade bokfilerna; filerna ska inte läggas i Git eller public. Bokproven använder simulerad Stripe/R2 och en lokal HTTP-server, aldrig kundbetalningar. Om lokala nätverksbehörigheter blockerar loopback ska bara berörda prov köras om med rätt lokal åtkomst; ändra inte produktionskod för det.

Inventeringens ursprungliga antagande att inga PDF-filer alls fanns i public var för brett. En äldre AuDHD-PDF-leveransväg finns redan i main och bevaras i denna avgränsade release. Scopeprovet kräver att PDF-listan i public är identisk med main och att de skyddade ADHD-/autismreleasernas filer samt den tidigare exkluderade AuDHD-bokfilen inte tillkommer där. Den äldre leveransvägen behöver bedömas separat om samtliga historiska boklänkar senare ska ersättas med signerad åtkomst.

Historiska scripts/adhd-deluxe-scope.test.cjs är en assertionskontroll för en äldre avgränsad bokrelease, inte en regression för denna integration, och undantas uttryckligen. Dess krav på att inga andra filer ändrats sedan den äldre releasen är inte tillämpligt. Oförändrad bokkod/privata filer och priser kontrolleras separat mot dd95876 och main. scripts/audhd-cluster.test.cjs körs efter produktionsbygget eftersom det läser byggd HTML.

Kör även TypeScript, riktad ESLint och produktionsbygge. Inga tester behöver verkliga kunduppgifter eller skarpa betalningar. Testmigreringar i PGlite körs endast mot isolerad syntetisk databas.

## Nästa godkännande

Denna lokala commit innebär inte godkännande att pusha eller deploya. Rapportera exakt commit/diff och konfigurationshinder. Kundaktivering, driftlarm, produktionsrensning och nya scheman är senare separata beslut.
