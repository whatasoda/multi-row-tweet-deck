/// <reference types="firefox-webext-browser" />

type Sync = StorageInfrastructure['sync'];
type Local = StorageInfrastructure['local'];

export const init = ({ storage }: typeof browser): StorageInfrastructure => ({
  sync: {
    get: storage.sync.get as Sync['get'],
    set: storage.sync.set as Sync['set'],
    remove: storage.sync.remove as Sync['remove'],
  },
  local: {
    get: storage.local.get as Local['get'],
    set: storage.local.set as Local['set'],
    remove: storage.local.remove as Local['remove'],
  },
});
