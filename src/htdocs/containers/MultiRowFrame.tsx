import React, { useMemo, useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { createRepository } from '../../shared/storage/repository';
import { getStorageInfrastructure } from '../../shared/storage/infrastructure';
import { EXTENSION_ID, WEB_EVENT, MAX_PROFILE_COUNT } from '../../shared/constants';
import { createExtensionMessageSender, getRuntime } from '../../shared/messages';
import { useMultiRowProfile, useMultiRowProfileDispatch, MultiRowProfileProvider } from '../utils/useMultiRowProfile';
import { MultiRowFrame as Component } from '../components/MultiRowFrame';
import { createProfile, createDefaultProfile } from '../../shared/store/MultiRowProfile';

const INITIAL_SORT_RULE: OneOfProfileSortRule = 'dateRecentUse';

type RepositoryValue =
  | { loading: true; error: null; repository: null; defaultValue: null }
  | { loading: false; error: Error; repository: null; defaultValue: null }
  | { loading: false; error: null; repository: StorageRepository; defaultValue: DefaultValues };

interface DefaultValues {
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

export const MultiRowFrame = (props: MultiRowFrameOutboundProps) => {
  const [repositoryValue, setRepositoryValue] = useState<RepositoryValue>({
    loading: true,
    error: null,
    repository: null,
    defaultValue: null,
  });

  useEffect(() => {
    const success = async (repository: StorageRepository) => {
      const profiles = await repository.getProfileList(INITIAL_SORT_RULE);
      const { profile = null } = profiles[0] || {};
      const selectedId = await repository.getSelectedProfileId();
      setRepositoryValue({
        loading: false,
        error: null,
        repository,
        defaultValue: { profile, selectedId, profiles },
      });
    };

    const runtime = getRuntime();
    if (!runtime) {
      return void getStorageInfrastructure('page')
        .then(createRepository)
        .then(success);
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
        await success(remote);

        window.removeEventListener(WEB_EVENT.connect, tryConnect);
      } catch (e) {
        console.log(e.message); // eslint-disable-line no-console
        await success(page);
      }
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

  const { profile, selectedId, profiles } = repositoryValue.defaultValue;
  return (
    <MultiRowProfileProvider initialState={profile || undefined}>
      <MultiRowFrameComponent
        {...props}
        repository={repositoryValue.repository}
        defaultSelectedId={selectedId}
        profiles={profiles}
      />
    </MultiRowProfileProvider>
  );
};

const MultiRowFrameComponent = ({ repository, defaultSelectedId, profiles }: MultiRowFrameInboundProps) => {
  const dispatch = useMultiRowProfileDispatch();

  const profile = useMultiRowProfile();
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

  const [drawerType, setDrawerType] = useState<OneOfDrawerType>('profileList');
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(defaultSelectedId);

  const methods = useMemo(() => {
    const reloadProfileList = async () => {
      setProfileList(await repository.getProfileList(sortRuleRef.current));
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
        const shouldDiscard = confirm(`「${current.displayName}」 への未保存の変更は破棄されます。よろしいですか？`);
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
      if (confirm(`この操作は取り消せません。本当に「${current.displayName}」を削除しますか？`)) {
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
        return alert(`保存できるプロフィールは${MAX_PROFILE_COUNT}個までです。`);
      } else if (savedProfileRef.current !== current) {
        const ok = confirm(`「${current.displayName}」 への未保存の変更を破棄して新しいプロファイルを作成しますか？`);
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

const ShowError = styled.div``;
