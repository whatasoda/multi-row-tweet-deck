/// <reference types="firefox-webext-browser" />

type Sync = StorageInfrastructure<StorageSync>;
type Local = StorageInfrastructure<StorageLocal>;

export const sync: Sync = {
  get: browser.storage.sync.get as Sync['get'],
  set: browser.storage.sync.set as Sync['set'],
  remove: browser.storage.sync.remove as Sync['remove'],
};

export const local: Local = {
  get: browser.storage.local.get as Local['get'],
  set: browser.storage.local.set as Local['set'],
  remove: browser.storage.local.remove as Local['remove'],
};
