import { sendMessageWithPolyfill } from './firefox-polyfill';
import { isFirefox } from './constants';

type MessageTypeEntry = [string, any[], unknown];

type Sync = StorageInfrastructure['sync'];
type Local = StorageInfrastructure['local'];

type Entries = [
  ['connect', [], undefined],
  ['storage.sync.get', Parameters<Sync['get']>, Partial<StorageSync>],
  ['storage.sync.set', Parameters<Sync['set']>, undefined],
  ['storage.sync.remove', Parameters<Sync['remove']>, undefined],
  ['storage.local.get', Parameters<Local['get']>, Partial<StorageLocal>],
  ['storage.local.set', Parameters<Local['set']>, undefined],
  ['storage.local.remove', Parameters<Local['remove']>, undefined],
];

type PickEntry<T extends MessageTypeEntry[], U extends T[number][0]> = Extract<T[number], [U, any, any]>;

type MessageObject<T extends MessageTypeEntry> = { type: T[0]; value: T[1] };
type MessageHandler<T extends MessageTypeEntry> = (value: T[1]) => { payload: T[2] } | Promise<{ payload: T[2] }>;

type OneOfMessageTypeOf<T extends MessageTypeEntry[]> = T[number][0];

type OneOfMessageOf<T extends MessageTypeEntry[]> = {
  [U in OneOfMessageTypeOf<T>]: MessageObject<PickEntry<T, U>>;
}[OneOfMessageTypeOf<T>];

type OneOfMessagePayloadOf<T extends MessageTypeEntry[]> = T[number][2];

type HandlersOf<T extends MessageTypeEntry[]> = {
  [U in OneOfMessageTypeOf<T>]: MessageHandler<PickEntry<T, U>>;
};

type MessageSenderOf<T extends MessageTypeEntry[]> = <U extends T[number][0]>(
  extensionId: string,
  type: U,
) => (...args: PickEntry<T, U>[1]) => Promise<PickEntry<T, U>[2]>;

export type OneOfExtensionMessageType = OneOfMessageTypeOf<Entries>;
export type OneOfExtensionMessage = OneOfMessageOf<Entries>;
export type OneOfExtensionMessagePayload = OneOfMessagePayloadOf<Entries>;
export type ExtensionMessageHandlers = HandlersOf<Entries>;

export const MessageSender = ((extensionId, type) => {
  if (typeof browser === 'undefined') {
    if (isFirefox) {
      return async (...value) => (await sendMessageWithPolyfill({ type, value })).payload;
    } else {
      return () => Promise.reject();
    }
  }

  return (...value) => {
    return new Promise((resolve, reject) => {
      return browser.runtime.sendMessage(extensionId, { type, value }, (response) => {
        const { lastError } = browser.runtime;
        lastError ? reject(lastError) : resolve(response.payload);
      });
    });
  };
}) as MessageSenderOf<Entries>;
