import { CSSProperties, useEffect } from 'react';
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
};

const useStyleModule = (styleElement: HTMLStyleElement) => {
  AppStore.useModule();
  shared.action = AppStore.useActions();

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
  keyGen: (s) => `[${s.join(':')}]`,
  initial: () => void 0,
  updater: (_, selector, percentage) => {
    if (!shared.state.editing) {
      shared.action.startEdit();
    }

    shared.editStatus.row = selector[0];
    shared.action.resizeRow(selector, percentage);
  },
});

export { useColStyle, useRowStyle };

export default useStyleModule;
