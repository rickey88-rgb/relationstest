# GA4 audit – baslinje före Etapp 1

Audit genomförd 8 oktober 2026. Detta dokument beskriver det verifierade nuläget som låg till grund för Etapp 1, före kodändringarna i samma uppdrag.

## Bevisade kodproblem

1. `testEvents.ts` skapade `paywall_variant`, men den centrala allowlisten i `analytics.ts` tillät inte parametern. Den nådde därför aldrig GA4.
2. Varje checkout-klick från den gemensamma helpern skickade både `checkout_start` och `begin_checkout`. Rapporter som summerade båda kunde dubbelräkna checkout.
3. AuDHD skickade en parallell eventfamilj utöver den gemensamma tratten. Exempelvis skickades både AuDHD-specifika och standardiserade köp- och checkout-händelser vid samma flöde.
4. AuDHD:s egna `audhd_test_complete` utlöstes efter 48 huvudfrågor, medan den delade tratten korrekt nådde completion först efter ytterligare sex kontextfrågor. Det gjorde completionsdefinitionen inkonsekvent.
5. Psykisk misshandel-testet skickade dessutom `start_test` när introytan öppnades. Den kanoniska starten måste i stället vara första svaret.

## Begränsningar som inte ändras i Etapp 1

- `purchase` bygger på klientens `?paid=true`-retur och är inte Stripe-verifierad. En riktig intäktsmodell behöver serververifiering med deduplicering mot Stripe Payment Intent eller Checkout Session.
- Samtycke, adblockers, nätverksfel och snabb extern navigation kan göra att client-side GA4-händelser uteblir. Detta ska bedömas mot Stripe och inte tolkas som ett säkert mått på försäljning.
- Etapp 1 ändrar varken Stripe-URL:er, betalningslogik, scoring, resultat eller testfrågor.

## Standard som Etapp 1 inför

Den gemensamma tratten är `test_start`, `test_complete`, `paywall_view` och `begin_checkout`. Alla har samma säkra identitetsfält och en byggstabil `release_id`. AuDHD får samma tratt som ADHD och autism. Äldre eventnamn behålls endast som historiska data i GA4 och ska inte användas för nya konverteringsrapporter.
