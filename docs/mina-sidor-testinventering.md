# Mina sidor: inventering av testresultat

**Inventerad projektrot:** `C:\src\relationsvarning`

**Git-rot:** `C:/src/relationsvarning`

**Branch:** `main`

**Omfattning:** läsning av källkod och databasmigreringar. Inga testflöden eller betalningar har ändrats.

## Sammanfattning

- 15 testflöden har en betald analys/checkout i appen.
- AuDHD är det enda testet med ett fullständigt serversparat återställningsflöde för testsvar. Svaren krypteras på servern, betalningen kontrolleras mot Stripe och återställningen begränsas med signerad åtkomst och återkallas vid återbetalning/tvist.
- De övriga 14 flödena bygger huvudsakligen på `localStorage` för svar och tillstånd. Den gemensamma klienthjälparen accepterar `?paid=true` eller ett lokalt `unlocked`-värde som upplåsning. Det fungerar för befintlig webbläsarresa men räcker inte som serververifierat ägarskap eller återöppning mellan enheter.
- Stripe-webhooken har en serverbaserad betalningslogg och en produktkatalog med produktnycklar. Loggen har i nuläget inte användar-ID, verifierad köparmejl, analyser eller rättigheter. Produktmappningen beror på `STRIPE_PAYMENT_PRODUCT_MAP_JSON` i driftmiljön; den konfigurationen har inte lästs.
- Därför är slutsatsen inte att alla befintliga köp saknar Stripe-verifiering. Slutsatsen är att koden för de flesta testerna inte använder serververifierad Stripe-betalning för att öppna den lokala analysen, och att betalningsloggen ensam inte kopplar köpet till ett konto.

## Testkarta

| Test | Betald produktnyckel | Resultat/svar i dag | Serveråterställning | Bedömning för Mina sidor |
|---|---|---|---|---|
| AuDHD | `audhd_test` | Svar i webbläsaren och krypterat serverunderlag | Ja. Checkout-attempt, Stripe-verifiering, krypterade svar och recovery-grants | Referensflöde. Behöver senare kopplas till konto utan att ersätta nuvarande recovery |
| ADHD | `adhd_test` | `localStorage`, modell beräknar analys i klienten | Nej, gemensam lokal återställning | Behöver serversparning och verifierat köp för kontobibliotek |
| Autism | `autism_test` | `localStorage`, analys beräknas i klienten | Ingen generell betalad analysåterställning hittad. Separat support-recovery finns | Behöver skilja betalad analys från befintligt supportflöde |
| Ångest | `angest_test` | `localStorage`, modell beräknar analys i klienten | Nej | Behöver serversparning och verifierat köp |
| HSP | `hsp_test` | `localStorage`, modell beräknar analys i klienten | Nej | Behöver serversparning och verifierat köp |
| IQ | `iq_test` | `localStorage`, svarstider och svar används för profilrapport | Nej | Svarstider ingår i analysunderlaget; dataminimering behöver bedömas |
| PTSD | `ptsd_test` | `localStorage`, modell beräknar analys i klienten | Nej | Behöver serversparning och verifierat köp |
| Narcissism, självtest | `narcissism_selftest` | `localStorage`, modell beräknar analys i klienten | Nej | Behöver serversparning och verifierat köp |
| Relationstest/screening | `screening_test` | `localStorage`, modell beräknar analys i klienten | Nej | Behöver serversparning och verifierat köp |
| Anknytning | `attachment_test` | `localStorage`, modell beräknar analys i klienten | Nej | Behöver serversparning och verifierat köp |
| Gaslighting | `gaslighting_test` | `localStorage`, modell beräknar analys i klienten | Nej | Behöver serversparning och verifierat köp |
| Medberoende | `codependency_test` | `localStorage`, modell beräknar analys i klienten | Nej | Behöver serversparning och verifierat köp |
| Relationsmönster kring narcissism | `narcissist_partner` | `localStorage`, modell beräknar analys i klienten | Nej | Behöver serversparning och verifierat köp |
| Psykisk misshandel | `psychological_abuse_test` | `localStorage`, modell beräknar analys i klienten | Nej | Behöver serversparning och verifierat köp |
| Traumabindning | `trauma_bond_test` | `localStorage`, modell beräknar analys i klienten | Nej | Behöver serversparning och verifierat köp |

## Gemensamt nuläge

### Svar och analys

De vanliga testmodellerna validerar versionsmärkta svar och räknar fram rapporten i klienten. Webbläsarens lagring används både för att återuppta ett test och för att bevara uppgifter genom en Stripe-resa. Återställning fungerar därför i praktiken bara när samma webbläsare fortfarande har rätt data.

### Betalning

`usePaymentRecovery` låser upp klientvyn när URL:en innehåller `paid=true` eller lokal lagring säger `unlocked=true`. Det är en historisk klientmekanism och kan inte användas som bevis för kontoägarskap i Mina sidor. AuDHD har ett separat serverflöde med Stripe-Checkout-session, betalningskontroll och krypterad lagring.

Webhooken verifierar Stripe-händelser genom att läsa Checkout-sessionen och dess line items, och skriver en idempotent betalningspost. Den lagrar inte köparmejl eller Supabase-användare. Dessutom är ledger-migreringen kommenterad som skuggbokföring, inte som en rättighetsmodell.

### Böcker

Bokleverans har redan separata tokens och serverflöden. Det bör inventeras och kopplas till konto som egen produkttyp, inte behandlas som ett testresultat.

## Rekommenderad fortsättning

1. Bekräfta produktmappningen i drift för samtliga 15 produktnycklar och vilka betalningslänkar/priser som är aktiva. Läs inte ut hemligheter; verifiera endast att nycklarna och Stripe-ID:n är mappade.
2. Bestäm dataminimering per test: om svar krävs för att räkna om rapporten, spara svaren krypterat; annars spara ett versionsmärkt, minimerat analysunderlag. IQ-testets svarstider kräver särskilt beslut.
3. Bygg en generell servermodell för testförsök, krypterat underlag och verifierad köprätt. En Stripe-webhook-bekräftelse ska skapa/aktivera rättigheten; webbläsarens `paid=true` ska inte göra det.
4. Knyt köp till konto först efter autentiserad mejllänk till samma verifierade mejladress som Stripe tillhandahöll servern. Skapa inte rättigheter från ett mejladressfält eller en Checkout-retur.
5. Lägg till återöppning för ett test i taget och behåll nuvarande gästflöde och AuDHD-/bokåterställningar under utrullningen.

## Kvar att kontrollera innan implementation

- Driftens Stripe-produktmappning och om nuvarande webhook tar emot och klassificerar varje testköp.
- Exakt produktpris, återbetalningshantering och aktiv status per Stripe Payment Link.
- Rättslig och integritetsmässig grund, lagringstid, radering och information till användaren för kontobaserad lagring av känsliga testsvar/resultat.
- Om analyser ska kunna öppnas i samma interaktiva testvy eller som fristående, versionsbundna rapporter.
