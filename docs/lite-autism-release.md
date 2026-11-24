# Lite autism har väl ingen dött av

Ellie Lind · Relationsvarning · PDF på 71 sidor · engångspris 149 SEK inklusive moms

## Produktkonfiguration

- Produktsida `/lite-autism-har-val-ingen-dott-av` och publik förhandsvisning `/lite-autism-har-val-ingen-dott-av/utdrag`.
- Stripe-katalognyckel `lite_autism_book`. Sök efter befintlig produkt med nyckeln och boktiteln. Använd `LITE_AUTISM_BOOK_PRODUCT_ID` och `LITE_AUTISM_BOOK_PRICE_ID` för verifierad aktiv liveprodukt och ett inklusivt engångspris på 14 900 öre i SEK. Stripe Tax används när den aktiva e-boksuppsättningen stöder det. `LITE_AUTISM_BOOK_TAX_RATE_ID` kan annars peka på den verifierade tillämpliga inklusiva momssatsen för befintlig försäljning. [Skatteverket om elektroniska publikationer](https://www4.skatteverket.se/rattsligvagledning/edition/2026.14/395136.html)
- Befintlig privat Supabase-bucket `overthinking-book-private`, ny sökväg `v1/lite-autism-har-val-ingen-dott-av.pdf`. Verifiera rätt projekt, privat åtkomst, tillåten filstorlek, typen `application/pdf`, 12 165 871 byte och SHA-256 `2657448a984eb48f7d1ccb6001232de748b25b704ebc85cffeb1e8282935af3c`. Originalet ligger utanför Git och public. En giltig köpbehörighet ger en Storage-länk som gäller i tre minuter. [Supabase om privata filer](https://supabase.com/docs/guides/storage/serving/downloads)
- Återanvänder `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `BOOK_ACCESS_TOKEN_SECRET`, `OVERTHINKING_BOOK_STORAGE_SECRET_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `RESEND_API_KEY`, `AUDHD_RECOVERY_EMAIL_FROM` och befintlig GA4-kö. Webhooken anger en leveransmarkering för den nya Checkout Session när Resend tagit emot mejlet.

## Verifiering före aktivering

- Bekräfta att befintlig signerad webhook tar emot Stripe-betalningen, att den nya Stripe-produkten är rätt mappad och att ett köpläge som godkänts för produktion skapar kassan med 149 SEK. Kontrollera separat vilka delar som går att bekräfta i en redan tillgänglig Stripe-testmiljö.
- Kontrollera att filen inte kan läsas anonymt eller av en vanlig klient i Supabase. Efter validering av exakt PDF ska den nya flaggan `LITE_AUTISM_BOOK_CHECKOUT_ENABLED=true` sättas i Production och byggas med det befintliga Git- och Vercelflödet.
- Startsidan, bokhandeln, relevanta guider, resultatvyn och sitemap aktiveras med köpet. Leverans via Mitt bibliotek kan fungera vid avstängd nyförsäljning när pris- och serverkonfigurationen behålls.
- Säljande PDF och gratisutdrag är olika filer. Gratisutdraget innehåller exakt originalsidorna 1, 10, 11, 15, 16, 20, 24 och 25.
- GA4 skickar visning, förhandsvisning och köpknappsevent efter samtycke. En skapad kassa skickar `begin_checkout`. En verifierad betald session med samtyckt GA4-attribution skickar ett deduplicerat `purchase` på 149 SEK genom samma serverkö. Stripe-betalningsloggen är underlag även för köp utan statistiksamtycke.

Lokalt köp-, leverans- och webhookprov körs med:

```sh
node --test app/api/books/lite-autism-har-val-ingen-dott-av/purchase-flow.test.cjs
```
