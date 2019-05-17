import { createModule } from 'typeless';
import warning from 'warning';
import { __DEV__ } from '../../utils/env';

type AppState = {
  currentProfile: number;
  profiles: AppProfile[];
};

export type AppProfile = {
  name: string;
  composerWidth: number;
  columns: number[];
  rows: number[][];
};

type CellCelector = [number, number];

const INITIAL_COMPOSER_WIDTH = 300;
const INITIAL_COLUMN_WIDTH = 300;
const INITIAL_ROWS = [50, 50];

const [useModule, Actions, getState] = createModule(Symbol('grid'))
  .withActions({
    newProfile: null,
    deleteProfile: (index: number | null = null) => ({ payload: { index } }),
    selectProfile: (index: number) => ({ payload: { index } }),
    setProfileName: (name: string) => ({ payload: { name } }),

    newCol: (selector: number, width: number | null = null) => ({ payload: { selector, width } }),
    deleteCol: (selector: number) => ({ payload: { selector } }),
    modifyCol: (selector: number, amount: number) => ({ payload: { selector, amount } }),

    newRow: (selector: CellCelector, height: number | null = null) => ({ payload: { selector, height } }),
    deleteRow: (selector: CellCelector) => ({ payload: { selector } }),
    modifyRow: (selector: CellCelector, amount: number) => ({ payload: { selector, amount } }),
  })
  .withState<AppState>();

useModule
  .reducer({ currentProfile: 0, profiles: [] })
  .on(Actions.newProfile, (state) => {
    state.profiles.push({
      name: 'New Profile',
      composerWidth: INITIAL_COMPOSER_WIDTH,
      columns: [INITIAL_COLUMN_WIDTH],
      rows: [[...INITIAL_ROWS]],
    });

    state.currentProfile = state.profiles.length - 1;
  })
  .on(Actions.deleteProfile, (state, { index }) => {
    if (index === null) {
      index = state.currentProfile;
    }

    if (!(index in state.profiles)) {
      if (__DEV__) {
        warning(false, '[deleteProfile] Invalid index: no profile exists at index %1', index);
      }
      return;
    }

    state.profiles.splice(index, 1);
  })
  .on(Actions.selectProfile, (state, { index }) => {
    if (!(index in state.profiles)) {
      if (__DEV__) {
        warning(false, '[selectProfile] Invalid index: no profile exists at index %1', index);
      }
      return;
    }

    state.currentProfile = index;
  })
  .on(Actions.setProfileName, ({ currentProfile, profiles }, { name }) => {
    const profile = profiles[currentProfile];

    profile.name = name;
  })
  .on(Actions.newCol, ({ currentProfile, profiles }, { selector, width }) => {
    const profile = profiles[currentProfile];

    if (width === null) {
      width = selector === 0 ? INITIAL_COLUMN_WIDTH : profile.columns[selector - 1];
    }

    profile.columns.splice(selector, 0, width);
    profile.rows.splice(selector, 0, [100]);
  })
  .on(Actions.deleteCol, ({ currentProfile, profiles }, { selector }) => {
    const profile = profiles[currentProfile];

    if (!(selector in profile.columns)) {
      if (__DEV__) {
        warning(false, '[deleteCol] Invalid selector: no column exists at index %1.', selector);
      }
      return;
    }

    profile.columns.splice(selector, 1);
    profile.rows.splice(selector, 1);
  })
  .on(Actions.modifyCol, ({ currentProfile, profiles }, { selector, amount }) => {
    const profile = profiles[currentProfile];

    if (!(selector in profile.columns)) {
      if (__DEV__) {
        warning(false, '[modifyCol] Invalid selector: no column exists at index %1.', selector);
      }
      return;
    }

    profile.columns[selector] += amount;
  })
  .on(Actions.newRow, ({ currentProfile, profiles }, { selector: [sCol, sRow], height }) => {
    const profile = profiles[currentProfile];

    const col = profile.rows[sCol];
    if (!col) {
      if (__DEV__) {
        warning(false, '[newCell] Invalid selector: no column exists at index %1.', sCol);
      }
      return;
    }

    const sSinblingRow = Math.min(col.length - 1, sRow);
    if (height === null) {
      height = col[sSinblingRow] / 2;
    } else {
      height = Math.min(col[sSinblingRow], height);
    }

    col[sSinblingRow] -= height;
    col.splice(sRow, 0, height);
  })
  .on(Actions.deleteRow, ({ currentProfile, profiles }, { selector: [sCol, sRow] }) => {
    const profile = profiles[currentProfile];

    const col = profile.rows[sCol];
    if (!col) {
      if (__DEV__) {
        warning(false, '[deleteRow] Invalid selector: no column exists at index %1.', sCol);
      }
      return;
    }

    if (!(sRow in col)) {
      if (__DEV__) {
        warning(false, '[deleteRow] Invalid selector: no row exists at index %1.', sRow);
      }
      return;
    }

    col.splice(sRow, 1);
  })
  .on(Actions.modifyRow, ({ currentProfile, profiles }, { selector: [sCol, sRow], amount }) => {
    const profile = profiles[currentProfile];

    const col = profile.rows[sCol];
    if (!col) {
      if (__DEV__) {
        warning(false, '[modifyRow] Invalid selector: no column exists at index %1.', sCol);
      }
      return;
    }

    if (sRow >= col.length - 1) {
      if (__DEV__) {
        warning(sRow in col, '[modifyRow] Invalid selector: no row exists at index %1.', sRow);
        warning(!(sRow in col), '[modifyRow] Invalid selector: last row cannot be modified.');
      }
      return;
    }

    profile.columns[sRow] += amount;
    profile.columns[sRow + 1] -= amount;
  });

const AppStore = { useModule, Actions, getState };

export default AppStore;
