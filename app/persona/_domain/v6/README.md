# Isolated PERSONA V6 – editorial revision V6.1

Import this directory's index.ts for offline review only. It is absent from the active registry,
test flow, dev-report endpoint, payment handlers and customer report views.
V5, questions, scoring and the insight engine are unchanged.

Input stays { questionVersion: "persona-questions-v3", reportVersion: "persona-report-v6", answers: number[40] }.
The existing V3 parser validates the envelope. V6 uses its own Report type.
The editorial revision used persona-report-content-v6.2. The bounded factual correction uses
persona-report-content-v6.3 to distinguish corrected selections from earlier examples.

## Evidence and editorial responsibilities

- dimensions.ts retains the previous confidence gates and unchanged V3 scores.
- Four existing archetype labels retain their exact prior activation conditions.
- portrait.ts combines sourced claims into one narrative. Claims preserve evidence and counterevidence.
  Situation-specific differences use explicit answers; no situation is inferred from an average.
  Strong main examples have 150–220 words. Weak profiles remain shorter without invented traits.
- insight-copy.ts is a presentation library for the same 18 selected engine rules.
  Each has a pattern statement, possible interpretation, everyday extension and a concrete experiment.
  The raw, unchanged engine result (including original advice and limits) remains in insightAnalysis.
- Editorial advice may rephrase or refine an engine experiment, but keeps its insight ID and evidence.
  The structured-learning variant also requires a clear C direction and records that extra evidence.
  No new engine rule is introduced by a wording variant.
- content.ts separates strength applications, conditional risks and fallback experiments.
- report.ts reserves boundary/recovery topics to avoid reusing them as generic strengths.
  Relationship wording varies with supported E/N context; the context evidence is recorded.
  A possible limitation remains a hypothesis, not an observed problem.
- The compass has at most three advice blocks. Base dimension advice is optional and must be distinct
  from dimensions already supporting selected engine advice. No advice is needed for a neutral profile.
- A single common method paragraph replaces repeated general disclaimers.
  Specific qualifications remain when they affect the reading (for example low Q23 or globally mixed signals).
- render.ts creates the actual review text and an optional evidence appendix. It does not create a second report.
  countWords includes visible headings and the common method note, excluding the evidence appendix.

## Review and boundaries

scripts/render-persona-v6-samples.cjs exports all 24 constructed full profiles.
scripts/audit-persona-editorial-v61.cjs compares saved before and after directories, asserts unchanged
answers, dimensions, readings, archetypes and complete insight analysis, then writes the comparison.
Exact paragraph reuse and reservation phrase counts are descriptive editorial checks, not scientific
readability or validity measures. Human semantic review remains necessary.

Before any future customer integration, review short and contradictory profiles, conditional risks,
advice usefulness and the server-only paid report contract. No automatic activation is part of this revision.

## Factual correction

High-O strength variants require a high O direction and direct idea-interest support.
Low-O strengths keep their own text even with a clear C direction. Cooperation preference
requires Q27 support; an A average cannot supply a missing facet. Mood-shift wording requires
Q19 support. Counterexamples cover these distinctions without modifying scoring or the engine.
The facts audit exports all 24 profiles at claim/block level, including counterevidence.
