# Lokal granskning av NPF-sidorna

Starta med `NEXT_PUBLIC_NPF_LOCAL_PREVIEW=true` och `NEXT_PUBLIC_DIRECT_TEST_ACCOUNTS_ENABLED=false` på den lokala utvecklingsservern. På de svenska testsidorna öppnar `?preview=paywall` den vanliga betalväggen med syntetiska svar. Förhandsvisningen sparar inga exempelresultat, skickar ingen GA4-statistik och startar ingen betalning. Parametern har ingen funktion i ett produktionsbygge.

## Pris och rapportåtkomst

Den 26 november 2026 kontrollerades de två befintliga priserna och betalningslänkarna via skrivskyddade GET-anrop i Stripe Workbench. Båda priserna är aktiva i live-läge, avser exakt 79 SEK som engångsbetalning och tillhör respektive produkt. Varje länk har en produktrad med rätt Price ID, saknar rabattkod och återvänder till motsvarande test. [Verifierade Stripe-ID:n](../deploy/pricing79.json)

Åtkomst till redan betalda rapporter använder fortfarande den sparade kopplingen mellan köp och Stripe-session. Det ursprungliga priset på 39 kr verifieras som 39 kr, även när nya köp kostar 79 kr. Huvudindex, rapportversioner och svarskoder används som tidigare. Svenska AuDHD kostar fortsatt 79 kr och norska AuDHD ingår inte i prisbytet.

## Vid ett framtida separat lanseringsgodkännande

1. Samordna webbversionen med `customer-tests` i Supabase. Webbplatsen kontrollerar beloppet som backend rapporterar. Kassan avvisar en begäran när beloppet i webbläsaren och på servern skiljer sig.
2. Kontrollera `TEST_ACCOUNTS_ADHD_PRICE_ID` och `TEST_ACCOUNTS_AUTISM_PRICE_ID` mot de verifierade 79-kronorspriserna. Behåll gamla och nya Price- och Payment Link-ID:n i respektive produkts tillåtna lista i `STRIPE_PAYMENT_PRODUCT_MAP_JSON`. Befintligt innehåll i den listan gick inte att läsa ut i denna granskning.
3. GA4 använder Vercels befintliga `GA4_MEASUREMENT_PROTOCOL_API_SECRET`. Supabase verifierar Stripe-händelsen och skickar en signerad minimiuppsättning uppgifter till Vercel, bara när mätning har medgetts. Det fullständiga Stripe-underlaget, testsvar och rapportresultat skickas inte. Äldre betalningslänkar som återvänder utan sparat checkoutbelopp registreras inte som köp på 79 kr.
4. Verifiera landningssidor, kassa, webhooks, rapportåtkomst, tidigare köp och GA4 i rätt miljö. Ett fullständigt liveköp ingår inte i den lokala granskningen.
