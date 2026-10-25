# Supabase Auth – staging- och produktionsinställningar

Den här första etappen är frivillig inloggning till `/mina-sidor`. Den påverkar inte Stripe, tester, recovery, böcker eller GA4.

## 1. Miljövariabler

Lägg in dessa i Vercel för respektive miljö, utan `NEXT_PUBLIC_` på något annat än de två första:

- `NEXT_PUBLIC_SUPABASE_URL`: projektets HTTPS-URL från Supabase.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: projektets publishable/anon key.
- `AUTH_SITE_URL`: den exakta webbplatsorigin som kör miljön, exempelvis `https://www.relationsvarning.se` eller stagingorigin. Ingen sökväg eller avslutande snedstreck.

Publishable key får exponeras till webbläsaren. Lägg **inte** in service-role-nyckel, databasanslutning eller Resend-nyckel i klientvariabler.

## 2. Supabase Dashboard: URL Configuration

I **Authentication → URL Configuration**:

- Site URL i produktion: `https://www.relationsvarning.se`
- Redirect URLs:
  - `https://www.relationsvarning.se/auth/confirm`
  - stagingmiljöns exakta `https://…/auth/confirm`
  - `http://localhost:3000/auth/confirm`

Lägg inte till breda wildcard-redirects.

## 3. Supabase Dashboard: Email provider och Magic Link

I **Authentication → Providers → Email**:

- Aktivera Email.
- Behåll bekräftelse av e-post aktiv.
- Tillåt nya användare; `signInWithOtp` skapar då en Auth-användare vid första inloggningen.
- Behåll kort livslängd och rate limiting för Magic Links. Första produktionsprovet ska använda Supabases standard på högst en timme och minst 60 sekunder mellan nya länkar.

I **Authentication → Email Templates** ändrar du både **Confirm signup** och **Magic Link** så att de skickar token-hash till den fasta callbacken. En ny adress kan få Confirm signup-mallen medan en befintlig användare får Magic Link-mallen. Använd `RedirectTo`, inte `SiteURL`, så att samma kod fungerar för staging och produktion:

```html
<a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email">Logga in till Mina sidor</a>
```

`RedirectTo` sätts server-side till den allowlistade `/auth/confirm`-adressen. Token-hash-callbacken används i stället för en browserbunden PKCE-kodväxling. Det gör att den nya webbläsarkontext som öppnar mejlet kan etablera sin egen säkra session. Callbackens GET-sida visar först en knapp; endast knappens POST verifierar länken, så automatiska mejlskannrar och previews inte förbrukar den.

## 4. Supabase Dashboard: Resend SMTP

I **Project Settings → Authentication → SMTP Settings** aktiverar du Custom SMTP:

- Host: `smtp.resend.com`
- Port: `465`
- Username: `resend`
- Password: en Resend API key med minsta nödvändiga e-postbehörighet
- Sender: en verifierad Relationsvarning-avsändaradress

Spara Resend-nyckeln endast i Supabase SMTP-konfigurationen. Återanvändning av den befintliga nyckeln är möjlig, men en separat begränsad nyckel för Auth rekommenderas.

## 5. Abuse protection

Förbered vid behov Cloudflare Turnstile eller hCaptcha i **Authentication → Settings → Bot and Abuse Protection**, men lämna CAPTCHA-växeln avstängd. Innan den kan aktiveras i produktion måste dess klientkomponent läggas till i inloggningsformuläret och token skickas vidare till `signInWithOtp` i en uppföljande ändring.

## 6. Manuell testmatris före publicering

1. Ny adress och befintlig adress: samma neutrala kvittens i formuläret.
2. Öppna Magic Link i samma browser: landar på `/mina-sidor`.
3. Öppna samma länk i mobil eller annan browser: landar på `/mina-sidor`.
4. Öppna samma länk igen: visas begripligt fel och nytt försök kan begäras.
5. Begär två länkar: den äldre får inte ge otydlig eller delad session.
6. Logga ut och kontrollera att `/mina-sidor` skickar tillbaka till `/logga-in`.
7. Kontrollera responsheaders för `/mina-sidor`: `Cache-Control: private, no-store`.
8. Kör en AuDHD-, autism- och bokköpsresa utan inloggning; utfallet ska vara oförändrat.
