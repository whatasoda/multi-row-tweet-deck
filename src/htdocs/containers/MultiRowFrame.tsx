import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useMultiRowProfile, useMultiRowProfileDispatch, MultiRowProfileProvider } from '../utils/useMultiRowProfile';
import { createRepository } from '../../shared/storage/repository';
import styled from 'styled-components';
import { getStorageInfrastructure } from '../../shared/storage/infrastructure';
import { createExtensionMessageSender, getRuntime } from '../../shared/messages';
import { EXTENSION_ID, WEB_EVENT } from '../../shared/constants';
import { MultiRowFrame as Component } from '../components/MultiRowFrame';

type RepositoryValue =
  | { loading: true; error: null; repository: null; initialProfile: null }
  | { loading: false; error: Error; repository: null; initialProfile: null }
  | { loading: false; error: null; repository: StorageRepository; initialProfile: MultiRowProfile | null };

interface MultiRowFrameProps {}

export const MultiRowFrame = (props: MultiRowFrameProps) => {
  const [repositoryValue, setRepositoryValue] = useState<RepositoryValue>({
    loading: true,
    error: null,
    repository: null,
    initialProfile: null,
  });

  useEffect(() => {
    const runtime = getRuntime();
    if (!runtime) {
      return void (async () => {
        const repository = createRepository(await getStorageInfrastructure('page'));
        const { profile = null } = (await repository.getProfileList('dateRecentUse'))[0] || {};
        setRepositoryValue({ loading: false, error: null, repository, initialProfile: profile });
      })();
    }

    let connected = false;
    const repositories: Record<'remote' | 'page', StorageRepository> = { page: null as any, remote: null as any };
    const sendConnect = createExtensionMessageSender(runtime, EXTENSION_ID, 'connect');
    const tryConnect = async () => {
      if (connected) return;
      const { page, remote } = repositories;
      try {
        await sendConnect();
        connected = true;
        await remote.mergeStorage(await page.getWholeStorage());
        await page.cleanup();

        const { profile = null } = (await remote.getProfileList('dateRecentUse'))[0] || {};
        setRepositoryValue({ loading: false, error: null, repository: remote, initialProfile: profile });

        window.removeEventListener(WEB_EVENT.connect, tryConnect);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e.message);
      } // eslint-disable-line no-empty
      const { profile = null } = (await page.getProfileList('dateRecentUse'))[0] || {};
      setRepositoryValue({ loading: false, error: null, repository: page, initialProfile: profile });
    };

    (async () => {
      repositories.remote = createRepository(await getStorageInfrastructure('auto'));
      repositories.page = createRepository(await getStorageInfrastructure('page'));

      await tryConnect();
      if (connected) return;
      window.addEventListener(WEB_EVENT.connect, tryConnect);
    })();

    return () => {
      window.removeEventListener(WEB_EVENT.connect, tryConnect);
    };
  }, []);

  if (repositoryValue.loading) return <Loading>Loading...</Loading>;
  if (repositoryValue.error) return <ShowError>{repositoryValue.error.message}</ShowError>;

  return (
    <MultiRowProfileProvider initialState={repositoryValue.initialProfile || undefined}>
      <MultiRowFrameComponent {...props} repository={repositoryValue.repository} />
    </MultiRowProfileProvider>
  );
};

const MultiRowFrameComponent = ({ repository }: MultiRowFrameProps & { repository: StorageRepository }) => {
  const dispatch = useMultiRowProfileDispatch();
  const profile = useMultiRowProfile();

  const profileRef = useRef(profile);
  profileRef.current = profile;

  const [saveProfile] = useMemo(() => {
    const saveProfile = async () => {
      await repository.setProfile(profile);
    };

    const discardChanges = async () => {
      const payload = await repository.getProfile(profile.id);
      if (payload) {
        dispatch('switchProfile', payload.profile);
      } else {
        // TODO: add new action to reset or use template profile
      }
    };

    return [saveProfile, discardChanges];
  }, []);

  saveProfile;

  return <Component profile={profile} />;
};

// TODO: split them to 'fragments' directory
const Loading = styled.div``;

const ShowError = styled.div``;
