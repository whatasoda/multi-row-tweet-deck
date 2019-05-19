import AppStore, { AppProfile } from '../store/app';

const useProfile = (): AppProfile => {
  const { currentProfile, profiles } = AppStore.useState();

  return profiles[currentProfile];
};

export default useProfile;
