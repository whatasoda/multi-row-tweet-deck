interface LegacyMultiRowProfile {
  name: string;
  drawerWidth: number;
  cellGap: number;
  headerType: OneOfHeaderHeight;
  columns: number[];
  rows: number[][];
}

interface LegacyStorageSync {
  profiles: LegacyMultiRowProfile[];
}

interface LegacyStorageLocal {
  currentProfile: number;
}

interface StorageSync extends Partial<LegacyStorageSync> {
  v3: {
    profiles: Record<string, ProfileWithMetaData>;
    indexMap: Record<string, number>;
    lastIndex: number;
  };
  [idx: number]: ProfileWithMetaData;
}

interface StorageLocal extends Partial<LegacyStorageLocal> {
  v3: {
    selectedProfile: string | null;
  };
}

interface ProfileWithMetaData {
  profile: MultiRowProfile;
  dateCreated: string;
  dateUpdated: string;
  dateRecentUse: string;
}

type OneOfProfileSortRule = Exclude<keyof ProfileWithMetaData, 'profile' | 'legacyId'>;

interface StorageRepository {
  getLegacyProfiles(): Promise<LegacyMultiRowProfile[] | undefined>;
  getLegacySelectedProfileId(): Promise<number | undefined>;
  cleanLegacyProfiles(): Promise<void>;

  remapProfiles(): Promise<void>;
  prepareMerge(): Promise<readonly [ProfileWithMetaData[], Pick<StorageLocal, 'v3'>]>;
  mergeStorage(target: readonly [ProfileWithMetaData[], Pick<StorageLocal, 'v3'>]): Promise<void>;

  cleanup(): Promise<void>;

  getProfileList(sortRule?: OneOfProfileSortRule): Promise<ProfileWithMetaData[]>;

  getProfile(id: string): Promise<ProfileWithMetaData | undefined>;
  setProfile(profile: MultiRowProfile): Promise<void>;
  deleteProfile(id: string): Promise<void>;

  getSelectedProfileId(): Promise<string | null>;
  setSelectedProfileId(id: string | null): Promise<void>;
}

interface StorageInfrastructure {
  readonly sync: StorageInfrastructureArea<StorageSync>;
  readonly local: StorageInfrastructureArea<StorageLocal>;
}

interface StorageInfrastructureArea<T extends object> {
  readonly get: {
    <K extends keyof T>(key: K | K[]): Promise<Partial<Pick<T, K>>>;
    <U extends Partial<T>>(keys: U & Partial<T>): Promise<Partial<T> & U>;
    (keys: null): Promise<Partial<T>>;
    (keys: keyof T | (keyof T)[] | Partial<T> | null): any;
  };
  readonly set: (next: Partial<T>) => Promise<void>;
  readonly remove: (keys: keyof T | (keyof T)[]) => Promise<void>;
}
