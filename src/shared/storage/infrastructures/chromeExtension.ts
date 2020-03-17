/// <reference types="chrome" />

export const init = ({ runtime, storage }: typeof chrome): StorageInfrastructure => {
  const promisify = <T, U>(func: (arg: T, callback: (value?: U) => void) => void) => {
    return (arg: T) => {
      return new Promise<U>((resolve, reject) => {
        return func(arg, (value?: U) => (runtime.lastError ? reject(runtime.lastError) : resolve(value)));
      });
    };
  };

  return {
    sync: {
      get: promisify(storage.sync.get),
      set: promisify(storage.sync.set),
      remove: promisify(storage.sync.remove),
    },

    local: {
      get: promisify(storage.local.get),
      set: promisify(storage.local.set),
      remove: promisify(storage.local.remove),
    },
  };
};
