import { locales } from '../locales';

const key =
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAi/RbEi+P4lE23YlS/8Xecyly5SV2HFAbrObPQkHFJ4C1wmh4nFPh66qc4nPlOVfwxdWTbuDZwkJKvMgxrmXMOfk0+TpCH8gUC6qTmWsqtfNCmjRT1uyt2wP2Czt8RNNERRvcLWpwCzztF2DiO3mVK0tR2V2vYDWadNqhrmDq3UNkWn6x86tWPzsifYU7R5HgBaUc76Fujofyt5g9PedWqHBsBEousP608H4zQvsEPPFI/kQrBJacpzrCDOyXQtLLLnPxZ3aJp5n4Ff/AVeAPg5LYsDBIJuBnpeHsFQP5qrAI5DdIcxIcbRJO0YQgUUQALoLRc72kg8bW4usbaUypRQIDAQAB';
const id = '{3aa20e02-b45e-4d90-989a-8999e9ca4633}';
const {
  npm_package_version,
  npm_package_author_name,
  npm_package_author_email,
  npm_lifecycle_event = '',
} = process.env;

const isDev = npm_lifecycle_event.startsWith('dev');

const version = npm_package_version || '0.0.0';
const author = [npm_package_author_name!, npm_package_author_email!].filter(Boolean).join(' ');

const page = isDev ? 'http://localhost/*' : 'https://multirow.page/*';

const createManifest = (): chrome.runtime.Manifest => ({
  manifest_version: 2,
  key,
  author,
  version,
  name: 'MultiRow TweetDeck',
  homepage_url: 'https://multirow.page/',
  default_locale: 'en',
  description: locales.m.description,
  minimum_chrome_version: '60',
  icons: {
    16: 'icons/icon-16.png',
    48: 'icons/icon-48.png',
    128: 'icons/icon-128.png',
  },
  content_scripts: [
    {
      matches: ['https://tweetdeck.twitter.com/*'],
      js: ['com.twitter.tweetdeck.js'],
    },
    {
      matches: [page],
      js: ['page.multirow.js'],
      run_at: 'document_start',
    },
  ],
  background: {
    scripts: ['background.js'],
  },
  externally_connectable: {
    matches: [page],
  },
  permissions: ['storage', 'tabs', page],
  browser_specific_settings: { gecko: { id } },
});

module.exports = (): ValLoader => ({ code: JSON.stringify(createManifest()), cacheable: true });
