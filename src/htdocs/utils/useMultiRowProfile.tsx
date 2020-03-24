import { createStoreHook } from '../../shared/utils/storeHook';
import {
  createMultiRowProfileAction,
  MultiRowProfileReducer,
  createDefaultProfile,
} from '../../shared/store/MultiRowProfile';
import { createSelectorHost } from '../../shared/utils/selectorHost';
import React from 'react';

const [initStoreHook, useMultiRowProfile, useMultiRowProfileDispatch] = createStoreHook(
  createMultiRowProfileAction,
  MultiRowProfileReducer,
);

const [useMultiRowProfileSelector, SelectorProvider] = createSelectorHost(useMultiRowProfile);
const BaseProvider = initStoreHook(createDefaultProfile());
export const MultiRowProfileProvider: typeof BaseProvider = ({ initialState, children }) => {
  return (
    <BaseProvider initialState={initialState}>
      <SelectorProvider children={children} />
    </BaseProvider>
  );
};

export { useMultiRowProfile, useMultiRowProfileDispatch, useMultiRowProfileSelector };
