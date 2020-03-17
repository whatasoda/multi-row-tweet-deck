import { createExtensionMessageSender as MessageSender } from '../../messages';
import { EXTENSION_ID } from '../../constants';

export const init = ({ runtime }: typeof chrome): StorageInfrastructure => ({
  local: {
    get: MessageSender(runtime.sendMessage, EXTENSION_ID, 'storage.local.get'),
    set: MessageSender(runtime.sendMessage, EXTENSION_ID, 'storage.local.set'),
    remove: MessageSender(runtime.sendMessage, EXTENSION_ID, 'storage.local.remove'),
  },
  sync: {
    get: MessageSender(runtime.sendMessage, EXTENSION_ID, 'storage.sync.get'),
    set: MessageSender(runtime.sendMessage, EXTENSION_ID, 'storage.sync.set'),
    remove: MessageSender(runtime.sendMessage, EXTENSION_ID, 'storage.sync.remove'),
  },
});
