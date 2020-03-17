type OneOfInfrastructureType = keyof typeof load;

// TODO: add webpack magic comments
const load = {
  chromeExtension: async () => (await import('./infrastructures/chromeExtension')).init(chrome),
  chromeRemote: async () => (await import('./infrastructures/chromeRemote')).init(chrome),
  firefoxExtension: async () => (await import('./infrastructures/firefoxExtension')).init(browser),
  firefoxRemote: async () => (await import('./infrastructures/firefoxRemote')).init(browser),
  page: async () => (await import('./infrastructures/page')).init(),
};
const memo: Partial<Record<OneOfInfrastructureType, StorageInfrastructure>> = {};

const loadWithMemo = async (type: OneOfInfrastructureType) => {
  return memo[type] || (memo[type] = await load[type]());
};

type OneOfInfrastructureRequest = 'auto' | 'page';

export const getStorageInfrastructure = async (
  req: OneOfInfrastructureRequest = 'auto',
): Promise<StorageInfrastructure> => {
  if (req === 'auto') {
    if (typeof chrome !== undefined) return loadWithMemo(chrome.runtime.id ? 'chromeExtension' : 'chromeRemote');
    if (typeof browser !== undefined) return loadWithMemo(browser.runtime.id ? 'firefoxExtension' : 'firefoxRemote');
  }
  return loadWithMemo('page');
};
