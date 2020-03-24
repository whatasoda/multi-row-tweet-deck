import React, { useEffect, useState } from 'react';
import { StyleInjection } from './style';
import { getStorageInfrastructure } from '../../shared/storage/infrastructure';
import { createRepository } from '../../shared/storage/repository';

export const App = () => {
  const [profile, setProfile] = useState<MultiRowProfile | null>(null);

  useEffect(() => {
    (async () => {
      const repository = createRepository(await getStorageInfrastructure('auto'));

      const selectedId = await repository.getSelectedProfileId();
      if (selectedId === null) return;

      const profile = await repository.getProfile(selectedId);
      if (!profile) return;

      setProfile(profile.profile);
    })();
  }, []);

  return profile && <StyleInjection profile={profile} />;
};
