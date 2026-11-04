# Frivilligt nyhetsbrev – drift och avgränsning

Nyhetsbrevet har inget beroende av kund-, konto-, betalnings- eller analysregister. Inga kunder importeras. En redan betalande kund kan fylla i samma publika formulär med sin köpmejladress. Kunden får inte marknadsföring förrän en separat prenumeration har bekräftats. Mina sidor behöver inte ändras.

## Före aktivering

1. `supabase/migrations/202611040001_newsletter.sql` är granskad och körd i produktion den 4 november 2026. Den skapar endast `newsletter_subscribers`, `newsletter_rate_limits`, ett index och deras serverbehörigheter i en transaktion. Kör den inte igen. Ingen `IF NOT EXISTS` döljer ett oväntat befintligt schema.
2. Säkerställ backup/återställningsväg innan kontrollerad produktionsmigration. Kontrollera att `DATABASE_URL`-rollen har åtkomst och kan kringgå RLS enligt projektets befintliga servermodell. Tabellen ska inte öppnas för `anon` eller `authenticated`.
3. Återanvänd befintliga `DATABASE_URL`, `RESEND_API_KEY`. Ange ny separat `NEWSLETTER_TOKEN_SECRET` med minst 32 slumpmässiga tecken, helst 32 slumpmässiga byte som base64url. Visa eller versionshantera inte hemligheten. Behåll den stabil; rotation gör tidigare avregistreringslänkar ogiltiga. Planera rotation med supportväg.
4. Ange `NEWSLETTER_EMAIL_FROM` som verifierad Resend-avsändare, eller återanvänd befintlig `AUDHD_RECOVERY_EMAIL_FROM` om separat avsändare saknas. Verifiera domänens SPF/DKIM och DMARC samt att Resend click/open tracking är avstängt för bekräftelsemejl. Fragmentlänkarna måste bevaras genom e-postleverantören.
5. Lägg upp daglig rensning med nedanstående SQL via befintlig databasdrift, exempelvis Supabase Cron om `pg_cron` redan finns. Det är en separat, godkännandepliktig produktionsinställning. Ändra inte befintliga rensnings- eller GA4-jobb. Funktionen `cleanupNewsletter()` kör exakt denna avgränsade rensning och testas lokalt.
6. Bekräfta korrekt personuppgiftsansvarig juridisk part och leverantörernas personuppgiftsbiträdesvillkor/överföringsunderlag. Granska `/nyhetsbrev/integritet` innan aktivering. Godkända lagringstider i aktiv databas: aktiva tills samtycket återkallas, obekräftade/avregistrerade uppgifter högst 30 dagar, missbruksskydd högst 48 timmar. Säkerhetskopior och leverantörernas mejlloggar beskrivs separat i integritetstexten.
7. Sätt `NEWSLETTER_ENABLED=true` först efter migration, rensning och ett uttryckligen godkänt testutskick till ägarens egen testadress. Utan flaggan eller nödvändig konfiguration visas inga formulär. Avregistrerings-API:t fortsätter fungera när insamlingen stängs av.

Rensning (inga kundtabeller):

```sql
delete from public.newsletter_rate_limits
where window_start < now() - interval '24 hours';
delete from public.newsletter_subscribers
where (status = 'pending' and requested_at < now() - interval '29 days')
   or (status = 'unsubscribed' and unsubscribed_at < now() - interval '29 days');
```

Ingen bakgrundssändare eller kampanj skickar befintliga kunder mejl. Ingen migration eller skarp mejlsändning görs av lokala tester.

### Kontrollerad driftsättning 4 november 2026

