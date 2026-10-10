# Stripe-webhook i skuggläge

Fas 1 registrerar verifierade Stripe-händelser i PostgreSQL. Den ändrar inte
Payment Links, returadresser, testupplåsning, recovery, bokcookies eller R2.

## 1. Supabase

1. Öppna projektets SQL Editor i Supabase.
2. Kör innehållet i `supabase/migrations/202610100001_stripe_shadow_ledger.sql`.
3. Hämta den server-only PostgreSQL Connection Pooler-anslutning som Supabase
   visar för serverless användning. Använd inte Data API och inte en browsernyckel.

## 2. Vercel

Lägg endast till servervariabler i Production och Preview:

- `DATABASE_URL`: Supabase Connection Pooler URL.
- `STRIPE_WEBHOOK_SECRET`: signing secret för just denna webhook-endpoint.

`STRIPE_SECRET_KEY` finns redan och återanvänds. Ingen av variablerna får ha
prefixet `NEXT_PUBLIC_`.

Lägg även till den icke-hemliga produktkartan när Price-ID:n och Payment Link-ID:n
är inventerade. Exempel, med ersatta identifierare:

```json
{
  "adhd_test": {
    "priceIds": ["price_..."],
    "paymentLinkIds": ["plink_..."]
  },
  "audhd_test": {
    "priceIds": ["price_..."],
    "paymentLinkIds": ["plink_..."]
  }
}
```

Spara JSON-strängen som `STRIPE_PAYMENT_PRODUCT_MAP_JSON`. Saknas den fungerar
skuggläget fortfarande, men registrerar produkter som `unmapped`.

## 3. Stripe

Efter att routen har deployats, skapa en webhook endpoint för:

`https://www.relationsvarning.se/api/stripe/webhook`

Välj bara följande events:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `checkout.session.expired`

Kopiera endpointens signing secret till `STRIPE_WEBHOOK_SECRET` i Vercel och
redeploya så att miljövariabeln blir tillgänglig.

## 4. Verifiering före senare faser

1. Skicka ett signerat Stripe-testevent och verifiera en rad i
   `stripe_webhook_events` och `stripe_payments`.
2. Återsänd samma event och verifiera att ingen ny betalning skapas.
3. Verifiera att en obetald/utgången session aldrig får `paid_at`.
4. Jämför skugglägets registrerade köp med Stripe Dashboard under flera dagar.
5. Ändra inte testernas `paid=true`-returer förrän avstämningen är godkänd.
