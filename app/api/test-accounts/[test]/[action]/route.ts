import { NextRequest } from "next/server";
import { adapterForSlug } from "../../../../_lib/testAccounts/adapter";
import { testAccountHandlers } from "../../../../_lib/testAccounts/handlers.server";
import { accountResponse } from "../../../../_lib/accountHttp.server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ test: string; action: string }> };
async function dispatch(method: "GET" | "POST", request: NextRequest, context: Context) {
  const { test, action } = await context.params;
  let model;
  try { model = adapterForSlug(test); } catch { return accountResponse({ error: "Not found" }, 404); }
  return testAccountHandlers(model.product, model.slug)[method](request, { params: Promise.resolve({ action }) });
}
export const GET = (request: NextRequest, context: Context) => dispatch("GET", request, context);
export const POST = (request: NextRequest, context: Context) => dispatch("POST", request, context);
