import { CSSProperties, useEffect } from 'react';
import useScreenHeight from '../hooks/useScreenHeight';
import DynamicHook from '../libs/dynamicHook';
import AppStore, { AppState } from '../store/app';
import AppStyle from './appStyle';
import JssInjection from './jssInjection';

const shared = {
  action: {} as ReturnType<typeof AppStore.useActions>,
  state: {} as AppState,
  editStatus: {
    col: false,
    row: null as null | number,
  },
  screenHeight: -1,
};

const useStyleModule = (styleElement: HTMLStyleElement) => {
  AppStore.useModule();
  shared.action = AppStore.useActions();
  shared.screenHeight = useScreenHeight();

  const { editing, profiles, currentProfile } = (shared.state = AppStore.useState());
  const profile = profiles[currentProfile];

  useEffect(() => {
    if (editing) {
      return;
    }

    const { editStatus } = shared;
    if (editStatus.col) {
      profile.columns.forEach((_, i) => setColStyle(i, void 0));
    }

    if (editStatus.row !== null) {
      const colIndex = editStatus.row;
      profile.rows[colIndex].forEach((_, i) => setRowStyle([colIndex, i], void 0));
    }

    if (editStatus.col || editStatus.row !== null) {
      JssInjection(styleElement, AppStyle(profiles[currentProfile]));

      editStatus.col = false;
      editStatus.row = null;
    }
  }, [editing]);

  useEffect(() => {
    JssInjection(styleElement, AppStyle(profile));
  }, [currentProfile]);

  useEffect(() => {
    if (!editing) {
      return;
    }

    const { editStatus } = shared;
    if (editStatus.col) {
      const appStyle = AppStyle(editing);
      appStyle.cellCols.forEach((style, i) => setColStyle(i, style));
    }

    if (editStatus.row !== null) {
      const appStyle = AppStyle(editing);
      const colIndex = editStatus.row;
      appStyle.cellRows[colIndex].forEach((style, i) => setRowStyle([colIndex, i], style));
    }
  });
};

const [useColStyle, setColStyle] = DynamicHook<CSSProperties | undefined, number, [number]>({
  keyGen: (s) => `${s}`,
  initial: () => void 0,
  updater: (_, col, width) => {
    if (!shared.state.editing) {
      shared.action.startEdit();
    }
    shared.editStatus.col = true;
    shared.action.resizeCol(col, width);
  },
});

const [useRowStyle, setRowStyle] = DynamicHook<CSSProperties | undefined, [number, number], [number]>({
  keyGen: (s) => `${s.join(':')}`,
  initial: () => void 0,
  updater: (_, selector, height) => {
    if (!shared.state.editing) {
      shared.action.startEdit();
    }
    const { currentProfile, profiles } = shared.state;
    const { cellGap, cellHeaderHeight, rows } = profiles[currentProfile];

    const colIndex = selector[0];
    const siblingCount = rows[colIndex].length;

    const totalCellGap = cellGap * (siblingCount - 1);
    const totalHeaderHeight = cellHeaderHeight * siblingCount;
    const maxHeight = shared.screenHeight + totalCellGap + totalHeaderHeight;
    const amount = (height / maxHeight) * 100;

    shared.editStatus.row = colIndex;
    shared.action.resizeRow(selector, amount);
  },
});

export { useColStyle, useRowStyle };

export default useStyleModule;