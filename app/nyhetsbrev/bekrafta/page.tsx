import type { Metadata } from "next";
import NewsletterAction from "../../_components/NewsletterAction";
export const metadata: Metadata = { title: "Bekräfta ditt nyhetsbrev | Relationsvarning", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default function Page() { return <NewsletterAction action="confirm" />; }
