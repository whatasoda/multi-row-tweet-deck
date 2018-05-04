import ExtensionManifest from './ExtensionManifest'
const { version } = require('../package.json')

const manifest: ExtensionManifest = {
  name: 'Multi Row TweetDeck',
  icons: {
    16    : 'icons/icon-16.png',
    48    : 'icons/icon-48.png',
    128   : 'icons/icon-128.png'
  },
  version: version,
  description: 'Google Chrome Extension for multi row view of TweetDeck',
  manifest_version: 2,
  content_scripts: [
    {
      matches: ['https://tweetdeck.twitter.com/*'],
      js: ['content.js']
    }
  ],
  permissions: [
    'storage'
  ]
}
export default manifest
