# Mina sidor – driftförslag inför publicering

**Aktuell lokal implementation:** `mina-sidor-teknisk-driftberedskap.md` beskriver nu genomfört register-/restore-/larmarbete. Förslagen nedan är beslutsunderlaget före implementationen. Abonnemangsvalet är därefter fastställt till Vercel Pro + Supabase Pro, med uppgradering senare; driftadressen är drift@relationsvarning.se när den är konfigurerad.

Kontrollerat 2026-10-26. Endast läsning i Supabase/Vercel. Inga produktionsändringar, uppgraderingar, betalningar, utskick eller pushar har gjorts.

## Faktiskt nuläge

- **Supabase:** `relationsvarning-production`, Free. Dashboarden bekräftar att schemalagda projektbackuper saknas. Free erbjuder inte PITR. Egen logisk export/import är möjlig men behöver automatiseras och återställningstestas; enbart en export av public-tabeller räcker inte för full katastrofåterställning med Auth-ägarskap.
- **Vercel:** projekt `relationstest`, team `rickey88-rgbs-projects`, **Hobby**, produktion från main/9dea373 och domänen Relationsvarning.se. Cron är aktiverat. Det befintliga jobbet `/api/cron/audhd-checkout-cleanup` kör enligt `15 3 * * *` UTC. Jag har inte tryckt Run. Kontots nya rensningsjobb finns ännu bara lokalt.
- **Variabler:** produktionsposter finns för Supabase URL/public key, AUTH_SITE_URL, DATABASE_URL, Stripe secret/produktkarta/Price/webhook, checkout- och recovery-hemligheter, krypteringsnyckeln, CRON_SECRET, Resend och R2 endpoint/bucket/credentials. Inga hemliga värden har visats. Vercel kräver extra verifiering även för att visa den offentliga Supabase-URL:en; kontrollen avbröts utan kodutskick. **Databasens projekttillhörighet, TLS och nyckelformat är därför ännu inte verifierade.** Maskerade inställningar bevisar inte heller att rätt värden finns i den redan byggda deploymenten. R2:s backupbehörigheter, privata bucket och region är inte kontrollerade.

## Kostnad och rekommendation

Grundavgifter USD/månad, före skatt, extra användning och eventuella fler betalande Vercel-användare. Befintliga domän-, Stripe- och mejlkostnader ingår inte.

| Upplägg | Grundavgift | Bedömning |
| --- | ---: | --- |
| Nuvarande Hobby + Supabase Free | 0 | Hobby är avsett för icke-kommersiell användning; dessutom saknas projektbackup. Inte rekommenderat för betaltjänsten. |
| Vercel Pro + Supabase Free + egen R2-backup | från 20 | Lägst abonnemangskostnad. Kräver en alltid tillgänglig backupkörmiljö, krypterad daglig export, sju dagars retention, larm och verifierad full återställning inklusive Auth. Ska inte vara beroende av att din dator är igång. Detta finns inte implementerat. |
| **Vercel Pro + Supabase Pro** | **från 45** | **Rekommenderas för minst driftarbete.** Supabase Pro tillför dagliga projektbackuper med sju dagars historik och tar bort automatisk inaktivitetspaus. |

Ingen Team-plan, PITR eller betald övervakningsplan behövs för det föreslagna startläget. R2 Standard har en gemensam fri kvot på 10 GB-mån; faktisk ledig kvot är okänd. Raderingsjournalen kan återanvända Cloudflare-kontot men ska ha separat privat bucket och begränsad åtkomst, inte publika boklänkar. Supabase Pro ersätter inte säker förvaring av appens krypteringsnyckel eller raderingsjournalen. Daglig backup innebär att upp till ungefär ett dygns data kan saknas vid katastrof, mer om backupen varit trasig; ingen återställningstid är verifierad.

Prisförslaget avser en betalande Vercel-användare och ett Supabase-produktionsprojekt. Fler projekt/instanser eller högre användning kan kosta extra.

