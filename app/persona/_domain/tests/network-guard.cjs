/* eslint-disable @typescript-eslint/no-require-imports */
// Preloaded in isolated test processes, before test discovery or application imports.
const blocked = () => { throw new Error("External connections are disabled in PERSONA tests"); };
globalThis.fetch = blocked;
for (const name of ["node:http", "node:https"]) {
  const mod = require(name); mod.request = blocked; mod.get = blocked;
}
const net = require("node:net"); net.connect = blocked; net.createConnection = blocked; net.Socket.prototype.connect = blocked;
require("node:tls").connect = blocked;
