/* eslint-disable @typescript-eslint/no-require-imports -- generates a LOCAL signed sentinel; no upload or network. */
const fs = require("node:fs"), path = require("node:path"), { createHmac } = require("node:crypto");
const encoded = process.env.ACCOUNT_ERASURE_SIGNING_KEY ?? "", registryId = process.env.ACCOUNT_ERASURE_REGISTRY_ID ?? "";
if (!/^[A-Za-z0-9_-]{43}$/.test(encoded) || Buffer.from(encoded, "base64url").length !== 32
  || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(registryId)) throw new Error("Provide local registry identity and 32-byte signing key; no values are printed");
const body = { v: 1, kind: "account-erasure-registry", registryId };
const signature = createHmac("sha256", Buffer.from(encoded, "base64url")).update(JSON.stringify(body)).digest("base64url");
const folder = path.resolve(__dirname, "../.artifacts"); fs.mkdirSync(folder, { recursive: true });
const target = path.join(folder, "account-erasure-registry.json");
fs.writeFileSync(target, JSON.stringify({ body, signature }) + "\n", { flag: "wx" });
console.log("Created local signed registry file in .artifacts; no infrastructure changed.");
