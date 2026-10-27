/* eslint-disable @typescript-eslint/no-require-imports -- Run with node --test after npm run build. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

const root = path.resolve(__dirname, "..");
const host = "https://www.relationsvarning.se";
const slugs = [
  "audhd-utredning-vuxna", "audhd-i-vardagen", "audhd-och-relationer",
  "audhd-pa-jobbet", "audhd-sensorisk-kanslighet", "audhd-och-somn",
  "audhd-och-exekutiva-funktioner", "audhd-och-aterhamtning",
];

function readable(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/\s+/g, " ").trim();
}

const titles = new Set();
const descriptions = new Set();

for (const slug of slugs) {
  test(`built /${slug}: indexable article, sources, links and visible schema`, () => {
    const html = fs.readFileSync(path.join(root, ".next/server/app", `${slug}.html`), "utf8");
    const canonical = [...html.matchAll(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/g)];
    assert.equal(canonical.length, 1);
    assert.equal(canonical[0][1], `${host}/${slug}`);
    assert.match(html, /<meta name="robots" content="index, follow"/);
    assert.doesNotMatch(html, /<meta[^>]+(?:name="robots"|name="googlebot")[^>]+noindex/);
    assert.match(html, new RegExp(`<meta property="og:url" content="${host}/${slug}"`));

    const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    assert.ok(title && description);
    assert.ok(!titles.has(title), "article title must be unique");
    assert.ok(!descriptions.has(description), "article description must be unique");
    titles.add(title);
    descriptions.add(description);
    assert.equal([...html.matchAll(/<h1[\s>]/g)].length, 1);

    const article = html.match(/<article[\s\S]*?<\/article>/)?.[0];
    assert.ok(article);
    assert.match(article, /href="\/audhd"/);
    assert.match(article, /<a[^>]+href="\/audhd-test\/test"[^>]*>Gör AuDHD-testet för vuxna<\/a>/);
    assert.match(article, /Källor kontrollerade 27 oktober 2026/);
    const sourceLinks = new Set([...article.matchAll(/href="(https:\/\/[^\"]+)"/g)]
      .map((match) => match[1]).filter((url) => /1177\.se|socialstyrelsen\.se|vardochinsats\.se/.test(url)));
    assert.ok(sourceLinks.size >= 2, "at least two primary source documents must be visible");
    const internalLinks = new Set([...article.matchAll(/href="(\/[^\"]*)"/g)].map((match) => match[1]));
    assert.ok(internalLinks.size >= 4, "contextual and related links must connect the article");
    for (const href of internalLinks) {
      const route = href.split(/[?#]/)[0];
      assert.ok(fs.existsSync(path.join(root, "app", route.slice(1), "page.tsx")), `broken internal link: ${href}`);
    }

    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .flatMap((match) => JSON.parse(match[1]));
    const articleSchema = schemas.find((item) => item["@type"] === "Article");
    assert.equal(articleSchema?.mainEntityOfPage?.["@id"], `${host}/${slug}`);
    const faq = schemas.find((item) => item["@type"] === "FAQPage");
    assert.ok(faq?.mainEntity.length > 0);
    const visible = readable(article);
    for (const question of faq.mainEntity) {
      assert.ok(visible.includes(question.name), "FAQ question must be visible");
      assert.ok(visible.includes(question.acceptedAnswer.text), "FAQ answer must be visible");
    }
  });
}

test("sitemap includes all eight support articles and keeps test execution excluded", () => {
  const xml = fs.readFileSync(path.join(root, "public/sitemap-0.xml"), "utf8");
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(new Set(urls).size, urls.length, "no duplicate URLs");
  for (const slug of slugs) assert.ok(urls.includes(`${host}/${slug}`));
  for (const slug of ["audhd", "audhd-test", "audhd-kvinnor", "audhd-masking", "audhd-symtom-vuxna"]) {
    assert.ok(urls.includes(`${host}/${slug}`), `existing landing remains in sitemap: ${slug}`);
  }
  assert.ok(!urls.includes(`${host}/audhd-test/test`));
  assert.ok(urls.every((url) => url.startsWith(`${host}/`) || url === host));
});
