import type { Metadata } from "next";
import NewsletterAction from "../../_components/NewsletterAction";
export const metadata: Metadata = { title: "Avsluta nyhetsbrevet | Relationsvarning", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default function Page() { return <NewsletterAction action="unsubscribe" />; }
