interface StorageInfrastructure<T extends object> {
  get: {
    <K extends keyof T>(key: K | K[]): Promise<Partial<Pick<T, K>>>;
    <U extends Partial<T>>(keys: U & Partial<T>): Promise<Partial<T> & U>;
    (keys: null): Promise<Partial<T>>;
  };
  set: (next: Partial<T>) => Promise<void>;
  remove: (keys: keyof T | (keyof T)[]) => Promise<void>;
}

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
  };
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
  legacyId: number;
}

interface StorageRepository {
  getLegacyProfiles(): Promise<LegacyMultiRowProfile[] | undefined>;
  getLegacySelectedProfileId(): Promise<number | undefined>;
  cleanLegacyProfiles(): Promise<void>;

  getProfile(id: string): Promise<ProfileWithMetaData | undefined>;
  setProfile(profile: ProfileWithMetaData): Promise<void>;
  deleteProfile(id: string): Promise<void>;

  getSelectedProfileId(): Promise<string | null>;
  setSelectedProfileId(id: string | null): Promise<void>;
}
