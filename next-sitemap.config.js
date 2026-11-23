/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.relationsvarning.se',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  autoLastmod: false,
  changefreq: undefined,
  transform: async (_config, path) => {
    if (path === '/du-tanker-sonder-dig-sjalv' && process.env.OVERTHINKING_BOOK_CHECKOUT_ENABLED !== 'true') return null;
    if (path === '/persona' || path.startsWith('/persona-v61') || path.startsWith('/persona/dev-') || path === '/icon.png') return null;
    return { loc: path };
  },
  additionalPaths: async () => [
    { loc: '/audhd-bok' },
    { loc: '/autism-bok' },
    { loc: '/adhd-deluxe' },
  ],
  exclude: [
    "/persona-v61", "/persona-v61/*",
    "/persona",
    "/persona/test",
    "/persona/dev-report",
    '/juridisk-information',
    '/autism-bok/tack',
    '/autism-bok/tack/*',
    '/du-tanker-sonder-dig-sjalv/tack',
    '/nyhetsbrev/bekrafta',
    '/nyhetsbrev/avsluta',
    '/angest-test/test',
    '/adhd-test/test',
    '/autism-test/test',
    '/audhd-test/test',
    '/iq-test/test',
    '/hsp-test/test',
    '/ptsd-test/test',
    '/anknytningstest/test',
    '/medberoendetest/test',
    '/narcissism-sjalvtest/test',
    '/adhd-deluxe/tack/fel',
  ],
};
