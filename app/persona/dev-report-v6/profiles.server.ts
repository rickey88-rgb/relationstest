import "server-only";
import fixtures from "../../../tests/persona/insights-v2-full-fixtures.cjs";
import { buildReport, VERSIONS } from "../_domain/v6/index";
import type { Report } from "../_domain/v6/types";

// Only authored fixtures: no storage, cookies, submission input or customer lookup.
export const previewProfiles = fixtures.map((profile: { id: string; name: string }) => ({
  id: profile.id, name: profile.name,
}));
export function reportForProfile(id: string): Report | null {
  const profile = fixtures.find((item: { id: string }) => item.id === id);
  if (!profile) return null;
  return buildReport({ questionVersion: VERSIONS.question, reportVersion: VERSIONS.report, answers: profile.answers.slice() });
}
