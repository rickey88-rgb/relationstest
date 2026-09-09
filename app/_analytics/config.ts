export const GA_MEASUREMENT_ID = "G-XWVSHHNY7G";
export const testConfig = {
  screening_test: { name: "Screeningtest för relationen", path: "/test", price: 79, currency: "SEK" },
  psychological_abuse_test: { name: "Test om psykisk misshandel och psykiskt våld", path: "/psykisk-misshandel-relation/test", price: 79, currency: "SEK" },
  attachment_test: { name: "Anknytningstest", path: "/anknytningstest/test", price: 79, currency: "SEK" },
  codependency_test: { name: "Medberoendetest", path: "/medberoendetest/test", price: 79, currency: "SEK" },
  gaslighting_test: { name: "Gaslightingtest", path: "/gaslightingtest/test", price: 79, currency: "SEK" },
  trauma_bond_test: { name: "Traumabindningstest", path: "/traumabindningtest/test", price: 79, currency: "SEK" },
  narcissist_partner: { name: "Narcissistiska relationsmönster hos en partner", path: "/narcissist-i-en-relation/test", price: 79, currency: "SEK" },
  narcissism_selftest: { name: "Narcissism – självtest", path: "/narcissism-sjalvtest/test", price: 79, currency: "SEK" },
} as const;
export type TestId = keyof typeof testConfig;
