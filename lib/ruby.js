const requestJson = require('./requestJson');

const RUBY_API = 'https://rubygems.org/api/v1/gems/';
const rubyUrl = name => `${RUBY_API}/${name}.json`;
const getRubyStats = name => requestJson.requestJson(rubyUrl(name));

const snykAPIUrl = name => `https://snyk.io/api/v1/vuln/rubygems/${name}`;
const getVulns = name => requestJson.requestJson(snykAPIUrl(name));


module.exports.getRubyStats = getRubyStats;
module.exports.getRubyUrl = rubyUrl;
module.exports.getVulns = getVulns;
