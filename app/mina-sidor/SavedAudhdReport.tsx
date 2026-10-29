"use client";
import ReportView from "../audhd-test/test/ReportView";
import type { Report } from "../audhd-test/test/model";

export default function SavedAudhdReport({ report }: { report: Report }) {
  return <ReportView report={report} onRestart={() => window.location.assign("/audhd-test/test")} />;
}