- Migrationen är körd i det befintliga produktionsprojektet. RLS och spärr för `anon`/`authenticated` har kontrollerats. Inga kunder importeras.
- `LEGAL_RESPONSIBLE_NAME` och `LEGAL_BUSINESS_ADDRESS` är serverinställningar för `/juridisk-information`. Personuppgifterna får inte skrivas i källkod, metadata eller nyhetsbrevets avsändare.
- Daglig Supabase Cron: `newsletter-retention-daily`, `45 4 * * *` (UTC), 30 sekunders statement timeout. Frågorna ovan har en dags marginal till maximalt 30 dagar respektive 48 timmar vid daglig körning. Övervaka fel och uteblivna körningar; en driftstörning får inte passera obemärkt.
- Resend har biträdesvillkor som gäller vid kontoregistrering. Supabase och Vercel har biträdesvillkor som ingår i deras tjänstevillkor; Vercel-kontot använder Pro. Läs aktuella leverantörsvillkor och underbiträdeslistor vid ändringar. EU-region betyder inte att all behandling stannar inom EU.
- `NEWSLETTER_ENABLED=false` håller publika formulär stängda. Ett uttryckligen godkänt test kan använda `NEWSLETTER_TEST_EMAIL` för en enda normaliserad adress. Samtycke, hastighetsbegränsning, token och verkliga leverantörer fungerar som vanligt. Ingen adress får hårdkodas. Testinställningen ger inte tillgång till kundregister eller kampanjutskick och kan inte kringgå övrig konfiguration. Ta bort den när testet är klart; aktivera publikt först efter godkänt helhetstest.
- Efter lyckad bekräftelse får besökaren en personlig avregistreringslänk direkt på bekräftelsesidan, utöver kravet på avregistreringslänk i framtida nyhetsbrev. Den innehåller inga mejladresser och cachas inte.
- Före återställning av databasbackup: stoppa all insamling och alla utskick. En återställd prenumerantlista får inte återanvändas för utskick förrän senare avregistreringar och gallringar säkert tillämpats. Om detta inte kan säkerställas ska den återställda listan inte användas; ny frivillig registrering och bekräftelse krävs. Ingen automatisk återaktivering får ske från backup.

