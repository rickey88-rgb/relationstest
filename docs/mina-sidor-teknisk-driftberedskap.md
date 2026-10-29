# Mina sidor fas 2 – lokal driftberedskap

2026-10-26. Vercel Pro + Supabase Pro är planerade men ska uppgraderas senare av ägaren. Inga abonnemang, miljövariabler, produktionsdata eller tjänstkonton har ändrats. Larmmottagare ska bli **drift@relationsvarning.se**, efter att adressen fungerar. Ingen faktisk larmleverans har skett.

## Implementerat lokalt

- Varje sparning har ett slumpmässigt, oföränderligt generations-ID. Nytt aktivt sparval efter radering skapar ny generation; en gammal analys återaktiveras inte.
- Privat R2-register, separat från boklagringen. Objektets namn är HMAC av generationen; kvittot innehåller hash, tidpunkt och orsak, inga testsvar, mejladresser eller betalnings-ID:n. Signatur valideras vid läsning. Create-once med villkorad PUT, återläsning före DELETE och idempotenta återförsök.
- En signerad `v1/registry.json` måste finnas i rätt bucket och matcha en separat förväntad registeridentitet. Saknad/felaktig bucket, 403, nätverksfel eller fel signatur blockerar åtkomst. Ingen automatisk provisionering av tomt register sker.
- Varje generation binder också bucket/endpoint, register-ID och nyckelfingeravtryck i databasen. Fel register, ändrad bucket eller direkt nyckelbyte kan inte tolkas som att en äldre generation saknar raderingskvitto. Byten kräver en granskad migration/nyckelrutin.
- Databasen tillåter inte analys-DELETE eller CASCADE utan lokal kvittens, som servern skriver först efter beständig extern kvittens. Direkt Auth-kontoradering stoppas om kvitton saknas. Privilegierade administratörer kan kringgå DB-skyddet; sådan manuell bypass är inte en godkänd rutin.
- Ägarskap kontrolleras före registerläsning/Stripe/dekryptering. Den externa generationens raderingsstatus kontrolleras även vid vanlig återöppning. En gammal databasbackup ensam kan därför inte återexponera en raderad generation. Köphistorik och gästdata är fortfarande separata.
- `ACCOUNT_STORAGE_MODE`: saknas den är kontolagringen **disabled**. `maintenance` stänger kundens kontoläsning/sparning, men tillåter rensning och operatörsarbete. `active` måste väljas uttryckligen efter godkänd verifiering. Ägarens analysradering kräver inte att tjänsten är aktiv.
- Kontokopian löper ut vid 12 kalendermånader minus tio dagar. Tio dagar budgeterar för daglig rensning, ingripande och sju dagars återställbar backup. Detta är inte en garanti för leverantörens alla interna kopior; verklig retention måste verifieras före lansering.

## Rensning och kostnadsfria larm

Befintligt gästrensningsjobb lämnas orört. Kontojobbet är fortsatt `0 2 * * *` UTC. Det journalför och raderar i batcher om 100, upp till 1 000 kopior och med en intern tidsbudget per anrop. Kvarvarande kö, SQL-fel eller registerfel ger 503 och ingen falsk lyckad signal. Upprepa kontrollerat tills kön är tom. Partiellt genomförd radering är säker att återförsöka. DB-frågor har statement-/lock-timeout; drift-/återställningsroutes har 300 sekunders tak som stöds av planerad Pro.

Efter lyckad SQL-rensning och grundläggande DB-hälsokontroll skickas en tom POST till en strikt tillåten `hc-ping.com`-adress. Först lyckad leverans registreras som monitor-success. Vid fel försöker jobbet skicka `/fail`; om även det misslyckas loggas endast en fast felkod. Den oberoende tjänsten kan larma när inga pings alls kommer fram. Ingen kunddata eller larmmejladress skickas i ping-payloaden.

Health-routen kräver CRON_SECRET och kontrollerar driftläge, monitor-konfiguration, registeråtkomst, senaste lyckade rensning och senaste levererade ping. Äldre än 26 timmar eller analysunderlag försenat minst 24 timmar ger 503. Nya kontosparningar stoppas om DB-rensnings-/monitorstatus inte är frisk; sparning/öppning kontrollerar dessutom själva registret.

Healthchecks.io Free ska konfigureras för UTC-schema `0 2 * * *`, två timmars respit och verifierad mejlintegration till driftadressen. Pro behövs inte hos larmleverantören. Skapa inte kontot eller aktivera mejl förrän ägaren godkänt konfigurationen och brevlådan är klar. Endast fristående Healthchecks-larm skyddar mot en helt död Vercel-process; DB-status och loggar är inte ersättning för detta.

## Säker återställning

