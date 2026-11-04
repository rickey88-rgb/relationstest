// Server-rendered legal information only: keep the operator's name out of Git.
export function getLegalIdentity() {
  const name = process.env.LEGAL_RESPONSIBLE_NAME?.trim();
  if (!name) throw new Error("Legal identity is not configured");
  return {
    name,
    email: "support@relationsvarning.se",
    // Publish an address or company registration number only after explicit approval.
    postalAddress: null as string | null,
    organizationNumber: null as string | null,
  } as const;
}
