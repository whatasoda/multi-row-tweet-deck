import { createStoreHook } from '../../shared/utils/storeHook';
import {
  createMultiRowProfileAction,
  MultiRowProfileReducer,
  createDefaultProfile,
} from '../../shared/store/MultiRowProfile';
import { createSelectorHost } from '../../shared/utils/selectorHost';
import React from 'react';

const [initStoreHook, useMultiRowProfileOriginal, useMultiRowProfileDispatch] = createStoreHook(
  createMultiRowProfileAction,
  MultiRowProfileReducer,
);

const [useMultiRowProfile, SelectorProvider] = createSelectorHost(useMultiRowProfileOriginal);
const BaseProvider = initStoreHook(createDefaultProfile());
export const MultiRowProfileProvider: typeof BaseProvider = ({ initialState, children }) => {
  return (
    <BaseProvider initialState={initialState}>
      <SelectorProvider children={children} />
    </BaseProvider>
  );
};

export { useMultiRowProfileOriginal, useMultiRowProfileDispatch, useMultiRowProfile };
