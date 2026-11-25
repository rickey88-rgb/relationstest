# Norsk AuDHD-lansering

## Sidor och sökintention

- `/no/audhd-test` är ingången för den som vill göra en självskattning. `/no/audhd-test/test` innehåller frågorna och resultaten.
- `/no/audhd` förklarar begreppet. `/no/adhd-og-autisme` förklarar överlapp och skillnader. `/no/audhd-symptomer` ger exempel på konkreta drag att observera.
- `/no/audhd-kvinner`, `/no/audhd-voksne`, `/no/audhd-maskering` och `/no/audhd-utredning` svarar på skilda frågor om sen upptäckt, vardag, maskering och norsk vård.
- `/no/hjernen-i-kryssild` är e-bokens landningssida. `/no/hjernen-i-kryssild/leseprove.pdf` är läsprovet. `/no/hjernen-i-kryssild/takk` hanterar nedladdning efter köp.
- `/no/personvern` och `/no/kjopsvilkar` innehåller villkoren. `/no` omdirigerar till testlandningen.

De norska resultaten för AuDHD innehöll informationssidor som NHI:s guide om samsjuklighet. Testfrågor ledde även till separata ADHD-test, exempelvis NHI och Helsespor. Helsenorge och Helsedirektoratet har stark relevans för diagnoser och utredning. Strategin ger varje norsk guide en avgränsad uppgift och låter kommersiell testintention gå till samma landning. Sökresultaten visar varför AuDHD behöver följas separat från ADHD. Sökvolymen är obekräftad. [NHI om AuDHD](https://nhi.no/sykdommer/psykisk-helse/adhd/AuDHD-Nar-ADHD-og-autisme-opptrer-sammen) · [NHI:s ADHD-test](https://nhi.no/skjema-og-kalkulatorer/kalkulatorer/psykiatri/adhd-selvtest) · [Helsenorge](https://www.helsenorge.no/sykdom/utviklingsforstyrrelser/adhd/)

## Stripe, moms och leverans

| Produkt | Värde i Stripe | Driftnyckel |
| --- | ---: | --- |
| AuDHD-rapport | 19900 NOK-öre | `NORWAY_REPORT_PRICE_ID` |
| E-bok | 24900 NOK-öre | `NORWAY_BOOK_PRICE_ID` |
| E-bok efter verifierat rapportköp | 14900 NOK-öre | `NORWAY_BOOK_OFFER_PRICE_ID` |

Den automatiserade rapporten bedöms vara en fjärrlevererad elektronisk tjänst med normalsatsen 25 %. Skatteetaten anger 50 000 NOK i momspliktig B2C-försäljning till Norge under en rullande tolvmånadersperiod som registreringsgräns för VOEC. Under gränsen kan verksamheten registrera sig frivilligt. Vid uppnådd gräns måste registreringen och momsinsamlingen följas upp. Med 199 NOK som totalpris innehåller en försäljning vid 25 % moms 39,80 NOK i moms. [Skatteetatens momssatser](https://www.skatteetaten.no/en/rates/vat-rates-for-remotely-deliverable-services-purchased-from-abroad/) · [VOEC-registrering](https://www.skatteetaten.no/en/business-and-organisation/vat-and-duties/vat/foreign/e-commerce-voec/register/)

E-boken är en fristående PDF som huvudsakligen består av text och stillbilder och bedöms omfattas av 0 % i sista försäljningsledet. Erbjudandet är ett separat köp. Förarbetena till norska boklagen anger att en utländsk aktör utan norsk etablering kan sälja direkt till norska slutkunder utanför fastprisreglerna. [Skatteetaten om böcker](https://www.skatteetaten.no/rettskilder/type/handboker/merverdiavgiftshandboken/gjeldende/M-6/M-6-4/) · [Boklagens förarbeten](https://www.regjeringen.no/no/dokumenter/prop.-82-l-20222023/id2968954/?ch=19)

Verksamheten har uppgett omsättning under gränsen och Stripe visade ingen aktiv norsk skatteregistrering. När köpresan är verifierad kan rapporten startas med `NORWAY_REPORT_TAX_MODE=below-threshold`. Följ total norsk momspliktig omsättning under rullande 12 månader och besluta när `stripe-tax` ska ersätta det läget. Verifiera aktiv norsk registrering och 25 % inkluderad moms i Checkout före bytet. Rapporter och e-böcker kan följas med `audhd_test_no` respektive `hjernen_i_kryssild` i den befintliga betalningsloggen.

Hela PDF-filen ligger i den privata Supabase-hinken `overthinking-book-private`, objekt `v1/Hjernen-i-kryssild.pdf`. Servern verifierar filstorleken 413902 byte och SHA-256 `26d02a8375d47ee697db6cff10e1f4d637f5fe3fc3a3c9418d376433802eea79`. Kundmejlen återanvänder Resend. Testfrågor och rapportinnehåll skickas aldrig i mejlen.

## Driftsättning och uppföljning

1. För Stripe-sandbox behövs `NORWAY_CHECKOUT_MODE=test`, `NORWAY_STRIPE_TEST_KEY`, sandboxens separata produkt- och pris-ID:n och en testanslutning till checkout-tabellerna. På preview används dess Vercel-adress. Kör migrationsfilen `202611250001_audhd_checkout_sandbox.sql` på testanslutningen för att kunna binda en sandbox-session. Ingen motsvarande schemaändring behövs för liveköp. Bekräfta checkout, webhook, gästnedladdning, rabatt, rapportåteröppning och mejl före skarp aktivering.
2. I produktion används den befintliga Stripe-nyckeln. Verifiera `NORWAY_REPORT_PRODUCT_ID`, `NORWAY_BOOK_PRODUCT_ID` och pris-ID:n ovan. Sätt `NORWAY_CHECKOUT_MODE=live`, vald momshantering och aktivera nya köp med `NORWAY_REPORT_CHECKOUT_ENABLED=true` och `NORWAY_BOOK_CHECKOUT_ENABLED=true`. Stäng en köpflagga om nya order behöver pausas. Befintlig verifiering använder pris-ID och betalläge för att fortfarande kunna leverera genomförda köp.
3. Sätt `NORWAY_INDEXABLE=true` i produktionsbygget efter godkänd QA. Kontrollera 200-svar, `lang="nb-NO"`, self-canonical, ömsesidiga språkversioner och nio sidor i `/no/sitemap.xml`. Kontrollera att frågor, tack och personliga resultat saknas i kartan samt att svenska canonical och befintliga indexerbara URL:er fungerar. [Googles dokumentation om språkversioner](https://developers.google.com/search/docs/specialty/international/localized-versions)
4. Välj den verifierade URL-prefixegendomen `https://www.relationsvarning.se/no/` i Search Console. Skicka in `https://www.relationsvarning.se/no/sitemap.xml` i Webbplatskartor. Livegranska `/no/audhd-test` och `/no/hjernen-i-kryssild` och begär indexering av båda. Följ sedan indexstatus och sökfrågor i egendomen. [Googles URL-granskning](https://support.google.com/webmasters/answer/12482179)
5. I GA4 filtrerar du organiska besök på sökkanal och `/no/`. För tratten använder du `test_id=audhd_test_no` för teststart, slutförande, betalvägg och checkout samt `item_id` för verifierade köp. Mät rapportköp per teststart och bokköp efter rapportköp. Använd belopp och valuta från den befintliga betalningsloggen om rapportens GA4-standardvaluta är SEK.
