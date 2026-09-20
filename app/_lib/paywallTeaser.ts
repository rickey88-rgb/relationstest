export type PaywallTeaser = { title: string; body: string };

// Scores are the tests' existing 0–100 area scores. This only selects pre-paywall copy.
export function buildPaywallTeaser(scores: number[]): PaywallTeaser {
  const ranked = [...scores].sort((a, b) => b - a);
  const top = ranked[0] ?? 0;
  const second = ranked[1] ?? top;
  const gap = top - second;

  if (top < 40) {
    return {
      title: "Det som inte syns i dina svar är också viktigt",
      body: "Dina svar ger inte ett tydligt utslag i de områden testet mäter. Det påverkar hur helheten bör förstås.",
    };
  }
  if (top >= 60 && gap >= 25) {
    return {
      title: "Ett mönster i dina svar är svårt att bortse från",
      body: "Det blir inte tydligt av en enskild fråga. Det syns först när dina svar jämförs med varandra.",
    };
  }
  if (top >= 45 && gap >= 15) {
    return {
      title: "En del av ditt resultat sticker ut från resten",
      body: "När dina svar jämförs framträder en skillnad som påverkar hur helheten bör tolkas.",
    };
  }
  return {
    title: "Helheten blir tydligare när dina svar läggs ihop",
    body: "Ingen enskild del ger hela bilden. I analysen ser du hur svaren vägs samman och vad som nyanserar resultatet.",
  };
}
