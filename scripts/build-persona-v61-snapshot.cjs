/* eslint-disable @typescript-eslint/no-require-imports -- deterministic offline release snapshot */
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto"),ts=require("typescript");
const root=path.resolve(__dirname,".."),domain=path.join(root,"app/persona/_domain");
const entry="supplement-v1/index.ts",modules=new Map(),hashes={};
const idFor=file=>path.relative(domain,file).replaceAll("\\","/");
function collect(id){
 if(modules.has(id))return;
 const file=path.join(domain,id),source=fs.readFileSync(file,"utf8").replace(/\r\n/g,"\n");
 const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2017}}).outputText;
 modules.set(id,compiled);hashes[id]=crypto.createHash("sha256").update(source).digest("hex");
 for(const match of compiled.matchAll(/require\("([^"]+)"\)/g)){
  if(!match[1].startsWith("."))throw Error("External dependency in frozen PERSONA snapshot");
  const resolved=path.resolve(path.dirname(file),match[1])+".ts";
  if(!resolved.startsWith(domain+path.sep))throw Error("Snapshot dependency outside PERSONA domain");
  collect(idFor(resolved));
 }
}
collect(entry);
const ordered=Object.fromEntries(Object.entries(hashes).sort(([a],[b])=>a.localeCompare(b,"en")));
const fingerprint=crypto.createHash("sha256").update(JSON.stringify(ordered)).digest("hex");
const moduleText=Array.from(modules).sort(([a],[b])=>a.localeCompare(b,"en"))
 .map(([id,code])=>JSON.stringify(id)+":function(require,module,exports){\n"+code+"\n}").join(",\n");
const output='/* eslint-disable -- Generated immutable PERSONA V6.1 release snapshot; regenerate only for a NEW release. */\n'+
 'const factories={\n'+moduleText+'\n};\n'+
 'const cache=new Map();function load(id){if(cache.has(id))return cache.get(id).exports;const factory=factories[id];if(!factory)throw Error("Unknown frozen module");const module={exports:{}};cache.set(id,module);factory(name=>{const parts=id.split("/");parts.pop();for(const part of name.split("/")){if(part==="..")parts.pop();else if(part!==".")parts.push(part);}return load(parts.join("/")+".ts");},module,module.exports);return module.exports;}\n'+
 'const supplement=load("supplement-v1/index.ts"),v6=load("v6/manifest.ts"),insights=load("insights-v1/index.ts");\n'+
 'module.exports=Object.freeze({completeReport:supplement.completeReport,sourceFingerprint:'+JSON.stringify(fingerprint)+',sourceHashes:Object.freeze('+JSON.stringify(ordered)+'),versions:Object.freeze({question:v6.VERSIONS.question,generator:v6.VERSIONS.report,analysis:v6.VERSIONS.analysis,reportContent:v6.VERSIONS.content,insightEngine:insights.ENGINE_VERSION,insightCatalog:insights.CATALOG_VERSION,supplement:supplement.SUPPLEMENT_VERSION,supplementContent:supplement.SUPPLEMENT_CONTENT_VERSION,quality:load("quality-v1/index.ts").QUALITY_VERSION,offerPolicy:load("supplement-v1/offer.ts").OFFER_POLICY_VERSION})});\n';
const target=path.join(domain,"release-v61/snapshot.cjs");
if(process.argv.includes("--check")){
 if(fs.readFileSync(target,"utf8")!==output)throw Error("Frozen release differs from current sources; preserve old snapshot and create a NEW release for changed content");
}else{
 if(fs.existsSync(target)&&fs.readFileSync(target,"utf8")!==output)throw Error("Refusing to overwrite frozen release");
 fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,output);
}
console.log(JSON.stringify({modules:modules.size,fingerprint,bytes:Buffer.byteLength(output),mode:process.argv.includes("--check")?"check":"create"}));