## Radering som överlever återställning

**Föreslagen rutin, ännu inte implementerad:**

1. Ge varje ny sparad analys ett oföränderligt generations-ID. Före manuell radering, återkallelse och kontoradering skrivs ett beständigt raderingskvitto till separat privat R2-lagring: generations-ID och tid, inga svar eller mejladresser. En ny uttrycklig sparning får ett nytt ID.
2. Bekräfta radering först när kvittot är varaktigt sparat och databasraderingen lyckats. Misslyckad journalföring ska ge ett tydligt fel och återförsök, inte falsk bekräftelse. Alla raderingsvägar, inklusive administrativ kontoradering och eventuell CASCADE, måste gå genom rutinen eller likvärdig säker mekanism.
3. Behåll kvitton i 30 dagar **under förutsättning att alla återställbara egna/valda backuper verkligen försvinner inom sju dagar**. Längre backuphorisont kräver längre journal. Kvittona är pseudonyma personuppgifter med eget begränsat syfte.
4. Återställ alltid isolerat utan kundtrafik. Hämta den externa journalen, radera matchande generationer och allt vars lagringstid passerat, verifiera ägarskap/RLS och återställ först därefter trafik. Saknad journal blockerar öppning. Hantera också borttagna konton och återkallad betalningsåtkomst; återställ inte gammal behörighet automatiskt.

För att budgetera för **högst 12 månader även med sju dagars återställbara backuper** föreslås aktiv åtkomst till `sparad tid + 12 månader − 10 dagar`: sju dagar backup, två dagar rensnings-/incidentmarginal och en extra dags marginal. Exakt datum visas för kunden. Detta kräver en lokal ändring från dagens tvådagarsmarginal. Verklig backup-/WAL-/exportretention och leverantörens raderingsvillkor måste bekräftas; formeln ensam garanterar inte att alla fysiska leverantörskopior försvinner inom taket. Gamla exporter får inte sparas vid sidan av beslutad retention.

## Rensning och kostnadsfri larmning

Behåll Vercel Cron och det lokalt förberedda konto-jobbet `0 2 * * *` UTC. DB-heartbeat och den skyddade health-routen finns redan lokalt. De stoppar ny kontosparning när lyckad rensning saknas eller blivit försenad; gästköp och användarens radering fortsätter fungera.

Föreslå en separat kostnadsfri Healthchecks.io-kontroll: success-ping först efter lyckad SQL-rensning och godkänd health-status, failure-ping vid fel, extern bevakning av utebliven ping. Använd UTC-schema med två timmars respit, larm senast kl. 04 UTC, till en av ägaren godkänd adress. Inga kunduppgifter skickas. Ping-URL lagras som hemlighet. En separat kontroll bevakar eventuell egen backup. Tjänsten och kodkopplingen är **inte aktiverade**. Larmet måste prövas genom utebliven körning och återhämtning; Vercel-loggar eller en länk till health-routen är inte i sig larmning. Ingen betald log drain föreslås.

## Integritetsförslag och rättsliga beslut

Det aktiva sparvalet är ett produktval. Det gör inte all behandling tillåten automatiskt. Förslag till dokumenterad uppdelning, som ansvarig måste fastställa:

- Konto och nödvändig köptjänst: pröva avtal, artikel 6.1 b.
- Frivilligt sparat känsligt analysunderlag: pröva samtycke enligt 6.1 a **och separat undantag för hälsouppgifter enligt 9.2 a, uttryckligt samtycke**. Grund och undantag är två skilda bedömningar.
- Obligatoriska bokföringsuppgifter: rättslig förpliktelse där den faktiskt gäller; detta motiverar inte obestämd köphistorik eller lagring av testsvar.

