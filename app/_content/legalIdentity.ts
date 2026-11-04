// Server-rendered legal information only: keep the operator's name out of Git.
export function getLegalIdentity() {
  const name = process.env.LEGAL_RESPONSIBLE_NAME?.trim();
  const postalAddress = process.env.LEGAL_BUSINESS_ADDRESS?.trim();
  if (!name || !postalAddress) throw new Error("Legal identity is not configured");
  return {
    name,
    email: "support@relationsvarning.se",
    postalAddress,
    // Publish a company registration number only after explicit approval.
    organizationNumber: null as string | null,
  } as const;
}