1. Stäng kontoytan med `maintenance` **innan** återställning. Stäng inte gästköp. Återställ isolerat och behåll R2-registret och dess nyckel/identitet utanför databasåterställningen. Kontrollera rätt appkrypteringsnyckel och oförändrat Auth-ägarskap. Backup av tabeller ensam ersätter inte Auth-/konfigurationsåterställning.
2. Kör skyddad `POST /api/account-maintenance/reconcile` i den isolerade miljön. Header: `Authorization: Bearer ACCOUNT_MAINTENANCE_SECRET` samt `Origin` för miljön; innehållstyp URL-encoded. Formfält: `confirm=reconcile-isolated-restore` och `snapshotCreatedAt` med backupens **verkliga** tid enligt backupmetadata. Framtida/ogiltig tid eller äldre än sju dygn nekas. Falsk tid får inte användas för att kringgå gränsen.
3. API:t kontrollerar 100 analyser per batch, tillämpar externa kvitton, journalför utgångna kopior och gör fysisk DELETE. Det rensar gamla hälsostämplar och öppnar aldrig trafik. Om svaret har `complete=false`, fortsätt med svarets `nextCursor` som `afterPurchaseId`, samma backup-tid, tills `complete=true`. Hoppa inte över batcher. Vid fel: stå kvar i maintenance och återförsök från senaste bekräftade cursor.
4. Bekräfta två testägare, raderad generation nekas, ny giltig generation fungerar, utgångna data är borta, och att borttagna konton/återkallad betalningsåtkomst inte återinförs. Vid Auth-återställning ska tidigare kontoraderingar och sessionsåterkallelser också hanteras av den godkända identitetsrutinen; den här koden återställer eller raderar inte Auth-användare. Den förhindrar återexponering av deras tidigare journalförda analyser.
5. Kör rensning + monitorprov, verifiera larm/återhämtning, och öppna därefter med separat godkännande för `active`. Registerfel blockerar även om någon av misstag aktiverat tjänsten innan avstämningen är klar.

Administrativ kontoradering: i maintenance kan operatören först använda `POST /api/account-maintenance/erase-account-analyses`, samma operatörsheader/Origin, formfält `confirm=erase-account-analyses` och kontots verifierade UUID i `userId`. Efter lyckat svar kan den separat godkända Auth-raderingen göras. API:t raderar inte Auth-kontot. Cron-hemligheten ger **inte** operatörsbehörighet; en separat minst 32 tecken lång underhållshemlighet krävs. Kundens vanliga radering sker fortsatt med verifierad Auth-session och bekräftelse.

**Återgång vid kodfel:** stäng ny kontosparning/läsning med maintenance och behåll denna versions raderings-, register- och Cron-kod. Rulla inte blint tillbaka till fas 1 som saknar underhållsroutes. Bygg/prova en särskild återgångsversion innan lansering. Återställ inte hela databasen och släpp inga kontotabeller för ett vanligt appfel. Vercel rollback ska följas av kontroll av vilka Cron-routes som faktiskt finns.

## Provisionering efter abonnemangsuppgraderingen

- [ ] Bekräfta Vercel Pro och Supabase Pro. Kontrollera första fungerande projektbackup, verklig sju-dygnshorisont, anslutningens rätta Supabase-projekt, verifierad TLS och befintliga krypterings-/signeringsnycklar utan att skriva ut värden.
- [ ] Skapa separat privat R2-bucket med passande region/biträdesvillkor, ingen publik domän/r2.dev, begränsade nya credentials. Återanvänd inte boknycklar. Säkra separat backup/åtkomst till journalen och nyckeln; förlust av journal eller identitet är en blockerande incident.
- [ ] Fyll nödvändiga nya värden enligt `account-operations.env.example` i godkänd miljö, initialt disabled/maintenance. Inga riktiga värden ingår i repot.
- [ ] Skapa signerad registerfil **lokalt** med `node scripts/account-journal-registry.cjs` och avsedda nyckel/ID i processmiljön. Filen skapas endast i `.artifacts`; scriptet laddar inte upp något och skriver inte ut nyckeln. Godkänd operatör laddar sedan upp filen till `v1/registry.json`. Använd aldrig en ny registeridentitet som en snabb lösning på förlorade kvitton. Rotera inte signeringsnyckeln utan versions-/omskrivningsplan.
- [ ] Fastställ kvittoretention innan R2-lifecycle aktiveras. Tekniskt förslag: **400 dagar endast för prefixet `v1/analyses/`**. Registry-sentineln ska inte ha TTL. Detta är längre än tidigare föreslagna 30 dagar: ett externt kvitto måste skydda även när SQL-raderingen rullat tillbaka och kopian ligger kvar. SQL-kvitton rensas efter 400 dagar om generationen saknas. Alla egna backuper/exporter med analyser ska ha högst beslutad sju-dygnshorisont. Ingen R2-lifecycle har ändrats.
- [ ] När driftadressen fungerar: skapa gratis monitor, välj mejlmottagare, placera hemlig ping-URL i godkänd miljö och pröva utebliven körning, felping, transportfel och återhämtning. Bekräfta faktisk leverans till **drift@relationsvarning.se**.
- [ ] Efter separat godkännande: tillämpa endast granskad kontomigrering i staging, kör verkligt R2-/TLS-/Auth-/Stripe-/restoreprov med syntetiska testdata. Inventera nya tabell-/index-/funktionsnamn i produktion igen inför godkänd migration. Migrationsfilen är fortfarande ett opublicerat lokalt förslag, inte en redan tillämpad migration.
- [ ] Kör isolerad leveranskontroll från manifestet, TypeScript, regressioner och bygge. Godkänn sedan uttryckligen produktionsmigrering, selektiv push/deployment och eventuellt skarpt mobilprov. Aktivera account storage först efter första lyckade rensningen och verifierad monitor/backup. Inget sådant godkännande antas nu.

