> Historisk leveransbeskrivning. Aktuell frågebank och analys är nu PERSONA v2; se [persona-v2.md](persona-v2.md).

# PERSONA – etapp 2: lokal visuell testupplevelse

## Omfattning

Nya publika vägar: `/persona` och `/persona/test`. Ingen Stripe-koppling,
produktregistrering, kontoöverföring, push eller deploy ingår.
Etapp 1:s frågebank, regler, rapporttexter, versionsmanifest och befintliga tester
är oförändrade. Inga andra produkter eller betalflöden ändras.

## Design och navigation

Lokal CSS-modul ger marinblå `#101626`, guld `#C9A86B`, serifrubriker,
sans-serif för svar och en dekorativ SVG-fingeravtrycksikon. Inga externa
typsnitt, bildtjänster eller nya paket behövs. Landningssidan presenterar
PERSONA – Vem är du egentligen? och CTA Upptäck din personlighet.

PersonaShell ger egen navigering och informationsfot. Rotlayoutens befintliga
header/footer döljs genom CSS som endast matchar när PERSONA-ytan finns i DOM.
Rotlayouten, globala stilar och andra produkter ändras inte. Befintliga
statistikinställningar går fortfarande att öppna från PERSONA:s informationsfot.
Inga PERSONA-svar skickas till statistiksystemet av den nya koden.

Testet har fyra kapitelintroduktioner och 34 fasta plus 6 adaptiva frågor.
Scenarier och strukturerade frågor har olika typografisk presentation.
Svar kräver ett aktivt val. Valet sparas och markeras direkt; efter 350 ms
går flödet vidare automatiskt. Under de sista 120 ms tonas frågan ut och nästa
vy tonas in under 180 ms. Alternativ och manuell framflyttning låses synkront
under väntan och övergången, så att snabba klick inte kan hoppa över steg.
Tillbaka kan avbryta den väntande timern. Gamla timer-callbacks och klick från
föregående vy ignoreras genom generations- och stegkontroll. Alla timers
städas vid avmontering och när användaren öppnar bekräftelsen för omstart.
Redan sparade svar kan fortsättas med Nästa fråga eller väljas igen för auto-advance.
Användaren informeras om den automatiska framflyttningen före svarsalternativen.
Reduced-motion tar bort animationerna men behåller svarsfördröjningen på 350 ms.
Det finns native radio-grupper, tangentbordsfokus, progressindikator,
tillbaka-knapp, granskning av svar och bekräftad radering/omstart.
Layouten har mobilregler även för 320–360 px. Animationer tas bort vid
prefers-reduced-motion. DOM-fokus flyttas till rubriken vid stegbyte.

### Stabil testyta och scroll

Frågebyten kör inte längre window.scrollTo till sidans början. Fokus och lokal
läsposition hanteras före målning med useLayoutEffect och positionStep:
rubriken får focus({ preventScroll: true }) och bara frågans respektive svarens
egna läsytor återställs till scrollTop 0.

Vid minst 960 px bredd och 600 px höjd använder kapitel- och frågeflödet en
100dvh-ram. Progress och navigering ligger utanför innehållens variabla höjder.
Frågetext och svar ligger i två stabila kolumner med minmax(0, 1fr), lokala
overflow-y:auto-ytor och reserverad scrollbarbredd. Svarens navigering är en
separat rad som inte rullar bort med svarsalternativen. Meddelandefält och
omstartsplats reserveras så att återupptagningsmeddelanden och första svaret
inte flyttar korten. In- och utgång är rena opacitetsövergångar, utan translateY.
Reglerna gäller endast PERSONA:s pågående resa, inte landningssidan, förhands-
visningen eller andra produkter.

Mobil och korta fönster behåller vanligt dokumentflöde utan fast höjd eller
klippning av innehållet. Progress och en extra Tillbaka-knapp ligger i ett
sticky huvud; navigering finns även efter svarsalternativen. Om frågestarten
är utanför den synliga ytan efter ett stegbyte justeras endast läspositionen
till stegets början under det sticky huvudet. En redan synlig frågestart
orsakar ingen dokumentscroll. Det är en avsiktlig mobilåterställning, inte
en global scroll till sidans topp. Förhandsvisningen använder vanligt sidflöde.

