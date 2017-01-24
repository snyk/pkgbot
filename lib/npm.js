const requestJson = require('./requestJson')
// ---------------------NPM

process.on('uncaughtException', function (err) {
  console.log(err);
  console.log(err.stack);
});


const NPM_REGISTRY = 'https://registry.npmjs.org/';
const sanitisePackage = npmPackage => npmPackage.replace(/\//g, '%2F');
const npmUrl = npmPackage =>
  `${NPM_REGISTRY}${sanitisePackage(npmPackage)}`;
const npmStatsUrl = (npmPackage, period) =>
  `https://api.npmjs.org/downloads/range/${period}/${sanitisePackage(npmPackage)}`;

const snykAuthToken = process.env.SNYK_AUTH_TOKEN;
const snykAPIUrl = name => `https://snyk.io/api/v1/vuln/npm/${name}`;
const getVulns = name => requestJson.requestJson(snykAPIUrl(name), snykAuthToken);

const getNpmStats = name =>
  Promise.all(['last-day', 'last-week', 'last-month']
    .map(period =>
      requestJson.requestJson(npmStatsUrl(name, period))
      .then(({ downloads }) =>
        (downloads || []).reduce((sum, day) => sum + day.downloads, 0))))
    .then(([day, week, month]) => ({ day, week, month }));

module.exports.npmPackage = name => requestJson.requestJson(npmUrl(name));
module.exports.getNpmStats = getNpmStats;
module.exports.getNPMUrl = name =>
  `https://www.npmjs.com/package/${sanitisePackage(name)}`;

module.exports.getVulns = getVulns;

module.exports.getAllNpmStats = name =>
  Promise.all([getNpmStats(name), getVulns(name)]).then(([stats, vuln]) =>
  ({stats, vuln}));
