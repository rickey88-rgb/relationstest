# AuDHD: support för tidigare betalande kunder

Detta dokument gäller köp som gjordes via den äldre statiska Stripe Payment Linken, innan serverstyrd AuDHD Checkout började lagra krypterade testförsök.

## Grundregel

Kundens webbläsare, `?paid=true`, localStorage och ett kvitto är aldrig betalningsbevis. De kan bara hjälpa support att hitta ett köp. Support får inte skapa eller förlänga v1-HMAC-länkar efter release.

Det tidigare lokala v1-utfärdarskriptet är borttaget. Den enda supportvägen för en ny länk är Recovery v2:s behörighetsskyddade issue-route, som först verifierar Stripe Checkout Session server-side.

## Säker handläggning

1. Be kunden om ungefärlig köptid och e-postadressen som användes hos Stripe. Ett kvitto kan bifogas som ledtråd.
2. Leta upp Checkout Session i Stripe. Shadow-ledgern får användas för sökning, men Stripe är sanningskällan.
3. Verifiera server-side att sessionen är `cs_live`, slutförd, betald, avser en historiskt tillåten `audhd_test` Price-ID och inte är helt eller delvis återbetald. Utfärda inte access vid relevant tvist.
4. Utfärda endast Recovery v2 med den verifierade Checkout Session-ID:n. Den ger en engångslänk och en kort databaskontrollerad browser-cookie.
5. Om kundens 48+6 lokala svar finns kvar visas den ursprungliga analysen. Saknas svaren kan analysen inte återskapas; kunden får i stället göra testet igen utan ny betalning.

## v1-kompatibilitet under övergången

Redan utfärdade, korrekt signerade v1-HMAC-länkar och v1-cookies accepteras endast till sina egna signerade utgångstider. v1 använder `rv_audhd_recovery`; v2 använder `rv_audhd_recovery_v2`. En v2-inlösen skriver därför inte över en äldre v1-cookie.

En v1-länk som löses in efter release får endast en cookie som löper ut när den redan signerade länken löper ut. Den förlänger inte åtkomsten. När den längsta tidigare v1-cookieperioden har löpt ut kan kompatibilitetsbryggan tas bort efter en separat granskning.

## Produktkarta

Behåll samtliga historiska legitima AuDHD Price-ID:n under `audhd_test` i `STRIPE_PAYMENT_PRODUCT_MAP_JSON` så länge de ska berättiga till support-recovery. Lägg inte till ett Price-ID enbart på grund av ett kundkvitto.
