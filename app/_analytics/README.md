# GA4 – Relationsvarning

Measurement ID: `G-XWVSHHNY7G`. Integration: `app/_analytics/`.

## Inställningar i GA4 före publicering

Sajten skickar manuella `page_view` för App Router och använder `send_page_view: false`.
I webbströmmen: Förbättrad mätning → Sidvisningar → avancerade inställningar:
**stäng av sidvisningar baserade på webbläsarens historikändringar**.
Annars kan GA4:s egen history-lyssnare skapa ytterligare sidvisningar. Den inställningen
är extern och kan inte verifieras enbart genom ett lokalt bygge.

Lägg vid behov `buy.stripe.com` till oönskade hänvisningar i webbströmmens tagginställningar,
så att en betalningsretur inte ersätter ursprunglig trafikkälla. Inget eget attributeringssystem
har införts. UTM-parametrar och gclid/gbraid/wbraid bevaras i sidvisningens page_location.

Skapa eventbaserade anpassade dimensioner för `test_id`, `test_name` och vid behov
`progress_percent` för rapporter/Explorations. Verifiera slutligen i GA4 DebugView/Realtime.
Lokala kontroller använder en stub för Google-taggen och skickar inte testtrafik till GA4.

## Samtycke och dataminimering

Google-taggen laddas först efter aktivt godkännande av statistik. Avvisning hindrar både
Google-script och anpassade events. Valet kan ändras i sidfoten. Återkallande stoppar mätning,
rensar analytics-specifik genomförandestatus och tar bort `_ga`-cookies. Testernas egna svar
eller upplåsning berörs inte. Reklamlagring, annonsanvändardata och personalisering förblir nekade.

Svar, frågetexter, poäng och profiler skickas inte; helpern har en tillåten parameterlista som
utesluter bland annat `total_score_percent` och `profile_type`. Endast flödesdata behandlas.
Events innan samtycke återskapas inte. Teststart räknas från första mätta svar efter samtycke.

## Events

Alla testevents har `test_id` och `test_name`.

- `test_start`: `page_path`
- `test_progress`: `progress_percent` (25/50/75), `current_question`, `total_questions`
- `test_complete`: `total_questions`, `completion_time_seconds`
- `paywall_view`: `price`, `currency`
- `checkout_start`: `value`, `currency`
- `purchase`: `value`, `currency`, `transaction_id`
- `page_view`: `page_path`, `page_location`, `page_title`, `page_referrer`

Genomförandestatus sparas separat under `rv_analytics_attempt_v1:<test_id>` efter samtycke.
Starttid och milstolpar bevaras vid omladdning. Tidsåtgång är förfluten tid, inklusive pauser;
GA4:s vanliga engagement time används separat. Ett genomförande avslutas först vid alla svar.
Börja om skapar nästa genomförande. Korrigering av befintliga svar räknas inte som ett nytt.

`paywall_view` kräver att betalväggen överlappar viewporten i en synlig flik och skickas en gång
per genomförande. `checkout_start` skickas synkront före befintlig redirect utan callback/väntan.
Ingen checkout räknas när testets befintliga kontroll stoppar en ofullständig Stripe-länk.

`purchase` följer exakt befintligt `paid=true` och betyder därför en betalningsretur, **inte en
serververifierad Stripe-transaktion**. Ett stabilt, slumpmässigt genomförande-id används som
transaction_id, utöver lokal deduplicering. Det är inte ett Stripe-betalnings-id. Rensad/blockerad
lagring eller manipulerade retur-URL:er kan inte ges samma garantier som en serververifierad betalning.
Det befintliga betalningssystemet har inte ändrats. Vid blockerad localStorage används sessionStorage,
och därefter minne under sidans livstid. Adblock/nätverksfel kan göra att events inte når GA4 men
får aldrig blockera test eller betalning.

Ingen egen time_on_page, användarprofil, identifierande answer-logg eller attribution lagras.
Debugutskrift används endast när `NODE_ENV === "development"`.
