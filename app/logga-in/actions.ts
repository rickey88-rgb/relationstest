"use server";

import { redirect } from "next/navigation";
import { authConfirmUrl, applicationOrigin, loginUrl, validLoginEmail } from "../_lib/authConfig.server";
import { createServerSupabaseClient } from "../_lib/supabase/server";

/**
 * Intentionally redirects to the same confirmation state for malformed input,
 * missing configuration and auth failures. It never reveals account existence.
 */
export async function requestMagicLink(formData: FormData) {
  const email = validLoginEmail(formData.get("email"));
  if (email) {
    try {
      const supabase = await createServerSupabaseClient();
      await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: authConfirmUrl(),
        },
      });
    } catch {
      // Avoid logging an email address or differentiating account states.
    }
  }
  redirect(loginUrl(applicationOrigin(), "sent").toString());
}
