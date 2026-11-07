/* eslint-disable @typescript-eslint/no-require-imports -- offline synthetic artifacts only, never a public application route. */
const fs=require("node:fs"),path=require("node:path"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,".."),output=path.join(root,".artifacts/persona-release/samples");
const styles=new Proxy({}, {get:(_,key)=>String(key)});
const load=require("../app/autism-test/test/test-loader.cjs")({"./report.module.css":{default:styles}});
const Report=load(path.join(root,"app/persona/report/PersonaReportView.tsx")).default;
const api=load(path.join(root,"app/persona/_domain/index.ts")),{payloadFor}=require("../tests/persona/runtime.cjs");
fs.mkdirSync(output,{recursive:true});
const css=fs.readFileSync(path.join(root,"app/persona/report/report.module.css"),"utf8").replaceAll(":global(body)","body");
for(let i=0;i<5;i++) {
  const html=renderToStaticMarkup(React.createElement(Report,{report:api.buildPersonaReport(payloadFor(load,i))}));
  fs.writeFileSync(path.join(output,`persona-exempel-${i+1}.html`),`<!doctype html><html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PERSONA – syntetiskt exempel ${i+1}</title><style>body{margin:0;padding:16px;background:#101626;color:#F5F0E7;font-family:Arial,sans-serif}body>p{text-align:center;font-size:12px}${css}</style></head><body><p>Syntetiskt exempelsvar ${i+1} – ingen verklig kundrapport. Öppna svarunderlagen för att granska slutsatserna.</p>${html}<script>document.querySelectorAll('.printButton').forEach(button=>button.addEventListener('click',()=>window.print()))</script></body></html>`);
}
console.log("Rendered 5 offline synthetic samples in "+output);
