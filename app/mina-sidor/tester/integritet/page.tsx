import Link from "next/link";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default function TestStoragePrivacy() {
  return <main className="mx-auto max-w-3xl space-y-5 px-5 py-12">
    <h1 className="text-3xl font-semibold">När du väljer att spara din testanalys</h1>
    <p>Den här informationen gäller kontosparade analyser för IQ, ADHD, autism, HSP, ångest, PTSD, narcissismens självtest, relationstestet, anknytning, medberoende, gaslighting, narcissist i en relation, traumabindning och psykisk misshandel. Relationssvar kan även innehålla känsliga uppgifter om andra personer; undvik att lägga till identifierande uppgifter när du kontaktar support.</p>
    <p>Du kan göra testet och köpa analysen utan konto. Kontosparning är ett separat, frivilligt val och påverkar inte köpet.</p>
    <p>Om du väljer kontosparning lagrar vi dina testsvar krypterat tillsammans med testets och rapportens version. Svaren används för att återskapa samma analys på ditt konto. De kan innehålla känsliga uppgifter om din hälsa. Analysen är en självskattning och ställer ingen diagnos.</p>
    <p>Sparade analyser tas bort automatiskt senast tolv månader efter sparandet; den tekniska lagringstiden är något kortare. Under Mina tester kan du radera analysen tidigare och återkalla ditt lagringssamtycke. Köp- och betalningsuppgifter hanteras separat och analysradering tar inte bort köphistoriken.</p>
    <p>Nya köp i detta flöde har en tillfällig, krypterad gästkopia i högst sju dagar. Raderar du en kontosparad analys tas även dess kvarvarande gästkopia bort. Åtkomst till analysen stängs vid återbetalning eller tvist.</p>
    <p>En raderad analys kan finnas kvar en begränsad tid i skyddade säkerhetskopior. Ett separat raderingsregister hindrar att den görs tillgänglig igen vid återställning. Registret innehåller en teknisk engångsreferens och raderingstid, inga testsvar. Säkerhetskopior används endast för återställning under kontrollerade former.</p>
    <p>Mer information om personuppgiftsansvarig, rättsliga grunder, mottagare, överföringar och dina rättigheter finns i <Link className="underline" href="/integritet">integritetspolicyn</Link>. Kontakta <a className="underline" href="mailto:support@relationsvarning.se">support@relationsvarning.se</a> för frågor eller för att utöva dina rättigheter.</p>
    <Link href="/mina-sidor/tester">← Mina tester</Link>
  </main>;
}
