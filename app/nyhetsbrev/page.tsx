import type { Metadata } from "next";
import NewsletterSignup from "../_components/NewsletterSignup";
export const metadata: Metadata = { title: "Följ Relationsvarning.se – nyhetsbrev", description: "Få guider, nya tester, böcker och utvalda erbjudanden. Frivilligt och enkelt att avsluta.", alternates: { canonical: "https://www.relationsvarning.se/nyhetsbrev" } };
export default function Page() { return <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6"><NewsletterSignup source="footer" /></main>; }