Kontrollerat underlag: [Resends GDPR- och lagringsinformation](https://resend.com/security/gdpr), [Supabase DPA](https://supabase.com/legal/customer-resources/data-processing-addendum), [Supabase överföringar](https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq), [Vercel DPA](https://vercel.com/legal/dpa) och [Vercels tjänstevillkor](https://vercel.com/legal/terms).

## Flöde

Formulär → separat, omarkerat samtycke → servervalidering/originkontroll → IP- och adressbegränsning → en unik normaliserad adress → bekräftelsemejl via Resend. Aktivering kräver en aktiv POST från bekräftelsesidan. GET/länkförhandsgranskning ändrar ingenting. Bekräftelsen gäller i 24 timmar; oförbrukad länk ersätts tidigast efter 15 minuter vid en ny registrering. Högst tre försök per adress och 20 per nätverksadress per timme. Dessa värden lagras HMAC-kodade. Honeypot och begränsade requeststorlekar kompletterar skyddet.

Dubletter, aktiva adresser och begränsade försök får samma neutrala 202-svar. Resend-/nätfel loggas endast med fast händelse och kategori, utan adress, token eller rått fel. Ett misslyckat mejl aktiverar aldrig prenumerationen. Besökaren kan försöka igen efter 15 minuter, inom hastighetsgränsen. Detta är inte en leveransgaranti eller en automatisk återförsökskö.

Bekräftelse- och avregistreringslänkar bär token i URL-fragmentet (`#token=`). Fragmentet skickas inte i HTTP-förfrågningar, tas bort ur adressfältet efter inläsning och skickas sedan i en POST-body med `no-referrer`. Logga aldrig request-body på dessa routes och håll Resend-spårning avstängd. Bekräftelsetoken lagras bara som SHA-256-hash. Avregistrering har en separat HMAC-signerad prenumerantidentifierare/generation och ändrar endast nyhetsbrevsposten. En ny prenumeration efter avregistrering kräver ny bekräftelse och gör gamla generationslänkar ogiltiga.

## Placeringar

- Startsidan: full text ovanför den avslutande testsektionen.
- Guider: mitt i längre sidor i `ContentGuide` (minst fyra GuideSection), `SeoClusterGuide` och `InformationGuide` (minst tre avsnitt). Testlandningar, metodik, juridiska sidor och boksidor får inte artikelformuläret.
- Sidfot: kompakt formulär på vanliga publika sidor utan annan registreringsyta; aldrig under pågående test, tack-/checkoutsteg, konto- eller inloggningssidor.
- Alla 15 betalda testresultat: kompakt formulär efter upplåst rapport och befintlig cross-sell. Ingen produktidentifierare skickas till nyhetsbrevs-API:t; endast källan `result`.
- `/nyhetsbrev`: vanlig frivillig registrering, även för befintliga kunder.

Marknadsföringssamtycke och statistikgodkännande är oberoende. Händelserna `newsletter_form_view`, `newsletter_signup_submit`, `newsletter_signup_success` och `newsletter_signup_confirmed` går genom befintlig samtyckesstyrd `trackEvent`, med enbart grov placering i `position`. `signup_success` betyder accepterad begäran, inte en ny aktiv prenumerant. Ingen e-post, token, artikel-URL, testuppgift eller kundidentifierare skickas i nyhetsbrevshändelserna. Befintlig övergripande sidstatistik hanteras fortfarande av det befintliga analyssystemet.

## Senare nyhetsbrevsutskick

Detta uppdrag bygger registrering och samtycke, inte en kampanjplattform. Använd serverfunktionen `newsletterRecipients()` för en sida i taget, högst 100. Den lämnar endast aktiva, bekräftade prenumeranter med samtycke för aktuell version. Ingen publik list-/exportendpoint finns. Kontrollera aktuell prenumerationsstatus igen omedelbart före varje sändning. Spara inte en gammal export som permanent mottagarlista.

För varje mottagare skapas en fungerande avregistreringslänk med `newsletterUnsubscribeUrl(recipient.id, recipient.unsubscribe_nonce)`. Lägg alltid den länken i nyhetsbrevets text och HTML. Innan en kampanjsändare ansluts ska även leverantörens suppression för bounce/complaint och RFC 8058 one-click List-Unsubscribe verifieras/implementeras. Funktionen i detta uppdrag skickar enbart det begärda bekräftelsemejlet. Skicka aldrig en kampanj via en vanlig kundexport från Stripe, Resend eller Supabase.

Antal utan att läsa adresser:

```sql
select source, status, count(*) from public.newsletter_subscribers
group by source, status order by source, status;
```

Serveradministratör kan vid behov läsa just den behöriga listan:

```sql
select id, email, source, registered_at, confirmed_at, consent_version
from public.newsletter_subscribers
where status = 'active' and confirmed_at is not null
and unsubscribed_at is null and legal_basis = 'consent'
and consent_version = 'newsletter-2026-11-04-v1';
```

Källor för avgränsningen: [IMY om samtycke](https://www.imy.se/verksamhet/dataskydd/det-har-galler-enligt-gdpr/rattslig-grund/samtycke/), [IMY om direktmarknadsföring](https://www.imy.se/privatperson/dataskydd/dina-rattigheter/att-gora-invandningar/). Juridisk efterlevnad och leverantörskonfiguration behöver bedömas utifrån den faktiska driften.

## Exakt filurval (39 filer)

Ny kod och dokumentation:

```text
app/_lib/newsletter.ts
app/_lib/newsletter.server.ts
app/_lib/newsletterDb.server.ts
app/_lib/newsletterHttp.server.ts
app/_lib/newsletter.postgres.test.cjs
app/_components/NewsletterSignup.tsx
app/_components/NewsletterAction.tsx
app/_components/NewsletterSignup.test.cjs
app/api/newsletter/route.ts
app/api/newsletter/route.test.cjs
app/api/newsletter/[action]/route.ts
app/nyhetsbrev/page.tsx
app/nyhetsbrev/bekrafta/page.tsx
app/nyhetsbrev/avsluta/page.tsx
app/nyhetsbrev/integritet/page.tsx
supabase/migrations/202611040001_newsletter.sql
docs/newsletter.md
```

Avgränsade tillägg i befintliga filer:

```text
app/page.tsx
app/_components/SiteFooter.tsx
app/_components/ContentGuide.tsx
app/_components/SeoClusterGuide.tsx
app/_components/InformationGuide.tsx
app/_analytics/analytics.ts
next-sitemap.config.js
app/adhd-test/test/page.tsx
app/autism-test/test/page.tsx
app/audhd-test/test/page.tsx
app/hsp-test/test/page.tsx
app/ptsd-test/test/page.tsx
app/test/page.tsx
app/anknytningstest/test/page.tsx
app/medberoendetest/test/page.tsx
app/gaslightingtest/test/page.tsx
app/narcissist-i-en-relation/test/page.tsx
app/traumabindningtest/test/page.tsx
app/psykisk-misshandel-relation/test/page.tsx
app/iq-test/test/page.tsx
app/angest-test/test/page.tsx
app/narcissism-sjalvtest/test/page.tsx
```

Testsidornas tillägg är en import och en komponent som lägger formuläret efter befintlig upplåst yta/cross-sell. Inga betalningsvillkor ändras. Analytics får bara fyra nya typade händelsenamn; inga befintliga integritets- eller kundändringar ska tas med vid publicering. Sitemap utesluter endast de två nya noindex-sidorna för bekräftelse/avregistrering.

Den vanliga arbetsytan innehåller äldre, orelaterade ändringar i flera av dessa filer. Publicera vid senare godkännande innehållet från den verifierade kopian mot samma aktuella main-bas, inte hela filerna från den vanliga arbetsytan. Varken `.next`-förhandsvisningar eller genererade sitemap-filer ska ingå.