## Integritetstext för slutligt beslut

För publicerad text föreslås:

> Du väljer själv om din AuDHD-analys ska sparas på kontot. Testsvaren kan innehålla känsliga uppgifter om din hälsa. Vi sparar underlaget krypterat för att du ska kunna öppna analysen igen. Du behöver inte spara analysen på ett konto för att köpa och använda resultatet. Du kan återkalla samtycket till kontolagringen genom att radera kontots analys på Mina sidor.
>
> Sista tillgänglighetsdag visas på Mina sidor och sätts till tio dagar före tolv månader från sparningen. Radering ur den aktiva databasen skriver inte om tidigare säkerhetskopior. Med den beslutade backuphorisonten kan kopior finnas kvar i upp till sju dagar; ett separat raderingsregister används för att hindra att en raderad analys åter blir tillgänglig vid återställning. Registret innehåller skyddade identifierare, orsak och tidpunkt, inga testsvar eller mejladresser. Köphistorik, gästlagring och din webbläsares data hanteras separat.

Fastställ före publicering: personuppgiftsansvarig juridisk person; artikel 6-grund per ändamål; tillämpligt artikel 9-undantag. Föreslaget för den frivilliga känsliga kontokopian är 6.1 a + uttryckligt samtycke enligt 9.2 a. Produktens sparval är inte i sig grund för all konto-/betalnings-/säkerhetsbehandling. Föreslagen grund för nödvändig konto-/köptjänst är avtal där den faktiskt är tillämplig. Journalens syfte, 400-dagarsretention och rättsliga grund samt köphistorikens egen retention, kontorättigheter, biträden/överföringar och IMY-information kräver ansvarigs beslut. Ingen juridisk garanti lämnas. Den lokala integritetssidan är ännu ett utkast och är inte fullständig utan dessa uppgifter.

## Verifiering

Slutkörning i isolerad HEAD-kopia med endast manifestets **55 filer** plus den minimalt rekonstruerade recovery-testfixen:

- **37 av 37 testprogram godkända.** PostgreSQL/PGlite kör riktig migrering och SQL med syntetiska data. Testerna omfattar gamla backupkopior, externa kvitton, fel registeridentitet, SQL-rollback efter beständig journalföring, ny generation vid nytt samtycke, blockerad osäker Auth-CASCADE, återställning över flera batcher, automatisk rensning av 101 rader samt transport-/monitorfel. Gästköp, Auth, Stripe, recovery, rapport och boknedladdningarnas regressioner passerar.
- **Separat TypeScript-kontroll godkänd:** `tsc --noEmit --incremental false`.
- **Produktionsbygge med webpack godkänt**, inklusive Nexts TypeScript-kontroll och 144 genererade sidor.
- ESLint: noll fel och en sedan tidigare befintlig varning för oanvänd `setRecoveryNotice` i gästsidan. Ingen separat recovery-logik har ändrats för att dölja varningen.

Inga riktiga kunduppgifter används. R2 och monitor testas med lokala testdubblar; den verkliga leverantörsintegrationen och larmmejlen kan verifieras först efter godkänd provisionering. Ingen skarp backup har hämtats eller återställts. Ingen drift-/legal aktivering antas av dessa testresultat.

Plankompatibilitet: Node/Next serverroutes med 300 sekunders tak fungerar på Vercel Pro; två dagliga Cron-jobb kräver ingen separat Cron-plan. Supabase Pro ger planerad daglig backup; ingen PITR/Team-funktion används. Cloudflare dokumenterar stark read-after-write och atomisk `If-None-Match` för R2, vilket används av kvittot. [R2-konsistens](https://developers.cloudflare.com/r2/reference/consistency/), [Vercel-duration](https://vercel.com/docs/functions/configuring-functions/duration), [Healthchecks-pings](https://healthchecks.io/docs/).
