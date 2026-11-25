// Shared with the deployed Supabase checkout gate. An explicit false pauses
// public entry points without affecting the independent report access flags.
export function personaPublicPaused() {
  return process.env.TEST_ACCOUNTS_PERSONA_CHECKOUT_ENABLED === "false";
}