Automatiska tester prövar positioneringsregler och responsiva CSS-deklarationer
för 1366×768, 1920×1080 och 390×844. De är inte en pixel- eller skärmbildskontroll.

Kapitel fyra använder motorns selectAdaptive. Inga urvalsregler kopieras till UI.
Om reservfrågor används säger introduktionen det i stället för att påstå att ett
starkt individuellt mönster identifierats.

## Lokal lagring

`relationsvarning_persona_flow_v1` innehåller versionsetiketter, delvis besvarade
grundfrågor, adaptiva svar efter fråge-ID, position och vy. Saknat svar är null;
UNKNOWN=5 är ett medvetet Svårt att bedöma-svar. Inga poäng, rapporttexter,
köpbevis, upplåsningsflaggor eller förhandsvisningar sparas.

Sparat innehåll valideras som opålitlig indata. Felaktiga eller främmande versioner
återställs inte. Adaptiv ordning återskapas av motorn; sparad ordning betros inte.
När grundsvar ändras behålls följdsvar endast för de fråge-ID:n som fortfarande
ingår. Inaktuella svar tas bort och nya frågor blir obesvarade.

En sessionsbutik med useSyncExternalStore initierar lokal lagring först efter
klientprenumerationen. SSR läser inga webbläsar-API:er. Lagringsfel lämnar flödet
användbart i minnet och visar att återupptagning inte kan garanteras.
Omstart tar bara bort PERSONA:s egen nyckel; andra produkter berörs inte.

## Gratisinsikt och låst premium

Serverfunktionen getPersonaPreview validerar en komplett versionsbunden
inlämning och anropar etapp 1:s buildPersonaReport. Endast tre fält returneras:
kind, text och evidenceCount. Texten är motorns enda gratisfynd. Ingen
premiumsektion, profilpoäng eller fullständig rapport skickas till klienten.

Svaren används tillfälligt på servern för beräkningen; den nya koden lagrar dem
inte där och gör inga databas- eller leverantörsanrop. UI beskriver både lokal
lagring och serverberäkningen. Begränsat underlag märks ut, och förhandsvisning
utan ett personligt fynd markeras som information om underlaget.
Nätverksfel ger möjlighet att försöka igen eller granska lokalt sparade svar.

Premiumytan visar enbart åtta allmänna avsnittsrubriker och planerat pris 79 kr.
Knappen är avstängd och köp anges som otillgängligt. Det finns ingen
paid=true-tolkning, betalningslänk, återställning av köprätt eller rapportvy som
kan öppnas med en lokal flagga. En framtida köp-/kontokoppling är en egen etapp.

## Verifiering

```powershell
node scripts/test-persona-stage2.cjs
```

Köraren utför full projekt-TypeScript utan inkrementella skrivningar, den
oförändrade etapp 1-sviten, nya flödes-/renderingstester och ESLint med
--max-warnings 0 för hela PERSONA och båda körskripten.
Barnprocesserna får inga applikationsnycklar. Node-testerna blockerar nätverk.

De nya testerna täcker fullständiga omgångar med alla tre godkända profiler,
kapitelgränser, svarskrav, neutral/osäker, tillbaka, ändrade adaptiva frågor,
versionsvalidering, manipulerad lagring, återupptagning, lagringsfel och radering.
De kontrollerar att gratisresponsen endast innehåller ett verkligt fynd och att
premium fortfarande är låst. React-rendering verifierar semantik, radiogrupper,
val, disabled-tillstånd, reservfrågetext och landningssidans innehåll.

Separat lokal Next.js-byggkontroll använder en isolerad PERSONA-fixture utan
miljöfiler och leverantörsrutter. Webbplatsens globala analytics-komponent ersätts
av en minimal fixture där; produktkoden ändras inte. Kontrollen verifierar
kompilering av de nya rutterna, CSS-moduler och serverfunktionens klientgräns.
Det är inte ett fullständigt produktionsbygge av hela webbplatsen.

## Kvarvarande visuell granskning

Webbläsarverktygets behörighetskontroll nekade öppning av den lokala
förhandsvisningen. Ingen annan webbläsare, CDP-väg eller annan kringgång användes.
Responsivitet och utseende är därför inte visuellt verifierade i webbläsare.
Efter godkänd lokal webbläsaråtkomst bör 320/390 px och desktop granskas, inklusive
långt scenario, kapitelövergång, omladdning, slutinsikt och låst premium.

