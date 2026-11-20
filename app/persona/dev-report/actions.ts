"use server";
import { notFound } from "next/navigation";
import { buildPersonaReport } from "../_domain/registry";
import { parseSubmission } from "../_domain/v5/submission";
import { canOpenLocalReport } from "./access";

export async function loadLocalPersonaReport(input: unknown) {
  if (!await canOpenLocalReport(true)) notFound();
  return buildPersonaReport(parseSubmission(input));
}
