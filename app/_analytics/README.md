# GA4 – Relationsvarning

Measurement ID: `G-XWVSHHNY7G`. Den gemensamma implementationen finns i `app/_analytics/`.

## Standardtratt

Alla betalda tester använder samma kanoniska händelser:

- `test_start`: första besvarade frågan.
- `test_complete`: alla frågor i testet är besvarade.
- `paywall_view`: betalväggen är synlig i viewporten i en synlig flik.
- `begin_checkout`: användaren har påbörjat checkout precis före befintlig Stripe-navigering.
- `purchase`: befintlig `paid=true`-retur; den är **inte** Stripe-verifierad.

Varje tratthändelse innehåller `test_id`, `test_name`, `attempt_id`,
`paywall_version` och `release_id`. `paywall_version` behåller de tidigare
värdena: `personal-finding-v2` för ADHD, autism och AuDHD, annars `default`.
`release_id` kommer från `NEXT_PUBLIC_ANALYTICS_RELEASE_ID`; om den saknas
används den byggstabila fallbacken `rv-ga4-2026-10-08-etapp-1`. Sätt variabeln
explicit vid en framtida produktionsrelease som ska jämföras i GA4. Generera
aldrig värdet per event eller per användare.

`price`, `value`, `currency` och `items` läggs till för `paywall_view`,
`begin_checkout` och `purchase`. `test_progress` (25/50/75) är endast ett
kompletterande diagnosmått. `analysis_view` och `result_view` är också
kompletterande och används av AuDHD utan resultat-, poäng- eller profildata.

## Historik och AuDHD

Före Etapp 1 filtrerades `paywall_version` bort av den centrala
parameter-whitelisten. Äldre data kan därför sakna värdet och ska inte blandas
okontrollerat med data från denna release.

`checkout_start` är legacy och skickas inte längre. Vid historiska jämförelser
ska det räknas som föregångare till `begin_checkout`, men aldrig summeras med
den för samma tidsperiod eftersom båda skickades vid samma klick.

AuDHD:s tidigare parallella events (`audhd_landing_view`, `audhd_test_start`,
`audhd_question_progress`, `audhd_test_complete`, `audhd_analysis_complete`,
`audhd_paywall_view`, `audhd_paywall_cta`, `audhd_checkout_start`,
`audhd_purchase` och `audhd_result_view`) är legacy och skickas inte längre.
AuDHD använder den delade tratten med totalt 54 frågor: 48 huvudfrågor och sex
kontextfrågor. Därmed representerar `test_complete` hela testet.

## Samtycke och dataminimering

Google-taggen laddas först efter aktivt godkännande av statistik. Avvisning
hindrar både taggen och anpassade events; events före samtycke återskapas inte.
Helpern har en strikt allowlist och skickar inte svar, frågetexter, råpoäng,
resultat, profiler eller känsliga dimensioner. Analytics får aldrig påverka
test, checkout eller upplåsning.

`begin_checkout` skickas synkront med `transport_type: "beacon"` före den
befintliga Stripe-navigeringen, utan väntan eller callback. Adblockers,
nätverksfel och navigation innan Google-taggen hunnit laddas kan fortfarande
göra att enskilda client-side events saknas i GA4. Det är en mätbegränsning,
inte en ändring av betalningsflödet.

`purchase` är fortsatt inte tillförlitligt intäktsunderlag förrän en
serververifierad Stripe-webhook eller motsvarande deduplicerad servermätning
införs. Stripe är tills dess sanningskällan för verkliga köp.

## GA4-inställningar före publicering

Skapa eventbaserade anpassade dimensioner med exakt dessa parameternamn:

- `test_id`
- `test_name`
- `attempt_id`
- `paywall_version`
- `release_id`

Registrera även `price` och `currency` om de ska användas i egna explorations.
Markera inte `attempt_id` som en användaridentifierare. Bygg därefter rapporter
som delar `begin_checkout` med `test_complete`, grupperat per `test_id`,
`paywall_version` och `release_id`. Intäkt per 100 avslutade tester kräver
Stripe-verifierade köp innan den blir ett tillförlitligt affärsmått.

Sajten skickar manuella `page_view` för App Router och använder
`send_page_view: false`. I GA4:s webbström ska sidvisningar baserade på
webbläsarens history-ändringar vara avstängda. Lägg vid behov `buy.stripe.com`
till oönskade hänvisningar så att betalningsreturer inte ersätter trafikkällan.
Verifiera efter release i DebugView och Realtime med testtrafik som har givit
samtycke.
