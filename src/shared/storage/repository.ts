export const createRepository = ({ local, sync }: StorageInfrastructure): StorageRepository => {
  const getLegacyProfiles = async () => (await sync.get('profiles')).profiles ?? undefined;
  const getLegacySelectedProfileId = async () => (await local.get('currentProfile')).currentProfile ?? undefined;
  const cleanLegacyProfiles = async () => {
    await Promise.all([sync.remove('profiles'), local.remove('currentProfile')]);
  };

  const getProfile = async (id: string) => {
    const { v3 } = await sync.get({ v3: { profiles: {} } });
    return v3.profiles[id] ?? undefined;
  };
  const setProfile = async (profile: ProfileWithMetaData) => {
    const { v3: curr } = await sync.get({ v3: { profiles: {} } });
    const { id } = profile.profile;
    await sync.set({ v3: { ...curr, profiles: { ...curr.profiles, [id]: profile } } });
  };
  const deleteProfile = async (id: string) => {
    const { v3: curr } = await sync.get({ v3: { profiles: {} } });
    const next = { ...curr.profiles };
    delete next[id];
    await sync.set({ v3: { ...curr, profiles: next } });
  };

  const getSelectedProfileId = async () => {
    const { v3 } = await local.get({ v3: { selectedProfile: null } });
    return v3.selectedProfile ?? null;
  };

  const setSelectedProfileId = async (id: string | null) => {
    const { v3: curr } = await local.get({ v3: { selectedProfile: null } });
    await local.set({ v3: { ...curr, selectedProfile: id } });
  };

  return {
    getLegacyProfiles,
    getLegacySelectedProfileId,
    cleanLegacyProfiles,
    getProfile,
    setProfile,
    deleteProfile,
    getSelectedProfileId,
    setSelectedProfileId,
  };
};
