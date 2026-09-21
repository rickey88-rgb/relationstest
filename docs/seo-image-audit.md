# SEO-bilder: audit och publiceringsplan

## Nuläge

- Projektet har inga publicerade artikelbilder eller sociala delningsbilder. `public/` innehåller därför ingen katalog för SEO-bilder.
- Love bombing och silent treatment har sidunik Open Graph-metadata, men ingen `images`-post. Övriga granskade guider har i huvudsak titel, beskrivning och canonical.
- Befintligt `Article`-schema saknar `image`. Den delade `SeoClusterGuide`-mallen skapar Article-, Breadcrumb- och ibland FAQ-schema, men inget bildobjekt.
- Inga konkurrerande artikelbilder eller dubbla bilddefinitioner finns i nuläget.
- `next-sitemap` listar sidor. En separat image sitemap ger ingen nytta innan faktiska bilder publiceras; crawlbara bilder i HTML och Article-schema är första prioritet.

## Prioritering

Det typade registret i `app/_seo/articleImages.ts` är den detaljerade arbetslistan. Ordningen bygger på tydlig informationsintention, ämnets visuella förklaringsvärde, koppling till test eller nästa steg samt sannolik nytta i bildsök och som resultat-thumbnail.

1. Gaslighting
2. Psykisk misshandel i relation
3. Kontrollerande relation
4. Love bombing
5. Traumabindning
6. Silent treatment
7. Narcissist i en relation
8. Manipulativ partner
9. Psykiskt våld
10. Våld i nära relation
11. Anknytning
12. Medberoende i relation
13. ADHD-symtom hos vuxna
14. Autismsymtom hos vuxna
15. ADHD och relationer
16. Maskering vid autism
17. Destruktivt förhållande
18. Svartsjuk partner

Varje registerpost innehåller bildkoncept, bildrubrik, alt-text, filnamn, placering, bildförhållande och beslut om OG-användning. De första 16 rekommenderas som både artikelbild och OG-bild; de sista två bör först utvärderas som artikelbilder.

## Mobile-first bildmodell

- Standard för artikelbilden: 1200 × 1500 px (4:5). Kompositionen utgår från 360–430 px bred mobilskärm och byggs vertikalt uppifrån och ned.
- OG-export: en separat 1200 × 630 px-version när registerposten har `useAsOpenGraph: true`. Artikelbilden ska inte beskäras automatiskt till OG-format. Den breda exporten behöver en egen, förenklad komposition med större rubrik och färre detaljer.
- Format: WebP som publiceringsformat. Behåll ett redigerbart källoriginal utanför `public/`. Next Image kan leverera AVIF/WebP-varianter till stödjande webbläsare.
- Uttryck: varmvit eller ljusgrå botten, mörk grafittext, dämpad grön accent, tunna linjer och hög kontrast. Diagrammen ska fungera utan porträtt eller dramatiska miljöbilder.
- Varje artikelbild använder stora textgrader, tydlig hierarki, mycket luft och högst fyra till fem huvudsteg eller informationsblock. Breda horisontella flöden, små etiketter och detaljer som kräver zoom ska undvikas.
- Text i bilden ska hållas kort. Alt-texten beskriver bildens informationsinnehåll och upprepar inte artikelrubriken mekaniskt. Samma sakuppgifter ska även finnas i artikelns HTML-text.

## Slutlig pilotspecifikation: gaslighting

### Artikelbild

- Format: 4:5, 1200 × 1500 px.
- Rubrik: **Gaslighting – hur mönstret kan utvecklas**.
- Struktur: ett vertikalt flöde uppifrån och ned med fem stora, luftiga block:
  1. Något händer
  2. Händelsen förnekas eller förvrängs
  3. Du börjar tvivla på ditt eget minne
  4. Du söker mer bekräftelse
  5. Den andres version får större makt
- Pilar eller en lugn sammanbindande linje får visa riktningen. Varje steg ska vara läsbart utan zoom på 360 px bredd.
- Filnamn: `gaslighting-hur-monstret-kan-utvecklas.webp`.

### Separat OG-export

- Format: 1200 × 630 px.
- Filnamn: `gaslighting-hur-monstret-kan-utvecklas-og.webp`.
- Använd samma grafit-, varmvit- och dämpat gröna identitet som artikelbilden.
- Rubriken görs större. Innehållet förenklas till högst tre korta visuella stödpunkter kring förnekande, självtvivel och förskjuten makt.
- All viktig text hålls inom en central säker yta för små previews. OG-exporten ska vara en egen layout och inte en beskuren artikelbild.

## Publiceringsflöde

1. Producera och granska en pilot för `/gaslighting-relation`.
2. Lägg artikelversionen och den separata OG-versionen i `public/seo-images/` med versionsstabila, beskrivande filnamn.
3. Sätt artikelns `sourcePath` och OG-exportens separata `ogImage.sourcePath` först när respektive fil finns. Hjälpfunktionerna lämnar metadata och schema tomma dessförinnan, vilket förhindrar 404-länkar och att en 4:5-bild används felaktigt i social preview.
4. Rendera `ArticleImage` på den rekommenderade platsen. Bilder under sidans inledning ska behålla standardvärdet `priority={false}` och lazy loading.
5. Slå ihop bilddata med sidans befintliga Open Graph-metadata, lägg till Twitter-bilden och använd `getArticleImageSchema()` i Article JSON-LD.
6. Kontrollera den genererade HTML-källan, bildens statuskod och mobil layout innan nästa grupp publiceras.

## Prestanda och risker

- Bildkomponenten anger alltid bredd och höjd, vilket reserverar yta och skyddar CLS.
- `sizes` begränsar den responsiva bildens begärda storlek. Standard är lazy loading; `priority` ska bara användas om en framtida bild faktiskt blir sidans LCP-element ovanför folden.
- `/seo-images/` får lång cachetid. Publicerade filer måste därför få ett nytt filnamn om innehållet ändras.
- Infografik med mycket inbakad text blir svårläst på mobil. Därför begränsas varje artikelbild till fyra eller fem stora block, medan full förklaring finns kvar i HTML.
- Google väljer själv om en thumbnail visas. Korrekt metadata och schema gör bilden valbar men garanterar inte visning.

## Nästa steg

Granska pilotens uttryck vid 360, 390 och 430 px samt den separata OG-exporten som liten preview. Efter godkännande produceras bilder i grupper om tre till fem, med de högst prioriterade sidorna först. När minst flera unika bilder är publicerade kan en image sitemap utvärderas mot faktisk indexering i Search Console; den bör inte skapas med planerade eller identiska placeholder-bilder.
