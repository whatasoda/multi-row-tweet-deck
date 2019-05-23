import { CSSProperties, useCallback, useEffect, useState } from 'react';
import useScreenHeight from '../hooks/useScreenHeight';
import DynamicHook from '../libs/dynamicHook';
import AppStore, { AppState, HEADER_HEIGHT_MAP } from '../store/app';
import AppStyle from './appStyle';
import JssInjection from './jssInjection';

const internal = {
  action: {} as ReturnType<typeof AppStore.useActions>,
  state: {} as AppState,
  editStatus: {
    col: false,
    row: null as null | number,
    drawer: false,
  },
  screenHeight: -1,
};

let forceUpdateCount = 0;

const useStyleModule = (styleElement: HTMLStyleElement) => {
  AppStore.useModule();
  internal.action = AppStore.useActions();
  internal.screenHeight = useScreenHeight();

  const { editing, profiles, currentProfile } = (internal.state = AppStore.useState());
  const profile = profiles[currentProfile];

  const [, setUpdateCount] = useState(forceUpdateCount);
  useStyleModule.forceUpdate = useCallback(() => setUpdateCount(++forceUpdateCount), [setUpdateCount]);

  useEffect(() => {
    if (editing) {
      return;
    }

    const { editStatus } = internal;
    if (editStatus.col) {
      profile.columns.forEach((_, i) => setColStyle(i, void 0));
    }

    if (editStatus.row !== null) {
      const colIndex = editStatus.row;
      profile.rows[colIndex].forEach((_, i) => setRowStyle([colIndex, i], void 0));
    }

    if (editStatus.drawer) {
      setDrawerStyle('drawer', void 0);
      setDrawerStyle('appContent', void 0);
    }

    if (editStatus.col || editStatus.row !== null || editStatus.drawer) {
      JssInjection(styleElement, AppStyle(profiles[currentProfile]));

      editStatus.col = false;
      editStatus.row = null;
      editStatus.drawer = false;
    }
  }, [editing]);

  useEffect(() => {
    JssInjection(styleElement, AppStyle(profile));
  }, [profile, forceUpdateCount]);

  useEffect(() => {
    if (!editing) {
      return;
    }

    const { editStatus } = internal;
    if (editStatus.col) {
      const appStyle = AppStyle(editing);
      appStyle.cellCols.forEach((style, i) => setColStyle(i, style));
    }

    if (editStatus.row !== null) {
      const appStyle = AppStyle(editing);
      const colIndex = editStatus.row;
      appStyle.cellRows[colIndex].forEach((style, i) => setRowStyle([colIndex, i], style));
    }

    if (editStatus.drawer) {
      const appStyle = AppStyle(editing);
      setDrawerStyle('drawer', appStyle.drawer);
      setDrawerStyle('appContent', appStyle.appContent);
    }
  });
};
useStyleModule.forceUpdate = null as null | (() => void);

const [useColStyle, setColStyle] = DynamicHook<CSSProperties | undefined, number, [number]>({
  keyGen: (s) => `${s}`,
  initial: () => void 0,
  updater: (_, col, width) => {
    if (!internal.state.editing) {
      internal.action.startEdit();
    }
    internal.editStatus.col = true;
    internal.action.resizeCol(col, width);
  },
});

const [useRowStyle, setRowStyle] = DynamicHook<CSSProperties | undefined, [number, number], [number]>({
  keyGen: (s) => `${s.join(':')}`,
  initial: () => void 0,
  updater: (_, selector, height) => {
    if (!internal.state.editing) {
      internal.action.startEdit();
    }
    const { currentProfile, profiles } = internal.state;
    const { cellGap, headerType, rows } = profiles[currentProfile];
    const headerHeight = HEADER_HEIGHT_MAP[headerType];

    const colIndex = selector[0];
    const siblingCount = rows[colIndex].length;

    const totalCellGap = cellGap * (siblingCount - 1);
    const totalHeaderHeight = headerHeight * siblingCount;
    const maxHeight = internal.screenHeight + totalCellGap + totalHeaderHeight;
    const amount = (height / maxHeight) * 100;

    internal.editStatus.row = colIndex;
    internal.action.resizeRow(selector, amount);
  },
});

const [useDrawerStyle, setDrawerStyle] = DynamicHook<CSSProperties | undefined, 'drawer' | 'appContent', [number]>({
  keyGen: (type) => type,
  initial: () => void 0,
  updater: (_0, _1, width) => {
    if (!internal.state.editing) {
      internal.action.startEdit();
    }

    internal.editStatus.drawer = true;
    internal.action.resizeDrawer(width);
  },
});

export { useColStyle, useRowStyle, useDrawerStyle };

export default useStyleModule;
