import { createExtensionMessageSender as MessageSender } from '../../messages';
import { EXTENSION_ID } from '../../constants';

export const init = ({ runtime }: typeof browser): StorageInfrastructure => ({
  local: {
    get: MessageSender(runtime, EXTENSION_ID, 'storage.local.get'),
    set: MessageSender(runtime, EXTENSION_ID, 'storage.local.set'),
    remove: MessageSender(runtime, EXTENSION_ID, 'storage.local.remove'),
  },
  sync: {
    get: MessageSender(runtime, EXTENSION_ID, 'storage.sync.get'),
    set: MessageSender(runtime, EXTENSION_ID, 'storage.sync.set'),
    remove: MessageSender(runtime, EXTENSION_ID, 'storage.sync.remove'),
  },
});
