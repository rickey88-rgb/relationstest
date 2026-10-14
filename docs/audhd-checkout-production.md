# AuDHD Checkout: produktionskonfiguration

Den här konfigurationen skiljer det enda pris som nya Checkout-sessioner får använda från den smalare allowlist som även behövs för historisk recovery.

## Icke-hemliga produktidentifierare

`AUDHD_CHECKOUT_PRICE_ID` ska vara exakt ett aktivt live Stripe Price-ID för AuDHD på 79 SEK, engångsbetalning. Det får inte innehålla flera värden och får inte vara ett Payment Link-ID.

`STRIPE_PAYMENT_PRODUCT_MAP_JSON` ska behålla nuvarande struktur för shadow-ledgern. Under `audhd_test.priceIds` ska den innehålla både värdet från `AUDHD_CHECKOUT_PRICE_ID` och varje äldre, uttryckligen godkänt AuDHD Price-ID som får användas för recovery. Behåll även befintliga `paymentLinkIds`.

Illustrativ struktur, utan riktiga identifierare:

```json
{
  "audhd_test": {
    "priceIds": ["price_Current123", "price_Historical456", "price_Historical789"],
    "paymentLinkIds": ["plink_existing"]
  }
}
```

Checkout vägrar starta om dess explicit valda Price-ID saknas från allowlisten. Recovery v2 använder allowlisten men verifierar fortfarande live, slutförd, betald och ej återbetald Stripe-session. Inga andra Stripe-priser blir godkända.

## Serverhemligheter

Behåll `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `DATABASE_URL`, `AUDHD_RECOVERY_TOKEN_SECRET` och `AUDHD_RECOVERY_ISSUER_SECRET` som server-only variabler. `AUDHD_RECOVERY_TOKEN_SECRET` får inte roteras under v1-kompatibilitetsperioden.

Det finns ingen v1-issue-route eller v1-utfärdarskript efter release. Begränsa ändå åtkomsten till `AUDHD_RECOVERY_TOKEN_SECRET`: den behövs för att validera redan utfärdade v1-uppgifter och är därför fortfarande känslig under övergångsperioden.

Lägg dessutom in `AUDHD_CHECKOUT_ATTEMPT_ENCRYPTION_KEY`, `AUDHD_CHECKOUT_ACCESS_TOKEN_SECRET` och `CRON_SECRET` som server-only värden. Inget av dessa får prefixet `NEXT_PUBLIC_`.

## Verifierad GA4-purchase för AuDHD

Kör migrationen `202610140001_audhd_verified_ga4_purchase.sql` tillsammans med de tidigare Checkout-migrationerna. Lägg sedan in `GA4_MEASUREMENT_PROTOCOL_API_SECRET` som en server-only miljövariabel. Skapa hemligheten i GA4 under **Admin → Data streams → Relationsvarnings webbdataström → Measurement Protocol API secrets**. Mät-ID:t är samma som den befintliga webbtaggen (`G-XWVSHHNY7G`); hemligheten får aldrig ha prefixet `NEXT_PUBLIC_` eller förekomma i klientkod.

En purchase läggs bara i leveranskön när Stripe-webhooken har hämtat en live, slutförd, betald AuDHD Checkout-session med allowlistat pris, exakt 79,00 SEK och frivilligt fångad GA4-klient- och sessionskoppling. `transaction_id` är Stripe Checkout Session-ID:t (`cs_live_…`). Leveransen innehåller både GA4:s standardhändelse `purchase` för e‑commerce-rapportering och den separata `audhd_verified_purchase` för Ads-import. De är två vyer av samma outbox-rad, inte två köp; importera bara den senare som primär Ads-konvertering eftersom äldre testflöden fortfarande har klientbaserade `purchase`-händelser. Webhooken levererar eventen direkt och returnerar 5xx så att Stripe försöker igen vid GA4-fel; den befintliga nattliga, autentiserade Cron-körningen försöker även väntande leveranser. Samma transaktions-ID och databasnyckel gör omleveranser deduplicerade. När GA4 kvitterat rensas klient- och sessions-ID ur kön.

Utan godkänd statistik fångas ingen GA4-koppling och ingen Measurement Protocol-purchase skickas. Betalning, åtkomst och Checkout fortsätter då precis som tidigare. Inga testsvar, poäng, profiler, URL-parametrar eller referenter sparas i den här kopplingen.
