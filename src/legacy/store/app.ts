import { createModule, useActions } from 'typeless';
import warning from 'warning';
import { __DEV__ } from '../utils/env';

export type AppState = {
  fetched: boolean;
  currentProfile: number;
  profiles: AppProfile[];
  editing: AppProfile | null;
};

export type AppProfile = {
  name: string;
  drawerWidth: number;
  cellGap: number;
  headerType: keyof typeof HEADER_HEIGHT_MAP;
  columns: number[];
  rows: number[][];
};

type CellSelector = [number, number];

const INITIAL_DRAWER_WIDTH = 300;
const INITIAL_COLUMN_WIDTH = 300;
const INITIAL_ROWS = [50, 50];

const DEFAULT_CELL_GAP = 4;
const MIN_CELL_GAP = 0;
const MAX_CELL_GAP = 10;

const MIN_COLUMN_WIDTH = 50;
const MAX_COLUMN_WIDTH = 1024;

const MIN_DRAWER_WIDTH = 230;
const MAX_DRAWER_WIDTH = 800;

export const HEADER_HEIGHT_MAP = {
  default: 50,
  medium: 40,
  small: 30,
};

const [useModule, Actions, getState] = createModule(Symbol('app'))
  .withActions({
    fetch: (profiles: AppProfile[] | null) => ({ payload: { profiles } }),
    newProfile: null,
    deleteProfile: null,
    selectProfile: (index: number) => ({ payload: { index } }),
    setProfileName: (name: string) => ({ payload: { name } }),

    setHeaderType: (type: AppProfile['headerType']) => ({ payload: { type } }),
    setCellGap: (amount: number) => ({ payload: { amount } }),

    newCol: null,
    newRow: (selector: CellSelector) => ({ payload: { selector } }),
    deleteCell: (selector: CellSelector) => ({ payload: { selector } }),

    startEdit: null,
    commitEdit: null,
    discardEdit: null,
    resizeCol: (selector: number, amount: number) => ({ payload: { selector, amount } }),
    resizeRow: (selector: CellSelector, amount: number) => ({ payload: { selector, amount } }),
    resizeDrawer: (amount: number) => ({ payload: { amount } }),
  })
  .withState<AppState>();

export const EmptyAppProfile = (): AppProfile => ({
  name: 'New Profile',
  drawerWidth: INITIAL_DRAWER_WIDTH,
  cellGap: DEFAULT_CELL_GAP,
  headerType: 'medium',
  columns: [INITIAL_COLUMN_WIDTH],
  rows: [[...INITIAL_ROWS]],
});
const reducer = useModule.reducer({ fetched: false, currentProfile: 0, profiles: [EmptyAppProfile()], editing: null });

const AppStore = {
  useModule,
  useActions: () => useActions(Actions),
  useState: () => getState.useState(),
};

/**
 * @name fetch
 */
reducer.on(Actions.fetch, (state, { profiles }) => {
  if (state.fetched) {
    if (__DEV__) {
      warning(false, '[fetch] State has already fetched.');
    }
    return;
  }

  state.fetched = true;
  if (profiles && profiles.length) {
    state.profiles = profiles;
  }
});

/**
 * @name newProfile
 */
reducer.on(Actions.newProfile, (state) => {
  state.profiles.push(EmptyAppProfile());

  state.currentProfile = state.profiles.length - 1;
});

/**
 * @name deleteProfile
 */
reducer.on(Actions.deleteProfile, (state) => {
  if (state.profiles.length === 1) {
    return;
  }

  state.profiles.splice(state.currentProfile, 1);
  state.currentProfile = Math.max(0, state.currentProfile - 1);
});

/**
 * @name selectProfile
 */
reducer.on(Actions.selectProfile, (state, { index }) => {
  if (!(index in state.profiles)) {
    if (__DEV__) {
      warning(false, '[selectProfile] Invalid index: no profile exists at index %s', index);
    }
    return;
  }

  state.currentProfile = index;
});

/**
 * @name setProfileName
 */
reducer.on(Actions.setProfileName, ({ currentProfile, profiles }, { name }) => {
  const profile = profiles[currentProfile];

  profile.name = name;
});

/**
 * @name setHeaderType
 */
reducer.on(Actions.setHeaderType, ({ currentProfile, profiles }, { type }) => {
  const profile = profiles[currentProfile];

  if (!(type in HEADER_HEIGHT_MAP)) {
    if (__DEV__) {
      warning(false, '[setHeaderType] Invalid header type: %s', type);
    }
    return;
  }

  profile.headerType = type;
});

/**
 * @name setCellGap
 */
reducer.on(Actions.setCellGap, ({ currentProfile, profiles }, { amount }) => {
  const profile = profiles[currentProfile];

  profile.cellGap = Math.min(Math.max(amount, MIN_CELL_GAP), MAX_CELL_GAP);
});

/**
 * @name newCol
 */
reducer.on(Actions.newCol, ({ currentProfile, profiles }) => {
  const profile = profiles[currentProfile];

  const selector = profile.columns.length;
  const width = profile.columns[selector - 1];

  profile.columns.splice(selector, 0, width);
  profile.rows.splice(selector, 0, [100]);
});

/**
 * @name newRow
 */
