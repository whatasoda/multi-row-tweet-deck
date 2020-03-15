import React, { FC, Fragment, memo, useEffect } from 'react';
import AppStore, { AppProfile, EmptyAppProfile } from './app';

type OldStorageItem = {
  columns: OldCellConfig[][];
  unitDivision: number;
  columnWidth: number[];
  version: string;
};
type OldCellConfig = Record<'unitCount', number>;

type SyncStorage = Partial<Record<number, OldStorageItem>> & {
  profiles?: AppProfile[];
};

type LocalStorage = {
  currentProfile: number;
};

const empty = EmptyAppProfile();

const getSync = () => new Promise<SyncStorage>((resolve) => chrome.storage.sync.get(resolve as any));
const getLocal = () => new Promise<LocalStorage>((resolve) => chrome.storage.local.get(resolve as any));

const setSync = (value: SyncStorage) => new Promise<void>((resolve) => chrome.storage.sync.set(value, resolve));
const setLocal = (value: LocalStorage) => new Promise<void>((resolve) => chrome.storage.local.set(value, resolve));

const migrate = async (): Promise<AppProfile[]> => {
  const { profiles, ...old } = await getSync();

  if (profiles) {
    return profiles;
  }

  const migrated = (Object.entries(old) as Array<[string, OldStorageItem]>).map<AppProfile>(
    ([name, { columnWidth, columns, unitDivision }]) => ({
      ...empty,
      name,
      columns: columnWidth,
      rows: columns.map((rows) => rows.map(({ unitCount }) => (unitCount / unitDivision) * 100)),
    }),
  );

  migrated.forEach(({ name }) => {
    if (name !== 'profiles') {
      chrome.storage.sync.remove(name);
    }
  });

  return migrated;
};

const save = (() => {
  let isSaving = false;
  let next: SyncStorage = {};

  const saveFunc = async (value: SyncStorage) => {
    next = value;
    if (isSaving) {
      return;
    }
    isSaving = true;
    await setSync(next);
    isSaving = false;
  };

  return (value: SyncStorage) => {
    saveFunc(value);
  };
})();

const getSelection = async (): Promise<number> => {
  const { currentProfile = 0 } = await getLocal();
  return currentProfile;
};

const setSelection = async (currentProfile: number) => {
  await setLocal({ currentProfile });
};

const Repository: FC = memo(() => {
  const { fetch, selectProfile } = AppStore.useActions();
  const { fetched, profiles, currentProfile } = AppStore.useState();

  useEffect(() => {
    migrate().then(fetch);
    getSelection().then(selectProfile);
  }, []);

  useEffect(() => {
    if (fetched) {
      save({ profiles });
    }
  }, [profiles]);

  useEffect(() => {
    setSelection(currentProfile);
  }, [currentProfile]);

  return React.createElement(Fragment, {});
});

export default Repository;
