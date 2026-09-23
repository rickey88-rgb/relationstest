/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.relationsvarning.se',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: [
    '/angest-test/test',
    '/adhd-test/test',
    '/autism-test/test',
    '/anknytningstest/test',
    '/medberoendetest/test',
    '/narcissism-sjalvtest/test',
    '/psykisk-misshandel-relation/test',
  ],
};
