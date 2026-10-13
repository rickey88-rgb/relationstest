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
