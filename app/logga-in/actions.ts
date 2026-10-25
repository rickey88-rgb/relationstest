"use server";

import { redirect } from "next/navigation";
import { authConfirmUrl, applicationOrigin, loginUrl, validLoginEmail } from "../_lib/authConfig.server";
import { createServerSupabaseClient } from "../_lib/supabase/server";

type SupabaseAuthFailure = {
  status?: unknown;
  code?: unknown;
};

function authFailureMetadata(error: unknown) {
  const failure = error as SupabaseAuthFailure | null;
  const status = typeof failure?.status === "number" && Number.isInteger(failure.status) && failure.status >= 100 && failure.status <= 599 ? failure.status : null;
  const code = typeof failure?.code === "string" && /^[A-Za-z0-9._-]{1,128}$/.test(failure.code) ? failure.code : null;
  return { status, code };
}

function logMagicLinkFailure(error: unknown) {
  // Do not log the submitted email, a token, a key, or free-form error text.
  console.error("supabase_magic_link_request_failed", authFailureMetadata(error));
}

/**
 * A successful Supabase response is the only path that claims a link was sent.
 * Failure copy remains neutral and never reveals account existence.
 */
export async function requestMagicLink(formData: FormData) {
  const email = validLoginEmail(formData.get("email"));
  let status: "sent" | "unavailable" = "unavailable";
  if (email) {
    try {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: authConfirmUrl(),
        },
      });
      if (error) {
        logMagicLinkFailure(error);
      } else {
        status = "sent";
      }
    } catch (error) {
      logMagicLinkFailure(error);
    }
  }
  redirect(loginUrl(applicationOrigin(), status).toString());
}
