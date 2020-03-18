type MessageTypeEntry = [string, object, unknown];

type Sync = StorageInfrastructure['sync'];
type Local = StorageInfrastructure['local'];

type Entries = [
  ['connect', {}, Partial<StorageSync>],
  ['storage.sync.get', Parameters<Sync['get']>, Partial<StorageSync>],
  ['storage.sync.set', Parameters<Sync['set']>, undefined],
  ['storage.sync.remove', Parameters<Sync['remove']>, undefined],
  ['storage.local.get', Parameters<Local['get']>, Partial<StorageLocal>],
  ['storage.local.set', Parameters<Local['set']>, undefined],
  ['storage.local.remove', Parameters<Local['remove']>, undefined],
];

type PickEntry<T extends MessageTypeEntry[], U extends T[number][0]> = Extract<T[number], [U, any, any]>;

type MessageObject<T extends MessageTypeEntry> = { type: T[0]; value: T[1] };
type MessageHandler<T extends MessageTypeEntry> = (value: T[1]) => { payload: T[2] };

type OneOfMessageTypeOf<T extends MessageTypeEntry[]> = T[number][0];

type OneOfMessageOf<T extends MessageTypeEntry[]> = {
  [U in OneOfMessageTypeOf<T>]: MessageObject<PickEntry<T, U>>;
}[OneOfMessageTypeOf<T>];

type HandlersOf<T extends MessageTypeEntry[]> = {
  [U in OneOfMessageTypeOf<T>]: MessageHandler<PickEntry<T, U>>;
};

type SendMessage = (extensionId: string, message: any, responseCallback: (response: any) => void) => void;
interface LastError {
  message?: string;
}
interface Runtime {
  readonly sendMessage: SendMessage;
  readonly lastError: LastError | undefined;
}
type MessageSenderOf<T extends MessageTypeEntry[]> = <U extends T[number][0]>(
  runtime: Runtime,
  extensionId: string,
  type: U,
) => (...args: PickEntry<T, U>[1]) => Promise<PickEntry<T, U>[2]>;

export type OneOfExtensionMessageType = OneOfMessageTypeOf<Entries>;
export type OneOfExtensionMessage = OneOfMessageOf<Entries>;
export type ExtensionMessageHandlers = HandlersOf<Entries>;
export const createExtensionMessageSender = ((runtime, extensionId, type) => {
  return (value) => {
    return new Promise((resolve, reject) => {
      return runtime.sendMessage(extensionId, { type, value }, (response) => {
        if (runtime.lastError) {
          reject(runtime.lastError);
        } else {
          const { payload } = response;
          return resolve(payload);
        }
      });
    });
  };
}) as MessageSenderOf<Entries>;

export const getRuntime = (): Runtime | null => {
  if (typeof chrome !== 'undefined') return chrome.runtime;
  if (typeof browser !== 'undefined') return browser.runtime;
  return null;
};
