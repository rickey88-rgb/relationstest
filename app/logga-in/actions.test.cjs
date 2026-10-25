/* eslint-disable @typescript-eslint/no-require-imports -- executable server-action regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");

let outcome = { error: null };
let throwOnRequest = null;
let request = null;
const redirects = [];
const logs = [];

const actions = createLoader({
  "next/navigation": {
    redirect: destination => {
      redirects.push(destination);
      throw new Error("NEXT_REDIRECT");
    },
  },
  "../_lib/authConfig.server": {
    applicationOrigin: () => "https://www.relationsvarning.se",
    authConfirmUrl: () => "https://www.relationsvarning.se/auth/confirm",
    loginUrl: (origin, status) => new URL(`/logga-in?status=${status}`, origin),
    validLoginEmail: () => "customer@example.test",
  },
  "../_lib/supabase/server": {
    createServerSupabaseClient: async () => ({
      auth: {
        signInWithOtp: async input => {
          request = input;
          if (throwOnRequest) throw throwOnRequest;
          return outcome;
        },
      },
    }),
  },
})(path.join(__dirname, "actions.ts"));

async function requestMagicLink() {
  redirects.length = 0;
  try {
    await actions.requestMagicLink(new FormData());
  } catch (error) {
    assert.equal(error.message, "NEXT_REDIRECT");
  }
  return redirects[0];
}

(async () => {
  const originalConsoleError = console.error;
  console.error = (...args) => logs.push(args);
  try {
    outcome = { error: null };
    throwOnRequest = null;
    logs.length = 0;
    assert.equal(await requestMagicLink(), "https://www.relationsvarning.se/logga-in?status=sent");
    assert.equal(logs.length, 0);
    assert.deepEqual(request.options, {
      shouldCreateUser: true,
      emailRedirectTo: "https://www.relationsvarning.se/auth/confirm",
    });

    outcome = { error: { status: 422, code: "redirect_url_not_allowed", message: "must never be logged" } };
    logs.length = 0;
    assert.equal(await requestMagicLink(), "https://www.relationsvarning.se/logga-in?status=unavailable");
    assert.deepEqual(logs, [["supabase_magic_link_request_failed", { status: 422, code: "redirect_url_not_allowed" }]]);

    outcome = { error: null };
    throwOnRequest = new Error("transport details must never be logged");
    logs.length = 0;
    assert.equal(await requestMagicLink(), "https://www.relationsvarning.se/logga-in?status=unavailable");
    assert.deepEqual(logs, [["supabase_magic_link_request_failed", { status: null, code: null }]]);
    console.log("PASS: Magic Link success is explicit; Supabase errors and exceptions stay neutral and log only safe metadata.");
  } finally {
    console.error = originalConsoleError;
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
