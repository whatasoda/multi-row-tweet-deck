const date = (type: 'now' | 'zero' = 'now') => {
  if (type === 'zero') return new Date(0).toISOString();
  return new Date().toISOString();
};

const withSyncDefault = (value: any): StorageSync => (value ? { ...SYNC_DEFAULT, ...value } : { ...SYNC_DEFAULT });
const withLocalDefault = (value: any): StorageLocal => (value ? { ...LOCAL_DEFAULT, ...value } : { ...LOCAL_DEFAULT });
const SYNC_DEFAULT: StorageSync = { v3: { profiles: {}, indexMap: {}, lastIndex: 0 } };
const LOCAL_DEFAULT: StorageLocal = { v3: { selectedProfile: null } };

export const createRepository = ({ local, sync }: StorageInfrastructure): StorageRepository => {
  const getLegacyProfiles = async () => (await sync.get('profiles')).profiles ?? undefined;
  const getLegacySelectedProfileId = async () => (await local.get('currentProfile')).currentProfile ?? undefined;
  const cleanLegacyProfiles = async () => {
    await Promise.all([sync.remove('profiles'), local.remove('currentProfile')]);
  };

  const remapProfiles = async () => {
    const { v3: curr } = withSyncDefault(await sync.get(SYNC_DEFAULT));
    if (!Object.values(curr.profiles).length) return;
    const next = Object.entries(curr.profiles).reduce<StorageSync>(
      (acc, [id, profile]) => {
        const idx = (acc.v3.indexMap[id] = acc.v3.lastIndex = acc.v3.lastIndex + 1);
        acc[idx] = profile;
        return acc;
      },
      { v3: { ...SYNC_DEFAULT.v3 } },
    );
    next.v3.profiles = {};
    await sync.set(next);
  };

  const prepareMerge = async () => {
    const indices = Object.values(withSyncDefault(await sync.get(SYNC_DEFAULT)).v3.indexMap);
    return [
      Object.values(await sync.get(indices)).filter(Boolean) as ProfileWithMetaData[],
      withLocalDefault(await local.get(LOCAL_DEFAULT)),
    ] as const;
  };

  const mergeStorage = async (target: readonly [ProfileWithMetaData[], Pick<StorageLocal, 'v3'>]) => {
    const [profiles, { v3: localTarget }] = target;

    {
      const curr = withSyncDefault(await sync.get(SYNC_DEFAULT));
      const next = profiles.reduce<Promise<StorageSync>>(async (accPromise, profile) => {
        const acc = await accPromise;
        const { id } = profile.profile;
        if (id in curr.v3.indexMap) {
          const idx = curr.v3.indexMap[id];
          const existing = (await getProfile(id))!;
          if (existing.dateUpdated >= profile.dateUpdated) {
            acc[idx] = {
              ...profile,
              dateUpdated: date(),
              dateRecentUse:
                existing.dateRecentUse >= profile.dateRecentUse ? existing.dateRecentUse : profile.dateRecentUse,
            };
          }
        } else {
          const idx = (acc.v3.indexMap[id] = acc.v3.lastIndex = acc.v3.lastIndex + 1);
          acc[idx] = { ...profile, dateUpdated: date() };
        }
        return acc;
      }, Promise.resolve({ v3: { ...curr.v3 } }));
      await sync.set(await next);
    }

    {
      if (typeof localTarget.selectedProfile === 'string') {
        await local.set({ v3: { selectedProfile: localTarget.selectedProfile } });
      }
    }
  };

  const cleanup = async () => {
    await sync.remove(['profiles', 'v3']);
    await local.remove(['currentProfile', 'v3']);
  };

  const getProfileList = async (sortRule: OneOfProfileSortRule = 'dateRecentUse') => {
    const { v3 } = withSyncDefault(await sync.get(SYNC_DEFAULT));
    const profiles = await sync.get(Object.values(v3.indexMap));

    return Object.values(profiles)
      .filter<ProfileWithMetaData>(Boolean as any)
      .sort(({ [sortRule]: a }, { [sortRule]: b }) => (a < b ? 1 : -1));
  };

  const getProfile = async (id: string) => {
    const { v3 } = withSyncDefault(await sync.get(SYNC_DEFAULT));
    const idx = v3.indexMap[id];
    return typeof idx === 'number' ? (await sync.get(idx))[idx] ?? undefined : undefined;
  };
  const setProfile = async (profile: MultiRowProfile) => {
    const { v3: curr } = withSyncDefault(await sync.get(SYNC_DEFAULT));
    const { id } = profile;

    if (id in curr.indexMap) {
      const idx = curr.indexMap[id];
      const next: ProfileWithMetaData = {
        ...(await getProfile(id))!,
        profile,
        dateUpdated: date(),
      };
      await sync.set({ [idx]: next });
    } else {
      const idx = curr.lastIndex + 1;
      const next: ProfileWithMetaData = {
        dateCreated: date(),
        dateRecentUse: date('zero'),
        dateUpdated: date(),
        profile,
      };
      await sync.set({
        v3: { ...curr, indexMap: { ...curr.indexMap, [id]: idx }, lastIndex: idx },
        [idx]: next,
      });
    }
  };
  const deleteProfile = async (id: string) => {
    const { v3: curr } = withSyncDefault(await sync.get(SYNC_DEFAULT));
    const next = { ...curr.indexMap };
    const idx = next[id];
    delete next[id];
    await sync.set({ v3: { ...curr, indexMap: next } });
    await sync.remove(idx);
  };

  const getSelectedProfileId = async () => {
    const { v3 } = withLocalDefault(await local.get(LOCAL_DEFAULT));
    return v3.selectedProfile ?? null;
  };

  const setSelectedProfileId = async (id: string | null) => {
    const { v3: currLocal } = withLocalDefault(await local.get(LOCAL_DEFAULT));
    await local.set({ v3: { ...currLocal, selectedProfile: id } });

    if (!id) return;
    const { v3: currSync } = withSyncDefault(await sync.get(SYNC_DEFAULT));

    if (!(id in currSync.indexMap)) return;
    const idx = currSync.indexMap[id];
    await sync.set({ [idx]: { ...(await getProfile(id))!, dateRecentUse: date() } });
  };

  return {
    getLegacyProfiles,
    getLegacySelectedProfileId,
    cleanLegacyProfiles,
    remapProfiles,
    prepareMerge,
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
