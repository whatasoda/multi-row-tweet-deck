import { createStoreHook } from '../../shared/utils/storeHook';
import {
  createMultiRowProfileAction,
  MultiRowProfileReducer,
  createDefaultProfile,
} from '../../shared/store/MultiRowProfile';

const [initStoreHook, useMultiRowProfile, useMultiRowProfileDispatch] = createStoreHook(
  createMultiRowProfileAction,
  MultiRowProfileReducer,
);
export { useMultiRowProfile, useMultiRowProfileDispatch };

export const MultiRowProfileProvider = initStoreHook(createDefaultProfile());
