# IndexNow

Projektet har en manuell IndexNow-integration som läser `public/sitemap-0.xml`. Därmed kan endast URL:er som finns i den aktuella sitemap-filen skickas. Routes som har `noindex` och är exkluderade från sitemap skickas inte.

Integrationen körs aldrig av `npm run build` eller `postbuild`. En misslyckad extern förfrågan kan därför inte stoppa ett bygge eller en deploy.

## Nyckel

Nyckelfilen publiceras på:

`https://www.relationsvarning.se/37204d60241ae6a76d1356cd09f52bb4.txt`

Kontrollera efter deploy att URL:en svarar med HTTP 200 och att filen endast innehåller nyckeln innan en verklig submission görs.

## Användning

Bygg först projektet så att sitemap-filen är aktuell. Granska därefter urvalet utan nätverksanrop:

```bash
npm run indexnow -- --dry-run
```

Efter deploy av nyckelfilen kan alla URL:er i sitemap skickas explicit:

```bash
npm run indexnow
```

En enskild URL kan skickas om den finns i aktuell sitemap:

```bash
npm run indexnow -- https://www.relationsvarning.se/ar-min-relation-sund
```

En enskild URL kan också kontrolleras utan submission:

```bash
npm run indexnow -- --dry-run https://www.relationsvarning.se/ar-min-relation-sund
```

Scriptet accepterar endast rena HTTPS-URL:er på `www.relationsvarning.se`, avvisar query-parametrar och fragment, deduplicerar sitemap-URL:erna och använder IndexNows globala bulk-endpoint. Ett verkligt fel ger exit-kod som inte är noll.

## Verifiering

Efter deploy kan Bing Webmaster Tools användas för att verifiera webbplatsen och följa IndexNow-status under webbplatsens IndexNow-/URL-submission-rapport. Kontrollera även serverloggen från scriptet; HTTP 2xx betyder att submission har tagits emot, inte att sidan garanterat indexeras.

IndexNow meddelar kompatibla sökmotorer om skapade eller ändrade URL:er. Det garanterar varken crawling, indexering eller förbättrad ranking och påverkar inte Googles vanliga crawl- och indexeringsprocess.
