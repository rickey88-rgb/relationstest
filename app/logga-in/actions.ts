"use server";

import { redirect } from "next/navigation";
import { authConfirmUrl, applicationOrigin, loginUrl, validLoginEmail } from "../_lib/authConfig.server";
import { createServerSupabaseClient } from "../_lib/supabase/server";

type SupabaseAuthFailure = {
  status?: unknown;
  code?: unknown;
};

type MagicLinkFailurePhase = "client-init" | "redirect-url" | "otp-request";
type MagicLinkFailureCategory = "transport" | "supabase-api" | "unexpected";

function httpStatus(error: SupabaseAuthFailure | null) {
  const status = error?.status;
  return typeof status === "number" && Number.isInteger(status) && status >= 100 && status <= 599 ? status : null;
}

function authFailureMetadata(error: unknown) {
  const failure = error as SupabaseAuthFailure | null;
  const status = httpStatus(failure);
  const code = typeof failure?.code === "string" && /^[A-Za-z0-9._-]{1,128}$/.test(failure.code) ? failure.code : null;
  return { status, code };
}

function failureCategory(error: unknown): MagicLinkFailureCategory {
  const failure = error as SupabaseAuthFailure | null;
  if (failure?.status === 0) return "transport";
  if (httpStatus(failure) !== null) return "supabase-api";
  return "unexpected";
}

function logMagicLinkFailure(phase: MagicLinkFailurePhase, error: unknown) {
  // Do not log the submitted email, a token, a key, or free-form error text.
  console.error("supabase_magic_link_request_failed", {
    phase,
    category: failureCategory(error),
    ...authFailureMetadata(error),
  });
}

/**
 * A successful Supabase response is the only path that claims a link was sent.
 * Failure copy remains neutral and never reveals account existence.
 */
export async function requestMagicLink(formData: FormData) {
  const email = validLoginEmail(formData.get("email"));
  let status: "sent" | "unavailable" = "unavailable";
  if (email) {
    let phase: MagicLinkFailurePhase = "client-init";
    try {
      const supabase = await createServerSupabaseClient();
      phase = "redirect-url";
      const emailRedirectTo = authConfirmUrl();
      phase = "otp-request";
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo,
        },
      });
      if (error) {
        logMagicLinkFailure(phase, error);
      } else {
        status = "sent";
      }
    } catch (error) {
      logMagicLinkFailure(phase, error);
    }
  }
  redirect(loginUrl(applicationOrigin(), status).toString());
}
