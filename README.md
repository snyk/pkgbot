[![Snyk logo](https://snyk.io/style/asset/logo/snyk-print.svg)](https://snyk.io)

[![Known Vulnerabilities](https://snyk.io/test/github/snyk/pkgbot/badge.svg)](https://snyk.io/test/github/snyk/pkgbot)

***

# pkgbot
A statistics slack bot for npm packages and ruby gems
The bot will fetch information from [npmjs](https://npmjs.com) or [rubygems](https://rubygems.org) and show it on screen.

## Prerequisites

- Before creating the pkgbot, you need to [create a new Slack bot](https://my.slack.com/services/new/bot) and record your API token, export it as an environment variable named `SLACK_TOKEN`. You can, if you like, also use the [bot](https://github.com/Snyk/pkgbot/blob/master/icon.png) image as your avatar for your bot.

- Please export your Snyk auth token (found [here](https://snyk.io/account/)) to an environment variable named `SNYK_AUTH_TOKEN`

- Please add the following slack [custom emojis](https://my.slack.com/customize/emoji):
```text
:npm: npm.png
:rubygems: ruby.png
:highsev: highsev.png
:medsev: medsev.png
:lowsev: lowsev.png
```
Icons located at the `/icons` directory
## The quick way

You can use the Heroku button below, and add the API token for the bot you created earlier:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Snyk/pkgbot/)

## Manual install and deploy

Using node 6, you can manually run the pkgbot using the following commands:

```bash
$ git clone https://github.com/Snyk/pkgbot.git
$ cd pkgbot
$ npm install
$ npm start
```

## How-to

You can request information in a public channel by calling @pkgbot and stating npm/ruby [package].
Otherwise, in the direct channel you can query information by stating only by stating the package manager and the package.

Channel:
```text
/invite @pkgbot
@pkgbot npm request
@pkgbot ruby actionpack
@pkgbot help
```

Direct Message:
```text
npm moment
ruby httparty
```


### License

[License: Apache License, Version 2.0](LICENSE)
