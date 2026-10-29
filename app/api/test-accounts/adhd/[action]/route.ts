import { accountIdentity, accountResponse, accountRedirect, sameAccountOrigin, readAccountForm } from "../../../../_lib/accountHttp.server";
import { adapter, assertFlag, flags } from "../../../../_lib/testAccounts/adapter";
import { paymentConfig, stripeClient } from "../../../../_lib/testAccounts/payment.server";
import { bindCheckout, createAttempt } from "../../../../_lib/testAccounts/store.server";
import { prepareLegacyImport, remove, save } from "../../../../_lib/testAccounts/service.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { testAccountHandlers } from "../../../../_lib/testAccounts/handlers.server";
// Preserve the existing ADHD URL and behavior; share orchestration with the new adapters.
const handlers = testAccountHandlers("adhd_test", "adhd", { accountIdentity, accountResponse, accountRedirect, sameAccountOrigin, readAccountForm, adapter, assertFlag, flags, paymentConfig, stripeClient, bindCheckout, createAttempt, prepareLegacyImport, remove, save });
export const GET = handlers.GET;
export const POST = handlers.POST;
