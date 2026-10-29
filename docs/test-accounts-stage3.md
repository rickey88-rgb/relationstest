# Testintegration etapp 3 – narcissismens självtest och relationstestet

Endast lokalt arbete i `C:\src\relationsvarning`. Ingen migrering, betalning, kunddataändring, abonnemangsändring, commit, push eller publicering i produktion.

## Integration

Två nya separata adaptrar använder samma serverkärna, checkout-handlers, kryptering, ägarskap, samtycke, lagring, radering, externa raderingsregister, rensning, övervakning och backup-reconcile som tidigare tester. Ingen parallell motor eller ny migration behövs. AuDHD:s specifika kod och samtliga tidigare fråge-/beräkningsmodeller är orörda.

| Test | Produktnyckel | Intern slug | Frågor | Frågeversion | Rapportversion | Befintlig testadress | Pris |
|---|---|---|---|---|---|---|---|
| Narcissism – självtest | narcissism_selftest | narcissism-sjalvtest | 30 | narcissism-sjalvtest-questions-v1 | narcissism-sjalvtest-report-v1 | /narcissism-sjalvtest/test | 39 SEK |
| Relationstest/screening | screening_test | screening | 42 | screening-questions-v2 | screening-report-v1 | /test | 39 SEK |

Adaptrarna accepterar endast fullständiga heltalssvar 0–4 med exakta fält/versionsvärden. Klientens paid-flagga, resultatobjekt eller mejladress är inget köpbevis. Narcissismens ursprungliga `calculate` återanvänds direkt, inklusive fyra omvända frågor, nivågränser och de viktade profilindexen. Relationstestets `calculate` och `resultAnalysis` återanvänds utan ändring: adapterresultatet innehåller både profil och svarsspecifik analys. Den gamla klientens tolerans för ofullständiga svar under pågående test behålls, men kontomotorn accepterar endast kompletta 42 svar.

Rapporterna använder delade `ReportView`-komponenter för tidigare klientrapport och serververifierad gäst-/kontoläsning. Relationstestets stöd-/säkerhetsinformation är kvar före betalväggen; nya serverrapporter återger samma säkerhetsinformation och resultatförklaring. Ursprungliga analyser/texter har frysts i oberoende testreferenser, och de ursprungliga rena modulerna är hashkontrollerade.

En frivillig `testPath` i adaptermetadata behövs eftersom dessa adresser avviker från mönstret `/<slug>-test/test`. Gemensam checkout använder den för avbruten betalning; tidigare adaptrar behåller exakt sina tidigare returadresser. Klienttransporten tar valfri explicit fråge-/rapportversion eftersom screeningens frågeunderlag redan är version 2. Standardversionerna för tidigare tester ändras inte.

Nya gästvägar: `/mina-sidor/gast/narcissism-sjalvtest/<uuid-v4>` och `/mina-sidor/gast/screening/<uuid-v4>`. De är de enda tillagda proxy-undantagen. Servern kontrollerar fortsatt browsersecret, produktbindning, lagringstid, raderingsregister och aktuell Stripe-betalning. Kontorapporter öppnas via motsvarande `/mina-sidor/tester/<slug>/<id>`, med ägarkontroll före Stripe/dekryptering. Samma befintliga bibliotek visar namn och korrekta öppnings-/raderingslänkar för alla sex generella testprodukter.

Alla nya checkout/save/read/import-flaggor är av som standard och oberoende. Gamla Payment Links, localStorage, omstart och betalningsåterkomst ligger kvar när checkout är av. Inga historiska köp importeras; inget konto kopplas utifrån mejladress eller klientdata. Gästlagring och frivillig kontolagring behåller etapp 1:s tidsgränser och raderingsregler.

## Tester och reproduktion

`stage3-parity.test.cjs` jämför 511 kompletta narcissismrapporter och 814 kompletta screeningrapporter mot frysta original samt mot portalvyn. Därtill jämförs 15 625 kombinationer av narcissismens dimensionspoäng/tolkningar och 6 561 screeningkombinationer. Testerna täcker omvänd poängsättning, 25/45/65-procentsgränser, alla fyra profiltyper, profilskillnader 14,5/15/15,5, noll-/maximalpoäng, extrema blandningar samt enskilda säkerhetsmarkörer som ska prioriteras även vid lågt områdesgenomsnitt.

