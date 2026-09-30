/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.relationsvarning.se',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  autoLastmod: false,
  changefreq: undefined,
  exclude: [
    '/angest-test/test',
    '/adhd-test/test',
    '/autism-test/test',
    '/audhd-test/test',
    '/hsp-test/test',
    '/ptsd-test/test',
    '/anknytningstest/test',
    '/medberoendetest/test',
    '/narcissism-sjalvtest/test',
  ],
};
