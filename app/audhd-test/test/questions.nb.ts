import { contextQuestions, questions, type Dimension } from "./questions";

const text: Record<Dimension, readonly string[]> = {
  A: [
    "Hvor ofte har du vanskelig for å komme i gang med noe selv om du både vil og trenger å gjøre det?",
    "Hvor ofte mister du tråden når en oppgave har flere trinn?",
    "Hvor ofte merker du at tankene har vandret mens du prøver å lytte eller konsentrere deg?",
    "Hvor ofte glemmer eller mister du ting du trenger i hverdagen?",
    "Hvor ofte undervurderer du hvor lang tid noe vil ta?",
    "Hvor ofte begynner du på noe nytt før du har gjort ferdig det du holdt på med?",
    "Hvor ofte glemmer du ting som faktisk er viktige for deg, som avtaler, ærender eller ting du har lovet å gjøre?",
    "Hvor ofte trenger du påminnelser, lister eller andre systemer for å holde orden på hverdagen?",
  ],
  B: [
    "Hvor ofte kjenner du en indre uro når du må sitte stille eller vente?",
    "Hvor ofte sier eller gjør du noe før du har rukket å tenke deg om?",
    "Hvor ofte søker du mer stimulering når noe går sakte eller føles ensformig?",
    "Hvor ofte tar du spontane valg som du i ettertid skulle ønske du hadde tenkt nøyere gjennom?",
    "Hvor ofte mister du interessen for noe når det slutter å være nytt eller spennende?",
    "Hvor ofte er det vanskelig å vente på tur når du allerede vet hva du vil si eller gjøre?",
  ],
  C: [
    "Hvor ofte er du usikker på hva som forventes av deg i en ny sosial situasjon?",
    "Hvor ofte må du bevisst tolke tonefall, ansiktsuttrykk eller kroppsspråk for å forstå hva noen mener?",
    "Hvor ofte oppdager du i ettertid at noen antydet noe du ikke fikk med deg der og da?",
    "Hvor ofte er det vanskelig å vite når du skal begynne å snakke, avslutte eller ta ordet i en samtale?",
    "Hvor ofte blir du sliten av å være sosial, også når du liker dem du er sammen med?",
    "Hvor ofte er det lettere for deg når folk sier akkurat hva de mener, i stedet for å antyde det?",
    "Hvor ofte går du gjennom et sosialt møte i etterkant for å forstå hvordan det gikk, eller om du gjorde noe galt?",
  ],
  D: [
    "Hvor ofte påvirker en uventet endring i planene deg mer enn du synes den burde?",
    "Hvor ofte vil du vite på forhånd hvordan en situasjon kommer til å foregå?",
    "Hvor ofte blir du så oppslukt av en interesse at du mister oversikten over tiden eller glemmer det som skjer rundt deg?",
    "Hvor ofte foretrekker du å gjøre ting på en kjent måte, selv når andre måter også ville fungert?",
    "Hvor ofte er det vanskelig å skifte til noe annet når du blir avbrutt midt i noe?",
    "Hvor ofte vender du tilbake til den samme maten, de samme aktivitetene, det samme innholdet eller de samme rutinene fordi det føles trygt eller riktig?",
    "Hvor ofte fortsetter en bestemt interesse eller et tema å oppta tankene dine, også når du gjør noe annet?",
  ],
  E: [
    "Hvor ofte blir du forstyrret av lyder som andre ser ut til å kunne ignorere?",
    "Hvor ofte påvirkes du av sterkt lys, mye bevegelse eller visuelt rotete omgivelser?",
    "Hvor ofte plages du merkbart av hvordan klær, materialer eller berøring kjennes mot kroppen?",
    "Hvor ofte reagerer du sterkt på lukt, smak, temperatur eller andre kroppslige sanseinntrykk?",
    "Hvor ofte blir steder med mange inntrykk på én gang så intense at du må gå eller trenger tid til å hente deg inn etterpå?",
  ],
  F: [
    "Hvor ofte øver du i hodet på hva du skal si før du møter andre?",
    "Hvor ofte observerer eller hermer du etter andre for å vite hvordan du selv skal oppføre deg sosialt?",
    "Hvor ofte holder du tilbake naturlige bevegelser, reaksjoner eller interesser for å unngå å skille deg ut?",
    "Hvor ofte virker du avslappet sammen med andre, samtidig som du tenker aktivt over hvordan du oppfører deg?",
    "Hvor ofte trenger du tid til å hente deg inn etter å ha prøvd lenge å fungere slik andre forventer?",
  ],
  G: [
    "Hvor ofte ønsker du deg faste rutiner, samtidig som du kjeder deg med dem eller har vanskelig for å følge dem?",
    "Hvor ofte oppsøker du nye inntrykk eller opplevelser, men blir overveldet når det blir for mye?",
    "Hvor ofte setter du pris på spontanitet når du selv tar initiativet, men blir stresset når andre plutselig endrer planen?",
    "Hvor ofte ønsker du orden og tydelige systemer, men har vanskelig for å holde systemene i gang selv?",
    "Hvor ofte ønsker en del av deg variasjon, mens en annen del vil at ting skal være forutsigbare?",
  ],
  H: [
    "Hvor ofte gjør slike vansker vanlige hverdagsoppgaver vesentlig mer krevende?",
    "Hvor ofte påvirker de hvordan du fungerer i jobb, studier eller andre krevende oppgaver?",
    "Hvor ofte fører de til vansker eller misforståelser i forholdet til andre mennesker?",
    "Hvor ofte er det vanskelig å regulere følelsene dine når du er overstimulert, frustrert eller overbelastet?",
    "Hvor ofte føler du deg uvanlig utmattet av å få hverdagen til å fungere?",
  ],
};

export const questionsNb = questions.map(question => ({
  ...question,
  text: text[question.dimension][Number(question.id.slice(1)) - 1],
}));

const impact = ["Ikke i det hele tatt", "Litt", "En del", "Mye", "Svært mye"];
const contextNb = [
  ["Når du tenker tilbake på barndommen, var mange av disse trekkene eller vanskene til stede allerede da?", ["Nei, det kjenner jeg ikke igjen", "I liten grad", "Delvis", "Ja, tydelig", "Jeg er usikker"]],
  ["Merker du lignende mønstre på flere områder i livet, for eksempel hjemme, sosialt og på jobb eller i studiene?", ["Nei, først og fremst i én situasjon", "I noen situasjoner", "På flere områder i livet", "På nesten alle viktige områder i livet", "Jeg er usikker"]],
  ["Hvor mye påvirker vanskene jobb, studier eller andre krav?", impact],
  ["Hvor mye påvirker de relasjonene dine eller det sosiale livet ditt?", impact],
  ["Hvor mye energi bruker du på å skjule, kompensere for eller håndtere vanskene?", ["Ingen eller nesten ingen", "Litt", "En del", "Mye", "Svært mye"]],
  ["Har de fleste vanskene først blitt tydelige de siste årene?", ["Nei", "Delvis, men mønsteret går lenger tilbake", "Ja, i stor grad", "Jeg er usikker"]],
] as const;

export const contextQuestionsNb = contextQuestions.map(({ id }, index) => ({
  id, text: contextNb[index][0], options: contextNb[index][1],
}));

export const answerLabelsNb = ["Aldri", "Sjelden", "Av og til", "Ofte", "Nesten alltid"];
