import React, { useMemo, useRef, useEffect, useState, Suspense } from 'react';
import styled from 'styled-components';
import { createRepository } from '../../shared/storage/repository';
import { getStorageInfrastructure } from '../../shared/storage/infrastructure';
import { EXTENSION_ID, WEB_EVENT, MAX_PROFILE_COUNT } from '../../shared/constants';
import { MessageSender } from '../../shared/messages';
import {
  useMultiRowProfileOriginal,
  useMultiRowProfileDispatch,
  MultiRowProfileProvider,
} from '../utils/useMultiRowProfile';
import { MultiRowFrame as Component } from '../components/MultiRowFrame';
import { createProfile, createDefaultProfile } from '../../shared/store/MultiRowProfile';
import { useTranslation } from 'react-i18next';

const INITIAL_SORT_RULE: OneOfProfileSortRule = 'dateRecentUse';

type RepositoryState = { loading: true; value: null } | { loading: false; value: Value };

interface Value {
  repository: StorageRepository;
  profile: MultiRowProfile | null;
  profiles: ProfileWithMetaData[];
  selectedId: string | null;
}

interface MultiRowFrameOutboundProps {}
interface MultiRowFrameInboundProps extends MultiRowFrameOutboundProps {
  repository: StorageRepository;
  profiles: ProfileWithMetaData[];
  defaultSelectedId: string | null;
}

const prepareRepositoryValue = async (repository: StorageRepository): Promise<RepositoryState> => {
  const profiles = await repository.getProfileList(INITIAL_SORT_RULE);
  const { profile = null } = profiles[0] || {};
  const selectedId = await repository.getSelectedProfileId();

  return { loading: false, value: { repository, profile, selectedId, profiles } };
};

export const MultiRowFrame = (props: MultiRowFrameOutboundProps) => {
  const [repositoryValue, setRepositoryValue] = useState<RepositoryState>({ loading: true, value: null });

  useEffect(() => {
    let connected = false;
    const sendConnectMessage = MessageSender(EXTENSION_ID, 'connect');
    const remote = createRepository(getStorageInfrastructure('auto'));
    const page = createRepository(getStorageInfrastructure('page'));

    const connect = async () => {
      if (connected) return;
      try {
        await sendConnectMessage();
        connected = true;
        await remote.mergeStorage(await page.prepareMerge());
        await page.cleanup();
        setRepositoryValue(await prepareRepositoryValue(remote));
      } catch (e) {
        setRepositoryValue(await prepareRepositoryValue(page));
        window.addEventListener(WEB_EVENT.installed, connect, { once: true });
        if (e instanceof Error) {
          console.log(e); // eslint-disable-line no-console
        } else {
          console.log(e.message); // eslint-disable-line no-console
        }
      }
    };

    connect();
    return () => window.removeEventListener(WEB_EVENT.installed, connect);
  }, []);

  if (repositoryValue.loading) return <Loading>Loading...</Loading>;

  const { repository, profile, selectedId, profiles } = repositoryValue.value;
  return (
    <MultiRowProfileProvider initialState={profile || undefined}>
      <Suspense fallback={<Loading>Loading...</Loading>}>
        <MultiRowFrameComponent {...props} repository={repository} defaultSelectedId={selectedId} profiles={profiles} />
      </Suspense>
    </MultiRowProfileProvider>
  );
};

