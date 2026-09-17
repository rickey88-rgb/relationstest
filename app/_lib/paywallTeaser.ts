export type PaywallTeaser = { title: string; body: string };

export function buildPaywallTeaser(sortedScores: number[]): PaywallTeaser {
  const top = sortedScores[0] ?? 0;
  const second = sortedScores[1] ?? top;
  const bottom = sortedScores.at(-1) ?? top;
  const gap = top - second;
  const elevated = sortedScores.filter((score) => score >= 50).length;

  if (top < 40) {
    return gap >= 10
      ? { title: "Helhetsbilden är svagare – men inte helt jämn", body: "De flesta delar ligger relativt lågt, men ett par svar skiljer sig från resten. Det är framför allt de skillnaderna som ger resultatet mening." }
      : { title: "Inget enskilt område förklarar hela resultatet", body: "Dina svar ligger relativt jämnt mellan flera delar. Det gör att helheten – snarare än en enskild poäng – blir det mest intressanta i din profil." };
  }
  if (top - bottom >= 35 && bottom <= 30) {
    return { title: "Dina svar pekar åt mer än ett håll", body: "En del av dina svar stärker helhetsbilden, medan en annan del drar åt motsatt håll. Den kontrasten påverkar hur resultatet bör tolkas." };
  }
  if (gap >= 15) {
    return { title: "Ett tydligt mönster framträder i dina svar", body: "En del av din svarskombination väger tydligare än resten. Samtidigt finns det andra svar som förändrar hur helheten bör förstås. Det är samspelet mellan delarna som gör ditt resultat intressant." };
  }
  if (elevated >= 2) {
    return { title: "Flera mönster i dina svar förstärker varandra", body: "Dina svar pekar inte mot en enda förklaring. Flera delar samspelar, men vissa väger tydligare än andra. Det är kombinationen mellan dem som formar helhetsbilden." };
  }
  return { title: "Inget enskilt område förklarar hela resultatet", body: "Dina svar ligger relativt jämnt mellan flera delar. Det gör att helheten – snarare än en enskild poäng – blir det mest intressanta i din profil." };
}
