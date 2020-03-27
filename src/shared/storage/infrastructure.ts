import { MessageSender } from '../messages';
import { EXTENSION_ID } from '../constants';

const memo: Partial<Record<'remote' | 'owned' | 'page', StorageInfrastructure>> = {};

export const getStorageInfrastructure = (req: 'auto' | 'page' = 'auto'): StorageInfrastructure => {
  if (req === 'auto' && typeof browser !== undefined) {
    if (browser.runtime.id) {
      return (memo.owned = memo.owned || createOwned());
    } else {
      return (memo.remote = memo.remote || createRemote());
    }
  } else {
    return (memo.page = memo.page || createPage());
  }
};

const createRemote = (): StorageInfrastructure => ({
  local: {
    get: MessageSender(EXTENSION_ID, 'storage.local.get'),
    set: MessageSender(EXTENSION_ID, 'storage.local.set'),
    remove: MessageSender(EXTENSION_ID, 'storage.local.remove'),
  },
  sync: {
    get: MessageSender(EXTENSION_ID, 'storage.sync.get'),
    set: MessageSender(EXTENSION_ID, 'storage.sync.set'),
    remove: MessageSender(EXTENSION_ID, 'storage.sync.remove'),
  },
});

const createOwned = (): StorageInfrastructure => {
  const { runtime, storage } = browser;

  const promisify = <T, U>(func: (arg: T, callback: (value?: U) => void) => void, self: any) => {
    return (arg: T) => {
      return new Promise<U>((resolve, reject) => {
        return func.apply(self, [arg, (value?: U) => (runtime.lastError ? reject(runtime.lastError) : resolve(value))]);
      });
    };
  };

  return {
    sync: {
      get: promisify(storage.sync.get, storage.sync),
      set: promisify(storage.sync.set, storage.sync),
      remove: promisify(storage.sync.remove, storage.sync),
    },

    local: {
      get: promisify(storage.local.get, storage.local),
      set: promisify(storage.local.set, storage.local),
      remove: promisify(storage.local.remove, storage.local),
    },
  };
};

const createPage = (): StorageInfrastructure => {
  const storageKeyMap: Record<keyof StorageInfrastructure, string> = {
    sync: `${EXTENSION_ID}:sync`,
    local: `${EXTENSION_ID}:local`,
  };

  const arrify = (input: string | string[]) => (typeof input === 'string' ? [input] : input);

  const createArea = <T extends keyof StorageInfrastructure>(type: T): StorageInfrastructure[T] => {
    const storageKey = storageKeyMap[type];

    const base = (callback: (curr: Record<string, any>) => Record<string, any> | void) => {
      const curr = JSON.parse(localStorage.getItem(storageKey) || '{}');
      const next = callback(curr);
      if (next) localStorage.setItem(storageKey, JSON.stringify(next));
      return curr;
    };

    const get = (keys: string | string[] | object | null) => {
      if (keys === null) {
        return Promise.resolve(base(() => {}));
      } else {
        const keyList = typeof keys === 'object' && !Array.isArray(keys) ? Object.keys(keys) : arrify(keys);
        const initial = typeof keys === 'object' && !Array.isArray(keys) ? keys : {};

        const curr = base(() => {});
        const picked = keyList.reduce<Record<string, any>>((acc, key) => {
          if (key in curr) acc[key] = curr[key];
          return acc;
        }, initial);

        return Promise.resolve(picked);
      }
    };

    const set = (next: Record<string, any>) => {
      base((curr) => ({ ...curr, ...next }));
      return Promise.resolve();
    };

    const remove = (keys: string | string[]) => {
      const removal = arrify(keys);
      base((curr) => {
        const next = { ...curr };
        removal.forEach((key) => delete next[key]);
        return next;
      });
      return Promise.resolve();
    };

    return { get, set, remove };
  };

  return {
    local: createArea('local'),
    sync: createArea('sync'),
  };
};
