const npm = require('./npm');
const ruby = require('./ruby');
const SlackBot = require('slackbots');
const semver = require('semver');
const moment = require('moment');

const HELP_MESSAGE = `:speech_balloon:
Hey, I'm Pkgbot! I'll help you get stats for npm packages and ruby gems, so you don't have to!
To start, just call me with \`@pkgbot\` , followed by npm or ruby, and the package name. Like this:
\`@pkgbot\` npm mustache
\`@pkgbot\` ruby actionpack
You can also ask for help by typing \`help\``;
const WELCOME_MESSAGE = 'Hey! I\'m awake! :coffee:';

const token = process.env.SLACK_TOKEN;
const bot = new SlackBot({
  token: token,
  name: 'pkgbot'
});


function handleNPMPackageRequest(name) {
  return npm.npmPackage(name).then(pkg =>
    npm.getAllNpmStats(name).then(result =>
      Object.assign(pkg, result)));
}
function handleRubyGemRequest(name) {
  return ruby.getRubyStats(name)
}

const handleMessageEvent = event => {
  if (event.username !== 'pkgbot') {
    let { channel, text } = event;
    if (!channel.startsWith('D')) {
      if (!text.includes(`<@${bot.$id}>`)) {
        return;
      }
      text = text.replace(`<@${bot.$id}>`, '').trim();
    }
    switch (text.trim()) {
    case 'help':
      return bot.postMessage(channel, HELP_MESSAGE);
    default:
      const command = text.trim().split(' ');
      const manager = command[0];
      const name = command[1];
      if (manager === 'npm') {
        return handleNPMPackageRequest(name).then(pkg => {
          const { description, versions, time, homepage, stats, vuln } = pkg;
          const { day, week, month } = stats;
          const { numDependencies, severityMap } = vuln;
          function npmSeverity(npmDownloads) {
            if (npmDownloads < 500) {
              return 'Lowest';
            } else if (npmDownloads < 10000) {
              return 'Low';
            } else if (npmDownloads < 100000) {
              return 'Medium';
            } else if (npmDownloads < 500000) {
              return 'High';
            } else {
              return 'Highest';
            }
          }
          bot.postMessage(channel, 'Here is what I found for you:', {
            icon_url: 'https://res.cloudinary.com/snyk/image/upload/v1468845142/logo/snyk-avatar.png',
            attachments: [
              {
                color: '#cb3837',
                pretext: ':npm:',
                title: `${name}`,
                title_link: `${npm.getNPMUrl(name)}`,
                mrkdwn_in: ['text', 'fields'],
                text: `_${description}_`,
                fields: [
                  {
                    title: 'Latest Releases',
                    value: `${semver.rsort(Object.keys(versions)).slice(0, 3).map(v => `\`${v}\` ${moment(time[v]).fromNow()}`).join('\n')}`,
                    short: true
                  },
                  {
                    title: 'Number of Releases',
                    value: `${Object.keys(versions).length}`,
                    short: true
                  },
                  {
                    title: 'Downloads',
                    value: `Day: ${day}\nWeek: ${week}\nMonth: ${month}`,
                    short: true
                  },
                  {
                    title: 'Popularity',
                    value: `${npmSeverity(month)}`,
                    short: true
                  }
                ],
                footer: `<${homepage}|Github Repo> `
              },
              {
                color: '#222049',
                pretext: ':snyk:',
                title: 'Snyk',
                title_link: `https://snyk.io/test/npm/${name}`,
                mrkdwn_in: ['text', 'fields'],
                fields: [
                  {
                    title: 'Dependencies',
                    value: numDependencies,
                    short: true
                  },
                  {
                    title: 'Vulnerabilities',
                    value: `<https://snyk.io/test/npm/${name}|:highsev::${severityMap.high} :medsev::${severityMap.medium} :lowsev::${severityMap.low}>`,
                    short: true
                  }
                ],
                footer: `<https://snyk.io/test/npm/${name}|Show More information>`
              }
            ]
          });
        }).catch(console.error);
      } else if (manager === 'ruby') {
        return handleRubyGemRequest(name).then(pkg => {
          const { info, downloads, version, project_uri, homepage_uri } = pkg;
          function rubySeverity(rubyDownloads) {
            if (rubyDownloads < 10000) {
              return 'Lowest';
            } else if (rubyDownloads < 500000) {
              return 'Low';
            } else if (rubyDownloads < 50000000) {
              return 'Medium';
            } else if (rubyDownloads < 100000000) {
              return 'High';
            } else {
              return 'Highest';
            }
          }

          bot.postMessage(channel, 'Here is what I found for you:', {
            icon_url: 'https://res.cloudinary.com/snyk/image/upload/v1468845142/logo/snyk-avatar.png',
            attachments: [
              {
                color: '#cb3837',
                pretext: ':rubygem:',
                title: `${name}`,
                title_link: `${project_uri}`,
                mrkdwn_in: ['text', 'fields'],
                text: `_${info}_`,
                fields: [
                  {
                    title: 'Latest Releases',
                    value: `${version}`,
                    short: false
                  },
                  {
                    title: 'Total Downloads',
                    value: `${downloads}`,
                    short: true
                  },
                  {
                    title: 'Popularity',
                    value: `${rubySeverity(downloads)}`,
                    short: true
                  }
                ],
                footer: `<${homepage_uri}|Github Repo> `
              }
            ]
          });
        }).catch(console.error);
      } else {
        return bot.postMessage(channel, HELP_MESSAGE);
      }
    }
  }
};

function handleEvent(event) {
  switch (event.type) {
  case 'message': return handleMessageEvent(event);
  }
}

bot.on('start', () => {
  bot.on('message', handleEvent);
  bot.getUserId('pkgbot').then(id => { bot.$id = id });
  bot.postMessageToChannel('statstest', WELCOME_MESSAGE);
});

module.exports = bot;