const MultiRowFrameComponent = ({ repository, defaultSelectedId, profiles }: MultiRowFrameInboundProps) => {
  const dispatch = useMultiRowProfileDispatch();

  const [t] = useTranslation();

  const profile = useMultiRowProfileOriginal();
  const editingProfileRef = useRef(profile);
  editingProfileRef.current = profile;

  const savedProfileRef = useRef(profile);

  const [sortRule, setSortRule] = useState<OneOfProfileSortRule>(INITIAL_SORT_RULE);
  const sortRuleRef = useRef(sortRule);
  useEffect(() => {
    if (sortRuleRef.current === sortRule) return; // prevent initial call
    sortRuleRef.current = sortRule;
    reloadProfileList();
  }, [sortRule]);

  const [profileList, setProfileList] = useState<ProfileWithMetaData[]>(profiles);
  const profileCountRef = useRef(profileList.length);
  profileCountRef.current = profileList.length;

  const [drawerType, setDrawerType] = useState<OneOfDrawerType>('home');
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(defaultSelectedId);

  const initial = useRef(true);
  useEffect(() => {
    if (initial.current) {
      if (!profiles.length) {
        repository.setProfile(profile).then(reloadProfileList);
      }
      initial.current = false;
    } else {
      reloadProfileList();
    }
  }, [repository]);

  useEffect(() => {
    const handleBeforeUnload = (event: WindowEventMap['beforeunload']) => {
      if (editingProfileRef.current !== savedProfileRef.current) {
        const message = t('beforeUnload');
        event.returnValue = message;
        return message;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const methods = useMemo(() => {
    const reloadProfileList = async () => {
      const profileList = await repository.getProfileList(sortRuleRef.current);
      const selectedProfileId = await repository.getSelectedProfileId();
      setProfileList(profileList);
      setSelectedProfileId(selectedProfileId);
    };

    const saveProfile = async () => {
      const { current } = editingProfileRef;
      if (savedProfileRef.current === current) return;
      await repository.setProfile(current);
      savedProfileRef.current = current;
      reloadProfileList();
    };

    const discardChanges = () => {
      const { current } = editingProfileRef;
      if (savedProfileRef.current === current) return;
      dispatch('switchProfile', savedProfileRef.current);
    };

    const switchProfile = async (id: string) => {
      const { current } = editingProfileRef;
      if (current.id === id) {
        return;
      } else if (savedProfileRef.current !== current) {
        const shouldDiscard = confirm(`"${current.displayName}": ${t('confirmOnSwitchProfile')}`);
        if (!shouldDiscard) return;
      }

      const payload = await repository.getProfile(id);
      if (payload) {
        const { profile: selectedProfile } = payload;
        savedProfileRef.current = selectedProfile;
        dispatch('switchProfile', selectedProfile);
      }
    };

    const deleteCurrentProfile = async () => {
      const { current } = editingProfileRef;
      if (confirm(`"${current.displayName}": ${t('confirmOnDeleteCurrentProfile')}`)) {
        await repository.deleteProfile(current.id);
        let profiles = await repository.getProfileList(sortRuleRef.current);

        if (!profiles.length) {
          await repository.setProfile(createDefaultProfile());
          profiles = await repository.getProfileList(sortRuleRef.current);
        }

        const { profile: next } = profiles[0];
        savedProfileRef.current = next;
        dispatch('switchProfile', next);
        setProfileList(profiles);
      }
    };

    const createNewProfile = async () => {
      const { current } = editingProfileRef;
      if (profileCountRef.current >= MAX_PROFILE_COUNT) {
        return alert(t('alertOnCreateNewProfile'));
      } else if (savedProfileRef.current !== current) {
        const ok = confirm(`"${current.displayName}": ${t('confirmOnCreateNewProfile')}`);
        if (!ok) return;
      }
      const newProfile = createProfile('New Profile', []);
      await repository.setProfile(newProfile);
      await reloadProfileList();
      savedProfileRef.current = newProfile;
      dispatch('switchProfile', newProfile);
    };

    const selectCurrentProfile = async () => {
      const { current } = editingProfileRef;
      await repository.setSelectedProfileId(current.id);
      setSelectedProfileId(current.id);
    };

    return [
      reloadProfileList,
      saveProfile,
      discardChanges,
      switchProfile,
      deleteCurrentProfile,
      createNewProfile,
      selectCurrentProfile,
    ] as const;
  }, [repository]);

  const [
    reloadProfileList,
    saveProfile,
    discardChanges,
    switchProfile,
    deleteCurrentProfile,
    createNewProfile,
    selectCurrentProfile,
  ] = methods;

  return useMemo(
    () => (
      <Component
        {...{
          drawerType,
          profileList,
          selectedProfileId,
          sortRule,
          setDrawerType,
          reloadProfileList,
          saveProfile,
          discardChanges,
          switchProfile,
          deleteCurrentProfile,
          createNewProfile,
          selectCurrentProfile,
          setSortRule,
        }}
      />
    ),
    [repository, drawerType, profileList, selectedProfileId, sortRule],
  );
};

// TODO: split them to 'fragments' directory
const Loading = styled.div``;
