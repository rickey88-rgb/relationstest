# Gäståterställning för nya testflödet

## Godkänd driftetablering 31 oktober 2026

Ägaren har godkänt publicering. Den avgränsade migreringen är genomförd med verifierad RLS, nekade klienträttigheter och kaskadgallring. Befintlig Resend-nyckel och avsändare återanvänds i Supabase. Leveransprov till driftadressen har mottagits och bekräftats. Tillfällig skyddad provväg är borttagen. Två befintliga, betalda och ej återbetalade gästköp med kvarvarande underlag har indexerats genom återleverans av deras befintliga signerade Stripe-händelser. Inga nya betalningar, kundmejl eller svarsimporter ingick. Befintlig webhook täcker redan asynkrona betalningar; destination och händelseprenumeration ändrades inte.

Aktuell publiceringscommit och slutkontroller dokumenteras i leveransrapporten. Följande ordning gäller också för en framtida ny installation; kör inte om redan genomförda migreringar.

## Avgränsning

Alla 15 produkter i den befintliga Supabase-funktionen `customer-tests`. Ingen ny tjänst, funktion eller betalprodukt. Befintliga äldre AuDHD- och autism-recoveryflöden lämnas orörda. Inga nya samtycken, ingen automatisk kontosparning, inga ändringar av checkout eller analyslogik.

Äldre recovery är produktbunden; den kan inte användas oförändrad för nya testförsök. En liten tabell är nödvändig för indexering av köpmejl, atomisk engångsförbrukning och beständig utskicksbegränsning. En allmän mejladressmatchning returnerar aldrig ett resultat eller åtkomstbevis.

## Flöde

1. Befintlig signerad Stripe-webhook verifierar och indexerar en betald Checkout-session mot dess befintliga testförsök. Full befintlig Stripe-verifiering används. Endast nycklad hash av köpmejlen lagras i registret, inga svar eller rapporter.
2. Kunden anger köpmejlen under ”Hitta din köpta analys” på Mina sidor. Det är ingen inloggning och skapar inget konto. Svaret avslöjar inte om adressen finns.
3. Servern verifierar åter betalning, produkt, återbetalning och raderingsjournal. Länken skickas enbart till adressen från den verifierade Stripe-sessionen via befintliga Resend. Inga svar eller produktnamn i mejlet.
4. Fragmentlänken öppnas i valfri webbläsare. Fragmentet rensas; kunden trycker ”Öppna min analys”. GET och mejlskannrar kan inte förbruka länken.
5. Servern verifierar allt igen och byter atomiskt endast testförsökets webbläsarbevis. Token förbrukas en gång; inget konto tilldelas. Befintlig säkrad gästvisning öppnar rätt analys.

## Säkerhet och lagring

- Samma originaldatum för testförsökets utgång, högst sju dagar. Länkens giltighet är högst 15 minuter och aldrig längre än underlagets giltighet.
- RLS på; inga klienträttigheter till tabellen. Token lagras endast som hash. Nycklad mejlhash använder befintlig krypteringsnyckel med separat ändamålsprefix.
- Redan kontokopplade, raderade, återbetalade, utgångna eller ombindna försök nekas. Extern raderingsjournal kontrolleras även när en äldre backup fortfarande innehåller underlag.
- Högst tre utskick per köp och timme, minst en minut mellan försök. En fortfarande giltig länk ersätts inte av en ny begäran. Högst fem kvalificerade köp behandlas per begäran.
- Ett uttryckligt leveransavslag återkallar bara just det utskickets token. Vid tvetydig timeout behålls token tills dess korta giltighet löper ut. Fel loggas utan adresser, token, ID eller svar.
- Registerraden gallras med befintlig gästrensning genom `ON DELETE CASCADE`. Ingen förlängning av svarslagring. Vid databasåterställning måste samtliga väntande recovery-token ogiltigförklaras innan restore-karantänen öppnas; befintlig extern journal/reconcile ska fortfarande köras.

## Kontrollerad driftsättningsordning

1. Granska/kör endast nya `202610310001_test_guest_recovery.sql` enligt ordinarie backup/preflight. Den genomförda produktionsmigreringen ska inte köras igen.
2. Kontrollera befintliga `RESEND_API_KEY` och verifierad avsändare `AUDHD_RECOVERY_EMAIL_FROM` i Supabase Edge Secrets. Återanvänd befintliga värden; skriv aldrig ut dem. Produktionskonfigurationen har inte ändrats eller verifierats i detta uppdrag.
3. Publicera samma befintliga Edge-funktion och webbkompletteringen med `TEST_GUEST_RECOVERY_ENABLED` avstängd. Kontrollera att befintlig Stripe-destination levererar både `checkout.session.completed` och `checkout.session.async_payment_succeeded`. Eventuell ändring av händelseprenumeration kräver separat godkännande.
4. För redan betalda nya gästköp med kvarvarande sjudagarsunderlag: återleverera deras befintliga signerade, betalda Checkout-händelser kontrollerat till samma mottagare efter aktivering. Detta bygger endast recovery-indexet; inga svar importeras och inga nya köp skapas. Omgående nya köp indexeras via ordinarie webhook.
5. Testa leverans till ägarens testadress, kontooberoende återöppning och engångsförbrukning med särskilt godkända prov. Varken riktiga mejl eller betalningar gjordes i detta uppdrag.
6. Rollback: stäng enbart `TEST_GUEST_RECOVERY_ENABLED`. Gamla gästbevis, kontoåtkomst och betalningar fortsätter fungera. Rulla inte tillbaka redan ersatta bevis eller återuppliva förbrukade token.

## Föreslagen komplettering av integritetsinformationen

”Du kan begära en engångslänk till den mejladress som hör till ditt verifierade köp för att återöppna din analys utan konto. Länken gäller i högst 15 minuter och kan aldrig förlänga analysens ursprungliga sjudagarsperiod. Vi sparar tillfälliga tekniska uppgifter för att verifiera och begränsa återställningar; de tas bort med gästunderlaget.”

Texten ingår i integritetssidan i denna release. Den ändrar inte köpsamtycket eller det separata frivilliga kontosamtycket.
