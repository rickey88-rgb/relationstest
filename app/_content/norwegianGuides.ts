import { norwegian } from "./market";

export const norwegianSources = {
  adhd: ["Helsenorge om ADHD", "https://www.helsenorge.no/sykdom/utviklingsforstyrrelser/adhd/"],
  autism: ["Helsenorge om autisme", "https://www.helsenorge.no/sykdom/utviklingsforstyrrelser/autisme/"],
  assessment: ["Helsedirektoratets retningslinje for ADHD-utredning", "https://www.helsedirektoratet.no/retningslinjer/adhd/henvisning-utredning-og-tilbakemelding"],
  masking: ["Hull og kolleger (2017), studie av sosial maskering", "https://pubmed.ncbi.nlm.nih.gov/28527095/"],
} as const;

type Guide = {
  title: string;
  h1: string;
  description: string;
  sections: readonly (readonly [string, string])[];
  related: readonly string[];
  sources: readonly (keyof typeof norwegianSources)[];
};

export const norwegianGuides: Record<string, Guide> = {
  audhd: {
    title: "Hva er AuDHD? ADHD og autisme sammen",
    h1: "Hva er AuDHD?",
    description: "AuDHD er et uformelt navn på samtidig ADHD og autisme. Se hva begrepet beskriver og hvorfor behov kan trekke i ulike retninger.",
    sections: [
      ["Hva betyr ordet?", "AuDHD brukes som en felles betegnelse når en person har både ADHD og autisme. I helsevesenet vurderes ADHD og autisme hver for seg. Ordet kan være praktisk når du vil forklare hvordan kombinasjonen oppleves i samme hverdag."],
      ["Når to behov er til stede samtidig", "Du kan trives med en fast arbeidsmåte og likevel miste konsentrasjonen når oppgaven blir ensformig. En plan med fast start og flere mulige oppgaver kan da gjøre det lettere å komme i gang. Det er et eksempel på hvordan omgivelsene kan tilpasses ulike behov samtidig."],
      ["Hva kan du gjøre med den innsikten?", "Velg én situasjon du kjenner igjen. Skriv ned hva du ønsket å få til, hva situasjonen krevde, og hva som hjalp. Hvis du vil utforske flere områder, kan selvtesten hjelpe deg å samle slike observasjoner før en samtale med fastlegen."],
    ],
    related: ["/no/adhd-og-autisme", "/no/audhd-symptomer", "/no/audhd-voksne"],
    sources: ["adhd", "autism", "assessment"],
  },
  "audhd-symptomer": {
    title: "AuDHD-symptomer hos voksne | Kjennetegn i hverdagen",
    h1: "AuDHD-symptomer og kjennetegn hos voksne",
    description: "Eksempler på oppmerksomhet, uro, sansefølsomhet og behov for forutsigbarhet når ADHD og autisme opptrer sammen.",
    sections: [
      ["Oppmerksomhet og igangsetting", "ADHD kan gi vansker med å holde tråden, organisere en oppgave eller regulere uro og impulser. En oppgave som engasjerer deg kan være lettere å holde fast ved enn en oppgave med uklare steg."],
      ["Sanseinntrykk, kommunikasjon og endringer", "Ved autisme kan blant annet sosial kommunikasjon, behov for forutsigbarhet og uvanlig sterke eller svake reaksjoner på sanseinntrykk være relevante. En konkret beskrivelse, for eksempel at du mister tråden når flere snakker samtidig, gir mer informasjon enn ordet «konsentrasjonsvansker» alene."],
      ["Se etter mønster over tid", "Noter hvor ofte noe skjer, når det har vært lettere, hva det koster deg, og om du kjenner det igjen fra flere deler av livet. Søvn, stress og andre vansker kan også påvirke hvordan du fungerer. Fastlegen kan hjelpe deg med å vurdere hva som bør undersøkes."],
    ],
    related: ["/no/audhd", "/no/audhd-maskering", "/no/audhd-utredning"],
    sources: ["adhd", "autism", "assessment"],
  },
  "audhd-kvinner": {
    title: "AuDHD hos kvinner | Maskering og sen oppdagelse",
    h1: "AuDHD hos kvinner",
    description: "Hvorfor ADHD- og autismerelaterte vansker kan bli oppdaget sent hos kvinner, og hva som er nyttig å beskrive for fastlegen.",
    sections: [
      ["Det andre ser, og arbeidet bak", "En velforberedt presentasjon kan kreve flere kvelder med øving. Et sosialt måltid kan gå fint og likevel kreve en stille dag etterpå. For å forstå støttebehovet er det relevant å beskrive både hva du får til, og hvor mye tid og energi det tar."],
      ["Hvorfor noen blir oppdaget sent", "Helsenorge beskriver at ADHD ofte oppdages senere hos jenter, og at utredningsverktøy for autisme har vært bedre innrettet mot å oppdage autisme hos gutter. Studier av autistiske voksne beskriver maskering hos personer av flere kjønn. Strategiene varierer også fra person til person."],
      ["Skriv ned konkrete eksempler", "Prøv å finne ett eksempel fra skolealder og ett fra dagens hverdag. Beskriv situasjonen, hvilken strategi du brukte, hvor mye den krevde, og hva som skjedde når du manglet støtte. Ta med eksemplene hvis du vil drøfte en henvisning med fastlegen."],
    ],
    related: ["/no/audhd-maskering", "/no/audhd-utredning", norwegian.book],
    sources: ["adhd", "autism", "masking"],
  },
  "audhd-voksne": {
    title: "AuDHD hos voksne | Jobb, rutiner og restitusjon",
    h1: "AuDHD hos voksne i hverdagen",
    description: "Konkrete eksempler på hvordan voksne kan tilpasse jobb, rutiner og sosialt liv når både ADHD og autisme påvirker hverdagen.",
    sections: [
      ["Når kravene endrer seg", "Det kan bli vanskeligere å holde oversikt når en jobb blir mindre forutsigbar eller du får flere oppgaver hjemme. Sorter kravene før du prøver å løse alt. Er det mengden arbeid, avbrudd, uklare beskjeder eller støyen som tapper mest energi?"],
      ["Prøv én justering av gangen", "Be om ukens prioriteringer skriftlig, eller sett av et kort tidsrom til fordypning uten avbrudd. Velg på forhånd hva du vil se etter, for eksempel om færre oppgaver blir liggende uferdige. En liten justering er lettere å vurdere når du kjenner belastningen den skal løse."],
      ["Lag en plan som tåler ulike dager", "En enkel grunnplan kan ha ett fast holdepunkt og et par valg. På en krevende dag kan du kutte mengden og beholde rekkefølgen. Kapitlene om arbeidsliv og dagsformer i Hjernen i kryssild gir flere øvelser du kan prøve."],
    ],
    related: ["/no/audhd-symptomer", "/no/audhd-maskering", norwegian.book],
    sources: ["adhd", "autism"],
  },
  "adhd-og-autisme": {
    title: "ADHD og autisme samtidig | Overlapp og forskjeller",
    h1: "ADHD og autisme samtidig",
    description: "Se hvordan ADHD og autisme kan påvirke den samme situasjonen, og hvorfor en bred utredning kan være viktig.",
    sections: [
      ["Det samme kan se likt ut utenfra", "En person kan forlate et møte fordi lydene gjør det vanskelig å følge samtalen. En annen forlater det fordi kroppen trenger bevegelse. Begge kan oppleve begge deler. Spør hva som skjedde rett før, og hva som hjalp etterpå."],
      ["Hvilke rammer hjelper?", "I et møte kan det være nyttig med både en kort agenda og mulighet for en bevegelsespause. Den første gjør innholdet mer forutsigbart. Den andre gjør det lettere å regulere uro. Prøv én ramme av gangen hvis du vil se hvilken som hjelper mest."],
      ["Hvordan ser en fagperson på overlapp?", "En utredning tar for seg utvikling over tid, fungering i ulike miljøer, andre mulige forklaringer og samtidige tilstander. Det er særlig relevant å beskrive trekk som den første forklaringen bare delvis dekker."],
    ],
    related: ["/no/audhd", "/no/audhd-utredning", "/no/audhd-voksne"],
    sources: ["assessment", "adhd", "autism"],
  },
  "audhd-maskering": {
    title: "Maskering ved AuDHD | Strategier og energikostnad",
    h1: "Maskering ved AuDHD",
    description: "Hva maskering kan innebære når du har ADHD og autisme, hvordan den kan kjennes, og hvordan du kan legge merke til kostnaden.",
    sections: [
      ["Hvordan kan maskering se ut?", "Maskering kan innebære å øve på replikker, kopiere andres uttrykk eller holde tilbake bevegelser og reaksjoner. Noen gjør det bevisst. For andre har strategiene blitt automatiske. En studie av autistiske voksne beskrev både ønsket om å passe inn og utmattelse etter tilpasning."],
      ["Kartlegg ett møte", "Beskriv hva du gjorde før, under og etter møtet. Hvor lenge øvde du? Hva fulgte du aktivt med på? Når oppdaget du at du trengte en pause? Det kan gjøre det lettere å se om en kortere avtale eller roligere omgivelser vil hjelpe."],
      ["Velg trygge rammer for små endringer", "Du bestemmer selv når du vil fortelle om behovene dine. Du kan prøve å be om rammene du trenger, for eksempel en skriftlig agenda. I e-boka finner du øvelsen Maskeregnskapet for å utforske hvor mye ulike tilpasninger koster."],
    ],
    related: ["/no/audhd-kvinner", "/no/audhd-voksne", norwegian.book],
    sources: ["masking", "autism"],
  },
  "audhd-utredning": {
    title: "Utredning av ADHD og autisme hos voksne i Norge",
    h1: "Utredning av ADHD og autisme hos voksne",
    description: "Hva fastlegen trenger å vite, hvordan en henvisning kan foregå, og hva som vurderes ved utredning i Norge.",
    sections: [
      ["Begynn hos fastlegen", "Fortell hvilke vansker som preger hverdagen din og hva du håper å få avklart. Fastlegen kan vurdere henvisning til spesialisthelsetjenesten. Hvis du kjenner igjen trekk fra begge områder, fortell hvordan de virker sammen og hvor du fortsatt trenger hjelp."],
      ["Forbered en kort oversikt", "Skriv ned når vanskene først var merkbare, hva som skjedde på skolen, hvordan de påvirker jobb, studier eller relasjoner i dag, og hvilken støtte du allerede har prøvd. Gamle skoleopplysninger eller informasjon fra noen som kjente deg tidlig kan bidra når det passer og du ønsker det."],
      ["Hva kan utredningen omfatte?", "Spesialisten vurderer symptomer, utviklingshistorie og fungering i flere miljøer. Samtaler, skjemaer og andre opplysninger kan inngå i vurderingen. Du kan bruke en selvtest som støtte for å huske eksempler i samtalen."],
    ],
    related: ["/no/adhd-og-autisme", "/no/audhd-symptomer", "/no/audhd-maskering"],
    sources: ["assessment", "adhd", "autism"],
  },
};

export const guideLabel = (path: string) => norwegianGuides[path.split("/").at(-1) ?? ""]?.h1 ?? "Hjernen i kryssild";
