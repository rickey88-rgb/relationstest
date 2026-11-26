import type { Metadata } from "next";
import Link from "next/link";
import EditorialSurface from "../_components/EditorialSurface";
import { isNpfTest, NpfQualityCards, NpfReportExample, NpfReportIntroduction, npfTestKeys, npfTests, premiumButton, premiumSecondary, premiumShell, premiumStyles as styles } from "../_components/NpfPremium";
import { textLink } from "../_components/ContentGuide";
import NpfLandingLink from "../_components/NpfLandingLink";

export const metadata: Metadata = {
  title: "Varför Relationsvarning? | Självinsikt på dina villkor",
  description: "Se vad som ingår i våra individuella ADHD-, autism- och AuDHD-analyser och hur vi utvecklar, granskar och testar dem.",
  alternates: { canonical: "https://www.relationsvarning.se/varfor-relationsvarning" },
};

export default async function WhyRelationsvarning({ searchParams }: { searchParams: Promise<{ test?: string | string[] }> }) {
  const { test } = await searchParams;
  const selected = isNpfTest(test) ? test : null;
  const choices = selected ? [selected, ...npfTestKeys.filter(key => key !== selected)] : [...npfTestKeys];

  return <EditorialSurface><main className={premiumShell}>
    <nav aria-label="Brödsmulor" className="text-sm text-neutral-600"><Link href="/" className={textLink}>Relationsvarning</Link> / <span aria-current="page">Varför Relationsvarning?</span></nav>
    <header className={styles.trustHero}>
      <p className={styles.eyebrow}>Varför Relationsvarning?</p>
      <h1>Vi vill bli Sveriges mest pålitliga plattform för självinsikt.</h1>
      <p className={styles.headline}>Vi säljer självinsikt. Inte diagnoser.</p>
      <p className={styles.intro}>En utförlig rapport som utgår från dina egna svar. En öppen metod så att du vet hur vi kommer fram till den. Vi arbetar för att utveckla Sveriges mest träffsäkra självtester inom ADHD, autism och AuDHD.</p>
      <div className={styles.actions}>
        {selected ? <NpfLandingLink href={`${npfTests[selected].path}/test`} source="/varfor-relationsvarning" action="return_to_test" className={premiumButton}>{npfTests[selected].start} <span aria-hidden="true">→</span></NpfLandingLink> : <Link href="#valj-test" className={premiumButton}>Hitta rätt självtest <span aria-hidden="true">↓</span></Link>}
        <NpfLandingLink href="#rapportexempel" source="/varfor-relationsvarning" action="report_example" className={premiumSecondary}>Se rapportexempel</NpfLandingLink>
      </div>
    </header>
    <NpfQualityCards />

    <div className={styles.featureGrid}>
      <section>
        <h2>Samma pris, oavsett dina svar</h2>
        <p>Vi säljer den individuella analysen. Vi säljer inga kliniska utredningar, diagnoser eller läkemedel och tjänar inget extra på att du känner igen många drag. Dina svar styr resultatet. Ett köp ger dig tillgång till den fullständiga rapporten.</p>
      </section>
      <section>
        <h2>Vad du betalar för</h2>
        <p>Du kan göra testet och få en första återkoppling gratis. För den fullständiga analysen betalar du en gång. Köpet täcker arbetet bakom rapporten, från metodik och resultatmodeller till säker hantering av data, teknisk drift och underhåll. Inga dolda avgifter eller abonnemang.</p>
      </section>
      <section>
        <h2>Fem förbättringar, verifierade i 4 500 jämförelser</h2>
        <p>Efter vår interna metodgranskning den 26 november 2026 förbättrade vi återkopplingen i alla tre test. ADHD-rapporten beskriver tydligare när svårigheter återkommer i flera delar av livet. Autismtestet lyfter ett högt delområde även vid låg helhet. AuDHD-rapporten hanterar osäkra svar, två höga index och olika besked om vardagspåverkan tydligare.</p>
        <p>I 4 500 jämförelser kontrollerade vi att huvudpoängen var oförändrade efter korrigeringarna. Vi kontrollerade också att betalstatus inte påverkar själva beräkningen.</p>
      </section>
      <section>
        <h2>Öppen metod och fortsatt utveckling</h2>
        <p>Med stöd av COSMIN:s metodik har vi internt granskat frågornas relevans, täckning och begriplighet. Systematiska tekniska kontroller hjälper oss att fånga när en rapport säger mer än svaren ger stöd för. Vi fortsätter investera i metodik, analys och innehåll.</p>
        <p>Testen är självskattningar för vuxna. Klinisk träffsäkerhet kräver separat validering. <Link href="/metodik#kvalitetsarbete-npf" className={textLink}>Läs om vårt kvalitetsarbete</Link>.</p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">{npfTestKeys.map(key => <li key={key}><Link className={textLink} href={npfTests[key].method}>Metodik för {npfTests[key].name}</Link></li>)}</ul>
      </section>
    </div>

    <section id="rapportexempel" className="mt-10 scroll-mt-6">
      <h2 className="text-3xl font-semibold">Se vad som ingår i rapporten</h2>
      <NpfReportIntroduction />
      <div className={styles.examples}>{choices.map(key => <NpfReportExample key={key} test={key} showIntroduction={false} />)}</div>
    </section>

    <section id="valj-test" className={`${styles.end} scroll-mt-6`}>
      <h2>{selected ? `Redo att börja med ${npfTests[selected].name}?` : "Välj en självskattning som passar dig"}</h2>
      <p>Du kan börja direkt och läsa din första återkoppling gratis.</p>
      <div className={styles.actions}>{choices.map(key => <NpfLandingLink key={key} href={`${npfTests[key].path}/test`} source="/varfor-relationsvarning" action="return_to_test" className={key === selected ? premiumButton : premiumSecondary}>{npfTests[key].start}</NpfLandingLink>)}</div>
      {selected && <p><Link href={npfTests[selected].path} className={textLink}>Tillbaka till {npfTests[selected].title}</Link></p>}
    </section>
  </main></EditorialSurface>;
}
