const date = (type: 'now' | 'zero' = 'now') => {
  if (type === 'zero') return new Date(0).toISOString();
  return new Date().toISOString();
};

const SYNC_DEFAULT: StorageSync = { v3: { profiles: {} } };
const LOCAL_DEFAULT: StorageLocal = { v3: { selectedProfile: null } };

export const createRepository = ({ local, sync }: StorageInfrastructure): StorageRepository => {
  const getLegacyProfiles = async () => (await sync.get('profiles')).profiles ?? undefined;
  const getLegacySelectedProfileId = async () => (await local.get('currentProfile')).currentProfile ?? undefined;
  const cleanLegacyProfiles = async () => {
    await Promise.all([sync.remove('profiles'), local.remove('currentProfile')]);
  };

  const getWholeStorage = async () => {
    return [await sync.get(SYNC_DEFAULT), await local.get(LOCAL_DEFAULT)] as const;
  };

  const mergeStorage = async (target: readonly [Pick<StorageSync, 'v3'>, Pick<StorageLocal, 'v3'>]) => {
    const [{ v3: syncTarget }, { v3: localTarget }] = target;

    {
      const curr = await sync.get(SYNC_DEFAULT);
      const next = Object.entries(syncTarget.profiles).reduce(
        (acc, [id, profile]) => {
          const existing = acc[id];
          if (!existing || existing.dateUpdated >= profile.dateUpdated) {
            acc[id] = {
              ...profile,
              dateUpdated: date(),
              dateRecentUse:
                existing.dateRecentUse >= profile.dateRecentUse ? existing.dateRecentUse : profile.dateRecentUse,
            };
          }
          return acc;
        },
        { ...curr.v3.profiles },
      );
      await sync.set({ v3: { ...curr.v3, profiles: next } });
    }

    {
      if (localTarget.selectedProfile) {
        await local.set({ v3: { selectedProfile: localTarget.selectedProfile } });
      }
    }
  };

  const cleanup = async () => {
    await sync.remove(['profiles', 'v3']);
    await local.remove(['currentProfile', 'v3']);
  };

  const getProfileList = async (sortRule: OneOfProfileSortRule = 'dateRecentUse') => {
    const { v3 } = await sync.get(SYNC_DEFAULT);

    return Object.values(v3.profiles).sort(({ [sortRule]: a }, { [sortRule]: b }) => (a < b ? 1 : -1));
  };

  const getProfile = async (id: string) => {
    const { v3 } = await sync.get(SYNC_DEFAULT);
    return v3.profiles[id] ?? undefined;
  };
  const setProfile = async (profile: MultiRowProfile) => {
    const { v3: curr } = await sync.get(SYNC_DEFAULT);
    const { id } = profile;
    const existing = curr.profiles[id];
    const next: ProfileWithMetaData = {
      ...curr.profiles[id],
      profile,
      dateUpdated: date(),
    };
    if (!existing) {
      next.dateCreated = date();
      next.dateRecentUse = date('zero');
    }
    await sync.set({ v3: { ...curr, profiles: { ...curr.profiles, [id]: next } } });
  };
  const deleteProfile = async (id: string) => {
    const { v3: curr } = await sync.get(SYNC_DEFAULT);
    const next = { ...curr.profiles };
    delete next[id];
    await sync.set({ v3: { ...curr, profiles: next } });
  };

  const getSelectedProfileId = async () => {
    const { v3 } = await local.get(LOCAL_DEFAULT);
    return v3.selectedProfile ?? null;
  };

  const setSelectedProfileId = async (id: string | null) => {
    const { v3: currLocal } = await local.get(LOCAL_DEFAULT);
    await local.set({ v3: { ...currLocal, selectedProfile: id } });

    if (!id) return;
    const { v3: currSync } = await sync.get(SYNC_DEFAULT);

    if (!currSync.profiles[id]) return;
    const next: ProfileWithMetaData = { ...currSync.profiles[id], dateRecentUse: date() };
    await sync.set({ v3: { ...currSync, profiles: { ...currSync.profiles, [id]: next } } });
  };

  return {
    getLegacyProfiles,
    getLegacySelectedProfileId,
    cleanLegacyProfiles,
    getWholeStorage,
    mergeStorage,
    cleanup,
    getProfileList,
    getProfile,
    setProfile,
    deleteProfile,
    getSelectedProfileId,
    setSelectedProfileId,
  };
};
