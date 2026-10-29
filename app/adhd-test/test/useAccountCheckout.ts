"use client";
import { useTestAccountCheckout } from "../../_components/useTestAccountCheckout";
/** Keep ADHD's public hook contract and URLs while sharing checkout transport. */
export function useAccountCheckout(answers: number[], onError: () => void) {
  return useTestAccountCheckout("adhd", answers, onError);
}
