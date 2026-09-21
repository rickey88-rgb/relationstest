import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const HOST = "www.relationsvarning.se";
const ORIGIN = `https://${HOST}`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const KEY_FILE = "37204d60241ae6a76d1356cd09f52bb4.txt";
const KEY_LOCATION = `${ORIGIN}/${KEY_FILE}`;
const SITEMAP_FILE = resolve("public", "sitemap-0.xml");
const MAX_URLS_PER_REQUEST = 10_000;
const TIMEOUT_MS = 15_000;

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function normalizeUrl(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`Ogiltig URL: ${raw}`);
  }
  if (url.protocol !== "https:" || url.hostname !== HOST || url.port || url.username || url.password) {
    throw new Error(`URL:en måste ligga på ${ORIGIN}: ${raw}`);
  }
  if (url.search || url.hash) throw new Error(`Skicka en ren canonical-URL utan query eller fragment: ${raw}`);
  return url.href.replace(/\/$/, "") || ORIGIN;
}

async function sitemapUrls() {
  let xml;
  try {
    xml = await readFile(SITEMAP_FILE, "utf8");
  } catch (error) {
    throw new Error(`Kunde inte läsa ${SITEMAP_FILE}. Kör npm run build först.`, { cause: error });
  }
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => normalizeUrl(decodeXml(match[1].trim())))
    .filter((url) => !/\.[a-z0-9]{2,5}$/i.test(new URL(url).pathname));
  if (!urls.length) throw new Error(`Inga URL:er hittades i ${SITEMAP_FILE}.`);
  return [...new Set(urls)];
}

async function indexNowKey() {
  const keyPath = resolve("public", KEY_FILE);
  let key;
  try {
    key = (await readFile(keyPath, "utf8")).trim();
  } catch (error) {
    throw new Error(`IndexNow-nyckeln saknas: ${keyPath}`, { cause: error });
  }
  if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) throw new Error("IndexNow-nyckeln har ogiltigt format.");
  if (`${key}.txt` !== KEY_FILE) throw new Error("IndexNow-nyckeln matchar inte nyckelfilens namn.");
  return key;
}

function chunks(items, size) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size));
}

async function submit(urls, key) {
  for (const [index, urlList] of chunks(urls, MAX_URLS_PER_REQUEST).entries()) {
    let response;
    try {
      response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host: HOST, key, keyLocation: KEY_LOCATION, urlList }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      throw new Error(`IndexNow-anrop ${index + 1} misslyckades eller tog mer än ${TIMEOUT_MS / 1000} sekunder.`, { cause: error });
    }
    if (!response.ok) {
      const details = (await response.text()).slice(0, 500).trim();
      throw new Error(`IndexNow svarade med HTTP ${response.status}${details ? `: ${details}` : ""}`);
    }
    console.log(`IndexNow tog emot batch ${index + 1} med ${urlList.length} URL:er (HTTP ${response.status}).`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const unknownOptions = args.filter((arg) => arg.startsWith("--") && arg !== "--dry-run");
  if (unknownOptions.length) throw new Error(`Okänd flagga: ${unknownOptions.join(", ")}`);

  const available = await sitemapUrls();
  const requested = args.filter((arg) => !arg.startsWith("--"));
  if (requested.length > 1) throw new Error("Ange högst en enskild URL, eller ingen URL för att använda hela sitemap-filen.");

  const urls = requested.length ? [normalizeUrl(requested[0])] : available;
  if (requested.length && !available.includes(urls[0])) {
    throw new Error("URL:en finns inte i aktuell sitemap och skickas därför inte till IndexNow.");
  }

  const key = await indexNowKey();
  if (dryRun) {
    console.log(`Dry-run: ${urls.length} indexerbara URL:er skulle skickas till ${ENDPOINT}.`);
    for (const url of urls) console.log(url);
    console.log("Inget nätverksanrop gjordes.");
    return;
  }

  console.log(`Skickar ${urls.length} URL:er från aktuell sitemap till IndexNow.`);
  await submit(urls, key);
}

main().catch((error) => {
  console.error(`IndexNow: ${error.message}`);
  process.exitCode = 1;
});
