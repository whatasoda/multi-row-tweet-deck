import { locales } from './locales';

const key =
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAi/RbEi+P4lE23YlS/8Xecyly5SV2HFAbrObPQkHFJ4C1wmh4nFPh66qc4nPlOVfwxdWTbuDZwkJKvMgxrmXMOfk0+TpCH8gUC6qTmWsqtfNCmjRT1uyt2wP2Czt8RNNERRvcLWpwCzztF2DiO3mVK0tR2V2vYDWadNqhrmDq3UNkWn6x86tWPzsifYU7R5HgBaUc76Fujofyt5g9PedWqHBsBEousP608H4zQvsEPPFI/kQrBJacpzrCDOyXQtLLLnPxZ3aJp5n4Ff/AVeAPg5LYsDBIJuBnpeHsFQP5qrAI5DdIcxIcbRJO0YQgUUQALoLRc72kg8bW4usbaUypRQIDAQAB';

const { npm_package_version, npm_package_author_name, npm_package_author_email } = process.env;

const version = npm_package_version || '0.0.0';
const author = [npm_package_author_name!, npm_package_author_email!].filter(Boolean).join(' ');

const createManifest = async (): Promise<chrome.runtime.Manifest> => ({
  manifest_version: 2,
  key,
  author,
  version,
  name: 'Multi Row TweetDeck',
  homepage_url: 'https://multirow.page/',
  default_locale: 'en',
  description: locales.m.description,
  minimum_chrome_version: '60',
  icons: {
    16: (await import('../../../assets/icons/icon-16.png')).default,
    48: (await import('../../../assets/icons/icon-48.png')).default,
    128: (await import('../../../assets/icons/icon-128.png')).default,
  },
  content_scripts: [
    {
      matches: ['https://tweetdeck.twitter.com/*'],
      js: ['com.twitter.tweetdeck.js'],
    },
  ],
  background: {
    scripts: ['background.js'],
  },
  permissions: ['storage', 'tabs'],
});

module.exports = createManifest().then((manifest) => ({ code: JSON.stringify(manifest) }));