Föreslå 24 månaders retention för just kontots AuDHD-köphistorik från kopplingen, eller tidigare vid kontoradering. Detta är ett separat ägarbeslut och behöver implementeras; befintligt bokförings-/betalningsunderlag hanteras utanför denna portalhistorik enligt sin fastställda grund.

**Textutkast för valt upplägg, att godkänna och komplettera:**

> Om du väljer att spara din AuDHD-analys lagrar vi dina testsvar och underlaget för analysen krypterat, så att du kan öppna den från ditt konto. Uppgifterna kan röra din hälsa. Den frivilliga lagringen grundas på ditt samtycke och ditt uttryckliga samtycke till behandlingen av hälsouppgifter. Du behöver inte spara analysen för att köpa eller använda resultatet. Du återkallar samtycket genom att radera kontots analys på Mina sidor.
>
> Sista tillgänglighetsdag visas på Mina sidor. Den sätts till tio dagar före tolv månader från sparningen. Kontokopian rensas därefter ur den aktiva databasen. Tidigare säkerhetskopior har högst sju dagars beslutad lagringstid; raderade analyser spärras vid återställning. Köphistoriken innehåller inga testsvar, poäng eller analysprofil och hanteras separat. Gästlagring och din egen webbläsares data har egna raderingsflöden. Kontakta support@relationsvarning.se för frågor eller begäran om tillgång eller radering.

Texten förutsätter beslut om föreslagna grunder och får användas först när den nya raderingsrutinen fungerar. Komplettera med ansvarig juridisk person, beslutad köphistorikretention, biträden/överföringar, backupvillkor och rättighets-/IMY-information. Detta är ett förslag utan juridisk garanti.

## Publiceringsordning och återgång

1. Ägaren beslutar plan, retention/rättsliga grunder och larmmottagare. Ingen uppgradering sker automatiskt.
2. Kontrollera anslutningar via godkänd verifiering utan att visa hemligheter. Implementera/testa generations-ID, extern journal, vald backup och heartbeat-koppling lokalt/staging. Genomför isolerat återställningsprov med raderad analys, nytt sparsamtycke och borttaget konto.
3. Aktivera vald backup och pröva larm efter särskilt godkännande. Fastställ selektiv filförteckning; kör tester/bygge efter kommande kodändringar.
4. Endast efter separat godkännande: namngiven migration, selektiv push/deployment, första lyckade rensningen, verifierat backup- och larmstatus, därefter kontrollerat mobilprov. Inga skarpa betalningar utan eget godkännande.
5. Vid fel: stoppa ny kontosparning med en förberedd, provad driftswitch/återgång. Bevara gästflöden, befintliga kontokopior, radering och rensningsjobb. En full rollback till fas 1 saknar den nya rensningsrouten; använd därför en särskild återgångsversion som behåller underhållet, eller ordna en godkänd separat rensningsväg. Kontrollera Cron efter rollback. Återställ inte hela gamla databasen för ett vanligt kodfel och släpp inte de nya tabellerna.

## Källor

[Supabase planer](https://supabase.com/pricing), [backup och Free-export](https://supabase.com/docs/guides/platform/backups), [CLI-återställning](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore), [Vercel planer](https://vercel.com/pricing), [kommersiellt bruk](https://vercel.com/docs/limits/fair-use-guidelines), [Cron](https://vercel.com/docs/cron-jobs/usage-and-pricing), [R2-pris](https://developers.cloudflare.com/r2/pricing/), [kostnadsfri larmning](https://healthchecks.io/pricing/), [ping/larm](https://healthchecks.io/docs/), [IMY om rättslig grund](https://www.imy.se/verksamhet/dataskydd/det-har-galler-enligt-gdpr/rattslig-grund/), [IMY om känsliga uppgifter](https://www.imy.se/verksamhet/dataskydd/det-har-galler-enligt-gdpr/introduktion-till-gdpr/personuppgifter/kansliga-personuppgifter/nar-far-ni-behandla-kansliga-personuppgifter/).