reducer.on(Actions.newRow, ({ currentProfile, profiles }, { selector: [sCol, sRow] }) => {
  const profile = profiles[currentProfile];

  const col = profile.rows[sCol];
  if (!col) {
    if (__DEV__) {
      warning(false, '[newCell] Invalid selector: no column exists at index %s.', sCol);
    }
    return;
  }

  const sSinblingRow = Math.min(col.length - 1, sRow);
  const height = col[sSinblingRow] / 2;

  col[sSinblingRow] -= height;
  col.splice(sRow, 0, height);
});

/**
 * @name deleteCell
 */
reducer.on(Actions.deleteCell, ({ currentProfile, profiles }, { selector: [sCol, sRow] }) => {
  const profile = profiles[currentProfile];

  const col = profile.rows[sCol];
  if (!col) {
    if (__DEV__) {
      warning(false, '[deleteCell] Invalid selector: no column exists at index %s.', sCol);
    }
    return;
  }

  if (!(sRow in col)) {
    if (__DEV__) {
      warning(false, '[deleteCell] Invalid selector: no row exists at index %s.', sRow);
    }
    return;
  }

  const [height] = col.splice(sRow, 1);
  if (col.length) {
    col[Math.max(sRow - 1, 0)] += height;
  } else {
    profile.columns.splice(sCol, 1);
    profile.rows.splice(sCol, 1);
  }
});

/**
 * @name startEdit
 */
reducer.on(Actions.startEdit, (state) => {
  const { profiles, currentProfile } = state;
  const profile = profiles[currentProfile];

  if (state.editing) {
    return;
  }
  state.editing = JSON.parse(JSON.stringify(profile));
});

/**
 * @name commitEdit
 */
reducer.on(Actions.commitEdit, (state) => {
  const { profiles, currentProfile, editing } = state;
  if (!editing) {
    if (__DEV__) {
      warning(false, '[commitEdit] Nothing to commit.');
    }
    return;
  }
  profiles[currentProfile] = editing;
  state.editing = null;
});

/**
 * @name discardEdit
 */
reducer.on(Actions.discardEdit, (state) => {
  state.editing = null;
});

/**
 * @name resizeCol
 */
reducer.on(Actions.resizeCol, ({ currentProfile, profiles, editing }, { selector, amount }) => {
  if (!editing) {
    if (__DEV__) {
      warning(false, '[resizeCol] Invalid oparation: editing did not start.');
    }
    return;
  }

  const profile = profiles[currentProfile];

  if (!(selector in profile.columns)) {
    if (__DEV__) {
      warning(false, '[resizeCol] Invalid selector: no column exists at index %s.', selector);
    }
    return;
  }

  const next = profile.columns[selector] + amount;
  editing.columns[selector] = Math.min(Math.max(next, MIN_COLUMN_WIDTH), MAX_COLUMN_WIDTH);
});

/**
 * @name resizeRow
 */
reducer.on(Actions.resizeRow, ({ currentProfile, profiles, editing }, { selector: [sCol, sRow], amount }) => {
  if (!editing) {
    if (__DEV__) {
      warning(false, '[resizeRow] Invalid oparation: editing did not start.');
    }
    return;
  }

  const profile = profiles[currentProfile];

  const pCol = profile.rows[sCol];
  if (!pCol) {
    if (__DEV__) {
      warning(false, '[resizeRow] Invalid selector: no column exists at index %s.', sCol);
    }
    return;
  }

  if (sRow >= pCol.length - 1) {
    if (__DEV__) {
      warning(sRow in pCol, '[resizeRow] Invalid selector: no row exists at index %s.', sRow);
      warning(!(sRow in pCol), '[resizeRow] Invalid selector: last row cannot be modified.');
    }
    return;
  }

  const eCol = editing.rows[sCol];
  const direction = Math.sign(amount);
  let toGrow;
  let start;
  let end;
  if (!amount) {
    return;
  } else if (direction > 0) {
    const maxPercentage = pCol.slice(sRow + 1).reduce((acc, p) => acc + p, 0);
    amount = Math.min(amount, maxPercentage);

    toGrow = sRow;
    start = sRow + 1;
    end = pCol.length;
  } else {
    const minPercentage = pCol.slice(0, sRow + 1).reduce((acc, p) => acc - p, 0);
    amount = Math.abs(Math.max(amount, minPercentage));

    toGrow = sRow + 1;
    start = sRow;
    end = -1;
  }

  eCol[toGrow] = pCol[toGrow] + amount;
  end *= direction;
  for (let i = start; i * direction < end; i += direction) {
    const curr = pCol[i];
    if (amount >= curr) {
      eCol[i] = 0;
      amount -= curr;
    } else {
      eCol[i] = curr - amount;
      amount = 0;
      break;
    }
  }
});

/**
 * @name resizeDrawer
 */
reducer.on(Actions.resizeDrawer, ({ currentProfile, profiles, editing }, { amount }) => {
  if (!editing) {
    if (__DEV__) {
      warning(false, '[resizeDrawer] Invalid oparation: editing did not start.');
    }
    return;
  }

  const profile = profiles[currentProfile];
  editing.drawerWidth = Math.min(Math.max(profile.drawerWidth + amount, MIN_DRAWER_WIDTH), MAX_DRAWER_WIDTH);
});

export default AppStore;