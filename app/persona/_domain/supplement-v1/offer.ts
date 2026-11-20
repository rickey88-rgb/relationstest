import { immutable } from "../immutable";
import type { QualityState } from "../quality-v1/index";
import { SECTION_TITLES } from "../v6/manifest";
import type { SectionId } from "../v6/types";
export const OFFER_POLICY_VERSION = "persona-offer-policy-v1";
export function describeOffer(input: {
  state: QualityState; sections: readonly SectionId[]; insights: number; strengths: number; advice: number;
  supplementRelevant: boolean; completionAttempted: boolean;
}) {
  const included = (Object.keys(SECTION_TITLES) as SectionId[]).filter(id=>input.sections.includes(id));
  const missing = (Object.keys(SECTION_TITLES) as SectionId[]).filter(id=>!included.includes(id));
  const available = included.map(id=>SECTION_TITLES[id]);
  const absent = missing.map(id=>SECTION_TITLES[id]);
  return immutable({
    version:OFFER_POLICY_VERSION,state:input.state,includedSections:available,missingSections:absent,
    counts:{insights:input.insights,strengths:input.strengths,advice:input.advice},
    // Eligibility for a future offer, not a payment entitlement or an activated checkout.
    fullPremiumOfferAllowed:input.state==="ready",
    // Conservative launch policy: limited is disclosed, never sold as the full six-part promise.
    limitedPurchaseAllowed:false as const,
    supplementAllowed:input.state!=="ready"&&input.supplementRelevant,
    nextStep:input.state==="ready"?"premium-offer":input.state==="limited"?"limited-summary":
      input.completionAttempted?"free-result":"supplement",
    description:input.state==="ready"
      ? "Din rapport har individuellt innehåll i alla sex delar och kan erbjudas som en fullständig premiumrapport."
      :input.state==="limited"
        ? "Din rapport har avgränsat individuellt innehåll i "+available.join(", ")+". Den innehåller "+
          input.insights+" kombinationsinsikter, "+input.strengths+" styrkor eller situationsbundna resurser och "+input.advice+" råd."+
          (absent.length?" Följande delar saknar tillräckligt individuellt innehåll: "+absent.join(", ")+".":"")+
          " Detta är ett begränsat resultat och erbjuds inte som en fullständig premiumrapport."+
          (input.supplementRelevant?" Du kan frivilligt komplettera om frågorna känns relevanta.":"")
        : "Den här analysen ger ännu inte tillräckligt underlag för en individuell premiumrapport. Dina svar är inte felaktiga. "+
          (input.completionAttempted?"Du får ett gratisresultat och inget premiumköp erbjuds.":"Du kan frivilligt svara på högst fyra kompletteringar eller behålla ett gratisresultat."),
  });
}
