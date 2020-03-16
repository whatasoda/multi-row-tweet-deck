type Sync = StorageInfrastructure<StorageSync>;
type Local = StorageInfrastructure<StorageLocal>;

// TODO: add webpack magic comments
export const getStorageInfrastructure = async (): Promise<{ sync: Sync; local: Local } | undefined> => {
  if (typeof chrome !== 'undefined') return await import('./infrastructures/chrome');
  if (typeof browser !== 'undefined') return await import('./infrastructures/firefox');
};
