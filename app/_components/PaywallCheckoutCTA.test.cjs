/* eslint-disable @typescript-eslint/no-require-imports -- synthetic consent interaction and all-product regression. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const createLoader=require('../autism-test/test/test-loader.cjs');
let purchases=0,prevented=0,validations=0;
const checkbox={checked:false,reportValidity:()=>{validations++;return false;}};
const load=createLoader({react:{...React,useRef:()=>({current:checkbox})},
 'next/image':{__esModule:true,default:({src,alt})=>React.createElement('img',{src,alt})}});
const CTA=load(path.join(__dirname,'PaywallCheckoutCTA.tsx')).default;
const tree=CTA({onClick:()=>{purchases++;}}),html=renderToStaticMarkup(tree);
assert.equal(tree.type,'form');
assert(html.includes('type="checkbox"')&&html.includes('required=""'));
assert(!/\schecked(?:=|\s|>)/.test(html),'consent starts unchecked');
assert(html.includes('Jag samtycker till att mina testsvar, inklusive eventuella hälsouppgifter, behandlas för att skapa och leverera min analys.'));
assert(html.includes('href="/integritet"')&&html.includes('target="_blank"'));
assert(html.indexOf('data-checkout-consent')<html.indexOf('data-flow="cta"'));
assert(!html.includes('Gäståtkomst i högst sju dagar.')&&!html.includes('Kontosparning är ett separat, frivilligt val.'));
assert(html.includes('type="submit"'));
const submit=()=>tree.props.onSubmit({preventDefault:()=>{prevented++;}});
submit();assert.equal(purchases,0);assert.equal(validations,1);
checkbox.checked=true;submit();assert.equal(purchases,1,'explicit checked consent permits existing checkout callback');
checkbox.checked=false;submit();assert.equal(purchases,1,'withdrawing before purchase blocks checkout again');
assert.equal(prevented,3,'form never sends sensitive inputs to the website server');
const root=path.resolve(__dirname,'..');
const privacy=fs.readFileSync(path.join(root,'integritet/page.tsx'),'utf8');
assert(privacy.includes('Gäståtkomsten gäller högst sju dagar.')&&privacy.includes('Efter köpet kan du separat och frivilligt samtycka'));
const routes=['adhd-test/test','autism-test/test','audhd-test/test','hsp-test/test','angest-test/test','ptsd-test/test','iq-test/test',
 'narcissism-sjalvtest/test','test','anknytningstest/test','medberoendetest/test','gaslightingtest/test','narcissist-i-en-relation/test','traumabindningtest/test','psykisk-misshandel-relation/test'];
for(const route of routes){const page=fs.readFileSync(path.join(root,route,'page.tsx'),'utf8');
 assert.equal((page.match(/<PaywallCheckoutCTA\b/g)||[]).length,1,route+' uses the shared consent-protected CTA');
 assert(!/<form\b/.test(page),route+' must not nest the checkout form');}
function scan(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory())scan(file);
 else if(/\.(tsx?|jsx?)$/.test(item.name))assert(!/\bconfirm\s*\(/.test(fs.readFileSync(file,'utf8')),'no blocking confirm in '+path.relative(root,file));}}
scan(__dirname);for(const route of routes)scan(path.join(root,route));
const hook=fs.readFileSync(path.join(__dirname,'useTestAccountCheckout.ts'),'utf8');
assert(hook.includes('startDirectCheckout(directModel.product'));
const client=fs.readFileSync(path.join(root,'_lib/testAccounts/directClient.ts'),'utf8');
assert(client.includes('consent: guestProcessingConsentVersion'));
const store=fs.readFileSync(path.join(root,'_lib/testAccounts/store.server.ts'),'utf8');
assert(store.includes('guestConsent: { version: guestConsent, acceptedAt: new Date().toISOString() }'));
console.log('PASS: unchecked/required consent, no checkout until consent, revocation, privacy link, no form data to Vercel, all 15 paywalls, no confirm, existing encrypted version/timestamp registration.');
