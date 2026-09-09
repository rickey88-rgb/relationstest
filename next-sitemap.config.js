const behaviors = require('./content/behaviors.json');
const behaviorPaths = new Set([
  '/beteenden',
  '/digitalt-vald',
  '/ekonomiskt-vald',
  '/metodik',
  '/narcissism-sjalvtest',
  '/narcissism-sjalvtest/test',
  ...behaviors.map(({ slug }) => `/beteenden/${slug}`),
]);

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://relationsvarning.se',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  // Keep legacy entries intact; new content uses the canonical WWW host.
  transform: async (config, path) => ({
    loc: behaviorPaths.has(path) ? `https://www.relationsvarning.se${path}` : path,
    changefreq: config.changefreq,
    priority: config.priority,
    lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    alternateRefs: config.alternateRefs ?? [],
  }),
};
