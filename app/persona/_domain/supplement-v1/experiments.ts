// Each suggestion fits both the selected recent resource and the current priority.
const copy: Record<string, Record<string,string>> = {
  "small-step": {
    voice:"Skriv en mening om vad du vill. Säg just den meningen i ett litet gemensamt val, utan att behöva förklara allt på en gång.",
    pause:"Be att få återkomma om en liten förfrågan. Ta en minut till att välja om du vill tacka ja, nej eller be om mer information.",
    start:"Välj en första handling som går att göra på fem minuter. Stanna där och avgör om du vill fortsätta.",
    connection:"Skicka en kort hälsning till personen och föreslå en liten kontakt, till exempel ett kort samtal.",
    preserve:"Välj en liten del av rutinen som du vill behålla. Ge just den delen plats vid nästa tillfälle, utan att göra rutinen större.",
  },
  listened: {
    voice:"Fråga vad den andra vill och lyssna färdigt. Säg sedan din egen önskan i en mening, innan ni bestämmer något.",
    pause:"Lyssna färdigt på förfrågan och sammanfatta vad den innebär. Be sedan om tid innan du ger besked.",
    start:"Om du vill bolla uppgiften med någon, lyssna på ett enda förslag. Välj sedan själv en första handling att prova.",
    connection:"Fråga personen om något som är viktigt för dem och ge svaret utrymme. Dela därefter något du själv ville berätta.",
    preserve:"Om rutinen berör någon annan, fråga hur den fungerar för dem. Välj själv vad du vill behålla; lyssnandet behöver inte innebära en förändring.",
  },
  asked: {
    voice:"Om en fråga är oklar, be om ett förtydligande. Säg sedan vilken del du själv vill, så att din önskan finns med i samtalet.",
    pause:"Be om den uppgift du behöver innan du svarar på förfrågan. Ge inget färdigt besked förrän du fått svar eller valt att avstå.",
    start:"Formulera en enda fråga som skulle göra nästa steg tydligare. Be någon om just det beskedet och välj sedan om du vill börja.",
    connection:"Fråga personen om en tid eller form för kontakt som skulle passa. Lägg också fram ett eget litet förslag.",
    preserve:"Om du behöver hjälp att ge rutinen plats, be om en enda avgränsad sak. Om rutinen redan fungerar behöver du inte ändra den.",
  },
  alternative: {
    voice:"Prova att skriva din önskan före ett samtal och använd den som stöd när du säger vad du vill.",
    pause:"Prova ett annat första besked på en förfrågan: att du vill återkomma. Avgör sedan i lugn och ro vad du vill svara.",
    start:"Byt sättet att börja vid ett enda tillfälle, till exempel genom ett enkelt utkast i stället för ett färdigt upplägg.",
    connection:"Prova en annan form för en liten kontakt, som en promenad i stället för ett längre samtal vid ett bord.",
    preserve:"Om något hindrar rutinen, prova ett annat sätt att ordna just den praktiska delen. Behåll det du redan uppskattar med rutinen.",
  },
};
export function experiment(goal: string, resource: string) {
  return copy[resource]?.[goal] ?? "";
}