Köp-/SQL-/konto-/raderings-/backup- och HTTP-/UI-harnessen från etapp 2 är parameteriserade och återanvänds, med samma standardkörning för föregående tester. De nya wrappers som kör båda nya adaptrarna testar strikt Stripe-bindning, fel produkt, fel ägare, samtycke, återöppning efter borttagen gästkopia, återbetalning, utgång, radering, kvarvarande köphistorik och återställning av raderad analys. UI/transport testar även rätt `/test`-returadress, 42 svar/frågeversion 2 och bibliotekets sex produkter. Endast syntetiska data, simulerad Stripe/R2 och lokal PGlite används; inga riktiga betalningar eller kunduppgifter.

Förbered med `node scripts/prepare-test-accounts-stage3.cjs`. Kör `node scripts/test-test-accounts-stage3.cjs`, TypeScript utan emit/incremental och `npm run build -- --webpack` i den utskrivna isolerade katalogen. Totalt ingår 53 testprogram, inklusive de tidigare 50. Verifieringskopian består av HEAD + uttryckliga tidigare leveransmanifest + endast etapp 3:s allowlist. Sitemaps skrivs bara där, aldrig över rotens andra arbeten.

## Avgränsning

Exakt lista och ursprungliga hashvärden finns i `scripts/test-accounts-stage3-files.json`. Arbetsstartens hashlista och verifieringsbevis sparas lokalt under ignorerade `.artifacts/test-accounts-stage3/`. AuDHD-filer, migrationsfiler, miljöfiler, package-filer, Vercel-konfiguration, Stripe-webhook och recovery-funktioner ändras inte. De enda gemensamma runtimeändringarna är adapterregistrering/metadata, valfri explicit klientversion, returadressval, de två gästundantagen, rapportdispatch och utökad integritetsinformation. Föregående tester använder oförändrade standardinställningar.

## Produktionsberoenden (utförs först efter uttryckligt godkännande)

1. Tidigare godkända konto-/AuDHD-leveranser, den generella migreringen och driftförutsättningarna måste finnas på plats. Denna etapp kräver ingen egen migrering, cronpost, monitor, nyckel eller lagringsbucket.
2. Välj två godkända engångspriser på 39 SEK och lägg dem i rätt befintliga produktposter i `STRIPE_PAYMENT_PRODUCT_MAP_JSON`. Sätt respektive adaptervariabel från env-exemplet. Bevara alla tidigare mappningar. Självtestet ska mappas till `narcissism_selftest`, inte `narcissist_partner`; screeningen till `screening_test`. Gamla Payment Links ändras inte.
3. Godkänn integritetstext, frivilligt uttryckligt lagringssamtycke och information om gäståtkomst före köp. Relationssvar kan beröra andra personer och utsatthet; ansvarig behöver bedöma detta i den befintliga integritets-/riskbedömningen. Inga juridiska garantier lämnas.
4. Verifiera riktiga tjänsteanslutningar, Stripe-priser, betal-/returflöden och mobil i en godkänd miljö. Den befintliga verifieraren accepterar live mode; inga skarpa provbetalningar har gjorts eller tillåtits av denna etapp. Befintliga begränsningar för simulerad Stripe/R2 och PGlites advisory locks kvarstår.
5. Aktivera en produkt i taget: READ, SAVE och slutligen CHECKOUT efter godkänt prov. Håll importflaggor av. Vid problem stäng produktens CHECKOUT/SAVE men behåll radering/rensning/övervakning och fungerande läsning för redan sparade analyser. Återställ aldrig en gammal databas för att backa enbart kod och öppna aldrig en restore utan befintlig journal-reconcile.

## Verifierad lokal leverans

- 53 testprogram godkända, inklusive de tidigare 50. Inga analys- eller rapportavvikelser hittades i 1 325 kompletta rapportfall och 22 186 ytterligare poäng-/tolkningskombinationer.
- Separat TypeScript-kontroll godkänd utan fel, liksom TypeScript-steget i produktionsbygget. Webpack-bygge och postbuild godkända, 144 statiska sidor. Privata rapportvägar är dynamiska.
- ESLint för ändrad runtime-/test-/skriptkod: 0 fel; de två befintliga `tracking`-beroendevarningarna i de ursprungliga klienternas inläsningseffekter kvarstår.
- 28 leveransfiler: 18 nya och 10 ändrade sedan arbetsstarten. Inga andra då befintliga filer ändrades. Alla tidigare rena beräknings- och textmoduler är oförändrade.
- Granskning av filhashar, resultat och arbetsstartens baslinje sparas lokalt i ignorerade `.artifacts/test-accounts-stage3/`. Inga filer är staged, ingen commit eller push har skapats och inga produktionsändringar har gjorts.
