/* eslint-disable @typescript-eslint/no-require-imports -- executable canonical-host regression test. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { NextRequest } = require("next/server");
const createLoader = require("./app/autism-test/test/test-loader.cjs");
const { proxy } = createLoader({})(path.join(__dirname, "proxy.ts"));

const apex = proxy(new NextRequest("https://relationsvarning.se/audhd-test/test?source=ads"));
assert.equal(apex.status, 308);
assert.equal(apex.headers.get("location"), "https://www.relationsvarning.se/audhd-test/test?source=ads");

const canonical = proxy(new NextRequest("https://www.relationsvarning.se/audhd-test/test"));
assert.equal(canonical.headers.get("location"), null);
console.log("PASS: apex AuDHD requests canonically redirect to www before a host-only checkout cookie can be set.");
