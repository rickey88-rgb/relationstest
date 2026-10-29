import Iq from "../../iq-test/test/ReportView";
import type { Result as IqResult } from "../../iq-test/test/model";
import Partner from "../../narcissist-i-en-relation/test/ReportView";
import type { Result as partnerResult } from "../../narcissist-i-en-relation/test/model";
import TraumaBond from "../../traumabindningtest/test/ReportView";
import type { Result as traumaBondResult } from "../../traumabindningtest/test/model";
import PsychologicalAbuse from "../../psykisk-misshandel-relation/test/ReportView";
import type { Result as psychologicalAbuseResult } from "../../psykisk-misshandel-relation/test/model";
import Hsp from "../../hsp-test/test/ReportView";
import Angest from "../../angest-test/test/ReportView";
import Ptsd from "../../ptsd-test/test/ReportView";
import Adhd from "../../adhd-test/test/AdhdReport";
import Narcissism from "../../narcissism-sjalvtest/test/ReportView";
import Screening from "../../test/ReportView";
import Autism from "../../autism-test/test/ReportView";
import Attachment from "../../anknytningstest/test/ReportView";
import Codependency from "../../medberoendetest/test/ReportView";
import Gaslighting from "../../gaslightingtest/test/ReportView";
import type { Result as AttachmentResult } from "../../anknytningstest/test/model";
import type { Result as CodependencyResult } from "../../medberoendetest/test/model";
import type { Result as GaslightingResult } from "../../gaslightingtest/test/model";
import type { Result as AutismResult } from "../../autism-test/test/model";
import type { Result as NarcissismResult } from "../../narcissism-sjalvtest/test/model";
import type { ScreeningReport } from "../../test/report";
import type { Result as HspResult } from "../../hsp-test/test/model";
import type { Result as PtsdResult } from "../../ptsd-test/test/model";
import type { Result as AdhdResult } from "../../adhd-test/test/model";
import type { calculate } from "../../angest-test/test/model";
/** Input comes only from the verified server reader, never request JSON or localStorage. */
export default function ReportView({ product, result }: { product: string; result: unknown }) {
  switch (product) {
    case "iq_test": return <Iq result={result as IqResult} />;
    case "narcissist_partner": return <Partner result={result as partnerResult} />;
    case "trauma_bond_test": return <TraumaBond result={result as traumaBondResult} />;
    case "psychological_abuse_test": return <PsychologicalAbuse result={result as psychologicalAbuseResult} />;
    case "attachment_test": return <Attachment result={result as AttachmentResult} />;
    case "codependency_test": return <Codependency result={result as CodependencyResult} />;
    case "gaslighting_test": return <Gaslighting result={result as GaslightingResult} />;
    case "autism_test": return <Autism result={result as AutismResult} />;
    case "narcissism_selftest": return <Narcissism result={result as NarcissismResult} />;
    case "screening_test": return <Screening result={result as ScreeningReport} />;
    case "hsp_test": return <Hsp result={result as HspResult} />;
    case "angest_test": return <Angest result={result as ReturnType<typeof calculate>} />;
    case "ptsd_test": return <Ptsd result={result as PtsdResult} />;
    case "adhd_test": return <Adhd result={result as AdhdResult} />;
    default: throw new Error("Unsupported report");
  }
}
