import { Version } from '../src/manifest/dynamic';
import { MSG, Permissions } from '../src/manifest/helpers';
import { Manifest } from '../src/manifest/interface';
import ValLoaderCode from '../src/utils/val-loader-helper';

const key =
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAi/RbEi+P4lE23YlS/8Xecyly5SV2HFAbrObPQkHFJ4C1wmh4nFPh66qc4nPlOVfwxdWTbuDZwkJKvMgxrmXMOfk0+TpCH8gUC6qTmWsqtfNCmjRT1uyt2wP2Czt8RNNERRvcLWpwCzztF2DiO3mVK0tR2V2vYDWadNqhrmDq3UNkWn6x86tWPzsifYU7R5HgBaUc76Fujofyt5g9PedWqHBsBEousP608H4zQvsEPPFI/kQrBJacpzrCDOyXQtLLLnPxZ3aJp5n4Ff/AVeAPg5LYsDBIJuBnpeHsFQP5qrAI5DdIcxIcbRJO0YQgUUQALoLRc72kg8bW4usbaUypRQIDAQAB';

const manifest = async (): Promise<Manifest> => ({
  manifest_version: 2,
  name: 'Multi Row TweetDeck',
  version: await Version(),
  author: 'whatasoda',
  default_locale: 'en',
  description: MSG('description'),
  minimum_chrome_version: '60',
  key,
  icons: {
    16: 'icons/icon-16.png',
    48: 'icons/icon-48.png',
    128: 'icons/icon-128.png',
  },
  content_scripts: [
    {
      matches: ['https://tweetdeck.twitter.com/*'],
      js: ['content.js'],
    },
  ],
  page_action: {
    default_title: 'Multi Row TweetDeck',
    default_popup: '',
  },
  background: {
    scripts: ['background.js'],
  },

  permissions: Permissions(['activeTab', 'declarativeContent', 'storage', 'tabs']),
  web_accessible_resources: ['style.css'],
});

export = ValLoaderCode(manifest);