## Desktoprevision 2026-11-07

Ersätter tidigare sträckta tvåkolumnspaneler med en kompakt, toppställd
läskolumn (max 880 px). Desktopfrågans rubrik är 26–32 px. Svarens minsta
höjd är 48 px; två korta textrader ryms normalt inom cirka 56 px och längre
svar får växa. Kompaktare masthead (48 px), progress/kapitelrad och avstånd.
Extra höjdanpassning vid 600–800 px skärmhöjd.

Vid desktop >=960 x >=600 används en viewportbaserad ram. Den nycklade
frågevyn får naturlig overflow vid långa dilemman; själva fråge- och
svarskorten fyller bara innehållets höjd. Tillbaka och progress finns utanför
scrollområdet. Mobil och kortare fönster fortsätter i dokumentets normala
flöde. Ingen text trunkeras och inga svar har en maximal höjd.

viewport.ts flyttar enbart fokus med preventScroll. Alla explicita scrollBy,
scrollTop-återställningar och geometriavläsningar har tagits bort. Flödet
har inga scrollkommandon. Auto-advance (350 ms), dubbelklicksskydd och
vald guldmarkering använder samma befintliga implementation.

Verifierat: 18 domäntester + 24 flödes-/SSR-/CSS-tester, projekt-TypeScript
och PERSONA-ESLint. CSS-testerna utvärderar regler för 1366x768, 1920x1080
och 390x844, men mäter inte faktiskt renderade element. Hela Next-applikationens
build passerar i en separat kopia utan miljöfiler eller leverantörsnycklar.
Endast LEGAL_RESPONSIBLE_NAME och LEGAL_BUSINESS_ADDRESS ges syntetiska
byggtestvärden; ett första försök utan dessa stoppades av befintlig juridiksida.

Visuell kontroll är fortfarande INTE genomförd: browser origin-access nekades
för http://127.0.0.1:3134 av sparad behörighet eller administrerad policy.
Ingen kringgång eller policyändring. Lokal server lämnas igång.

## Ny fristående frågevy 2026-11-07 (ersätter desktoprevisionen ovan)

PersonaJourney.tsx och PersonaQuestion.tsx är nya presentationskomponenter,
med egen persona-journey.module.css. PersonaFlow behåller session, adaptivitet,
analysanrop och timerkontroll. De äldre fråge-/svarsstilarna och samtliga gamla
journey-mediaregler är borttagna ur persona.module.css.

Testytan är max 960 px med kompakt varumärke, progress och aktiv kapitelrubrik.
Fråga och svar delar samma kort. Desktop: rubrik 28–32 px, scenario 17–18 px,
innehållsanpassade svarskort, fem självskattningssvar i en rad och liten
alternativ fortsättningsknapp. Mobil: en kolumn, naturlig dokumentscroll och
större manuell knapp. Den långa lagringstexten finns i öppningsbar information.

På desktop >=960 x >=600 låter body 100dvh och flexlayout statistikpanelens
verkliga höjd minska resterande utrymme. Header/footer tar auto-höjd och
frågeytan får minmax(0,1fr). Långa steg kan scrollas. Statistikpanelen är
routeavgränsat statisk i dokumentflödet, även på mobil. Ingen fixed/sticky
navigation eller footer i den nya frågevyn; inga imperativa scrollkommandon.
Kortare desktopfönster använder naturligt dokumentflöde.

Verifierat: 18/18 domäntester, 24/24 flödes-/SSR-/CSS-tester, projekt-TypeScript,
ESLint för hela PERSONA och full Next-build i separat nyckelfri kopia med
syntetisk juridisk testidentitet. Alla 52 bankfrågors fullständiga titlar,
prompter och svarsalternativ verifieras i den nya komponentens SSR.

Browser origin-access nekar fortsatt http://127.0.0.1:3134 även när fliken är
öppen. Ingen faktisk viewport-mätning, skärmbild eller visuell verifiering har
kunnat utföras. CSS-testerna väljer regler för 1366x768, 1920x1080, 390x844 och
1366x500; detta är inte bevis för att texten ryms i en riktig webbläsare.
