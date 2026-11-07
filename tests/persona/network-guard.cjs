/* eslint-disable @typescript-eslint/no-require-imports -- allow isolated loopback fixtures only; block provider/network egress. */
const net=require("node:net"),tls=require("node:tls");
const loopback=host=>["127.0.0.1","::1","[::1]","localhost"].includes(String(host).toLowerCase());
function target(args) {
  if(Array.isArray(args[0]))return target(args[0]);
  const options=args[0];
  if(options&&typeof options==="object")return options.path?null:(options.host??options.hostname??"localhost");
  return typeof options==="number"?(typeof args[1]==="string"?args[1]:"localhost"):null;
}
const connect=net.Socket.prototype.connect;
net.Socket.prototype.connect=function(...args) {
  if(!loopback(target(args)))throw Error("External connections blocked by PERSONA release tests");
  return connect.apply(this,args);
};
const secureConnect=tls.connect;
tls.connect=function(...args) {
  if(!loopback(target(args)))throw Error("External TLS connections blocked by PERSONA release tests");
  return secureConnect.apply(this,args);
};
const fetch=global.fetch;
global.fetch=async(input,options)=>{
  const url=new URL(typeof input==="string"||input instanceof URL?input:input.url);
  if(!loopback(url.hostname))throw Error("External fetch blocked by PERSONA release tests");
  return fetch(input,options);
};
