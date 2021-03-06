import { getStorageInfrastructure } from '../../../shared/storage/infrastructure';
import { ExtensionMessageHandlers, OneOfExtensionMessage } from '../../../shared/messages';
import { isFirefox } from '../../../shared/constants';

const match = process.env.NODE_ENV === 'production' ? 'https://multirow.page/' : 'http://localhost:8080/';

export const initRemoteInfrastructure = () => {
  const { local, sync } = getStorageInfrastructure('auto');

  const handlers: ExtensionMessageHandlers = {
    'storage.local.get': async (args) => ({ payload: await local.get(...args) }),
    'storage.local.set': async (args) => ({ payload: void (await local.set(...args)) }),
    'storage.local.remove': async (args) => ({ payload: void (await local.remove(...args)) }),
    'storage.sync.get': async (args) => ({ payload: await sync.get(...args) }),
    'storage.sync.set': async (args) => ({ payload: void (await sync.set(...args)) }),
    'storage.sync.remove': async (args) => ({ payload: void (await sync.remove(...args)) }),
    connect: () => ({ payload: undefined }),
  };

  const evt = isFirefox ? browser.runtime.onMessage : browser.runtime.onMessageExternal;
  evt.addListener((message: OneOfExtensionMessage, sender, sendResponse) => {
    const { url = '' } = sender;

    if (url.startsWith(match)) {
      Promise.resolve().then(async () => {
        sendResponse(await handlers[message.type]?.(message.value as any));
      });
      return true;
    }
  });
};
