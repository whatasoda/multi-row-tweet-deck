import { v4 as uuid } from 'uuid';
import { createStoreModule } from '../utils/storeModule';
import { clamp } from '../utils/math';

const MIN_COLUMN_WIDTH = 100;

export const [createMultiRowProfileAction, createMultiRowProfileReducer] = createStoreModule({
  switchProfile: (profile: MultiRowProfile) => ({ payload: profile }),

  setDisplayName: (displayName: string) => ({ payload: displayName }),
  setDrawer: (drawer: Partial<MultiRowProfile['drawer']>) => ({ payload: drawer }),
  setHeader: (header: Partial<MultiRowProfile['header']>) => ({ payload: header }),
  setCells: (cells: Partial<Omit<MultiRowProfile['header'], 'columns' | 'colmunOrder'>>) => ({ payload: cells }),

  createColumn: (init: ColumnProfileInit, insert?: number) => ({
    payload: { id: uuid(), init, insert, rowId: uuid() },
  }),
  splitRow: (columnId: string, targetId: string, dominance: number) => ({
    payload: { newId: uuid(), columnId, targetId, dominance },
  }),
  removeRow: (columnId: string, id: string) => ({ payload: { columnId, id } }),

  tweakColumnWidth: (id: string, next: number) => ({ payload: { id, next } }),
  tweakRowHeightByBoundary: (columnId: string, id: string, nextBoundary: number) => ({
    payload: { columnId, id, nextBoundary },
  }),
});

export const MultiRowProfileReducer = createMultiRowProfileReducer<MultiRowProfile>({
  switchProfile: (_, { payload }) => ({ ...payload }),

  setDisplayName: (state, { payload }) => ({ ...state, displayName: payload }),
  setDrawer: (state, { payload }) => ({ ...state, drawer: { ...state.drawer, ...payload } }),
  setHeader: (state, { payload }) => ({ ...state, header: { ...state.header, ...payload } }),
  setCells: (state, { payload }) => ({ ...state, cells: { ...state.cells, ...payload } }),

  createColumn: (state, { payload: { id, init, insert = Infinity, rowId } }) => {
    const { columns, columnOrder } = state.cells;
    init.width = Math.max(init.width, MIN_COLUMN_WIDTH);
    const column = newColumn(id, init, rowId);

    insert = Math.min(insert, columnOrder.length);
    return {
      ...state,
      cells: {
        ...state.cells,
        columns: { ...columns, [column.id]: column },
        columnOrder: [...columnOrder.slice(0, insert), column.id, ...columnOrder.slice(insert)],
      },
    };
  },
  splitRow: (state, { payload: { newId, columnId, targetId, dominance } }) => {
    const prevColumn = state.cells.columns[columnId];
    const { rows, rowOrder } = prevColumn;
    const targetRow = rows[targetId];
    const targetIdx = rowOrder.indexOf(targetId);
    if (targetIdx === -1) return state;

    dominance = clamp(dominance, 0, 100) / 100;
    const insert = targetIdx + 1;
    const splitted: RowProfile = { ...targetRow, height: targetRow.height * dominance };
    const row = newRow(newId, columnId, { height: targetRow.height * (1 - dominance) });

    const column = {
      ...prevColumn,
      rows: { ...rows, [row.id]: row, [targetId]: splitted },
      rowOrder: [...rowOrder.slice(0, insert), row.id, ...rowOrder.slice(insert)],
    };

    return {
      ...state,
      cells: {
        ...state.cells,
        columns: {
          ...state.cells.columns,
          [columnId]: column,
        },
      },
    };
  },
  removeRow: (state, { payload: { columnId, id } }) => {
    const { cells } = state;
    const column = cells.columns[columnId];
    const idx = column.rowOrder.indexOf(id);
    if (idx === -1) return state;

    const rowOrder = [...column.rowOrder.slice(0, idx), ...column.rowOrder.slice(idx + 1)];

    if (rowOrder.length) {
      const rows = { ...column.rows };
      const heir = rows[rowOrder[Math.max(0, idx - 1)]];
      rows[heir.id] = { ...heir, height: heir.height + rows[id].height };
      delete rows[id];
      return {
        ...state,
        cells: {
          ...cells,
          columns: {
            ...cells.columns,
            [columnId]: { ...column, rows, rowOrder },
          },
        },
      };
    } else {
      // no rows in the column, so remove column too
      const idx = cells.columnOrder.indexOf(columnId);
      const columnOrder =
        idx === -1 ? cells.columnOrder : [...cells.columnOrder.slice(0, idx), ...cells.columnOrder.slice(idx + 1)];
      const columns = { ...cells.columns };
      delete columns[columnId];

      return {
        ...state,
        cells: {
          ...cells,
          columnOrder,
          columns,
        },
      };
    }
  },

  tweakColumnWidth: (state, { payload: { id, next } }) => {
    const prevCells = state.cells;
    return {
      ...state,
      cells: {
        ...prevCells,
        columns: { ...prevCells.columns, [id]: { ...prevCells.columns[id], width: Math.max(MIN_COLUMN_WIDTH, next) } },
      },
    };
  },

  tweakRowHeightByBoundary: (state, { payload: { columnId, id: upper, nextBoundary: next } }) => {
    const column = state.cells.columns[columnId];
    const { rows, rowOrder } = column;

    const idx = rowOrder.indexOf(upper);
    if (idx === -1 || idx >= rowOrder.length - 1) return state;
    const lower = rowOrder[idx + 1];

    const backwardTargets = rowOrder.slice(0, idx + 1).map((id) => rows[id]);
    const forwardTargets = rowOrder.slice(idx + 1).map((id) => rows[id]);

    next = clamp(next, 0, 100);
    const curr = backwardTargets.reduce((acc, { height }) => acc + height, 0);

    if (next === curr) return state;

    const nextRows = tweakHelper(
      next - curr,
      ...(next > curr ? ([upper, rows, forwardTargets] as const) : ([lower, rows, backwardTargets.reverse()] as const)),
    );

    return {
      ...state,
      cells: {
        ...state.cells,
        columns: {
          ...state.cells.columns,
          [columnId]: {
            ...column,
            rows: nextRows,
          },
        },
      },
    };
  },
});

const newColumn = (id: string, init: ColumnProfileInit, rowId: string): ColumnProfile => {
  const row = newRow(rowId, id, { height: 100 });
  const rows = { [rowId]: row };
  const rowOrder = [row.id];

  return { ...init, id, rows, rowOrder };
};

const newRow = (id: string, columnId: string, init: RowProfileInit): RowProfile => {
  return { ...init, columnId, id };
};

const tweakHelper = (rawChange: number, originId: string, rows: Record<string, RowProfile>, targets: RowProfile[]) => {
  let change = Math.abs(rawChange);
  const origin = rows[originId];
  const next = origin.height + change;
  const unnormalized: Record<string, RowProfile> = { ...rows, [originId]: { ...origin, height: next } };

  return targets.reduce((acc, row) => {
    if (change === 0) return acc;
    if (change <= row.height) {
      acc[row.id] = { ...row, height: row.height - change };
      change = 0;
    } else {
      acc[row.id] = { ...row, height: 0 };
      change -= row.height;
    }
    return acc;
  }, unnormalized);
};
