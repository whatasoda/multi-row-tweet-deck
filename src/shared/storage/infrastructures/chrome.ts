/// <reference types="chrome" />

type Sync = StorageInfrastructure<StorageSync>;
type Local = StorageInfrastructure<StorageLocal>;

const promisify = <T, U>(func: (arg: T, callback: (value?: U) => void) => void) => {
  return (arg: T) => {
    return new Promise<U>((resolve, reject) => {
      return func(arg, (value?: U) => (chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(value)));
    });
  };
};

export const sync: Sync = {
  get: promisify(chrome.storage.sync.get),
  set: promisify(chrome.storage.sync.set),
  remove: promisify(chrome.storage.sync.remove),
};

export const local: Local = {
  get: promisify(chrome.storage.local.get),
  set: promisify(chrome.storage.local.set),
  remove: promisify(chrome.storage.local.remove),
};
