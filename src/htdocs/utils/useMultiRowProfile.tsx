import { createStoreHook } from '../../shared/utils/storeHook';
import { createMultiRowProfileAction, MultiRowProfileReducer } from '../../shared/store/MultiRowProfile';
import { v4 as uuid } from 'uuid';

const [initStoreHook, useMultiRowProfile, useMultiRowProfileDispatch] = createStoreHook(
  createMultiRowProfileAction,
  MultiRowProfileReducer,
);
export { useMultiRowProfile, useMultiRowProfileDispatch };

const createInitialState = (displayName: string): MultiRowProfile => {
  const id = uuid();

  const gap = 3;
  const base = [
    [300, [20, 30, 50]],
    [500, [50, 30, 20]],
  ] as const;

  const cells = base.reduce<MultiRowProfile['cells']>(
    (acc, [width, rows]) => {
      const columnId = uuid();
      acc.columnOrder.push(columnId);
      acc.columns[columnId] = rows.reduce<ColumnProfile>(
        (acc, height) => {
          const rowId = uuid();
          acc.rowOrder.push(rowId);
          acc.rows[rowId] = { columnId, id: rowId, height };
          return acc;
        },
        { id: columnId, width, rows: {}, rowOrder: [] },
      );

      return acc;
    },
    { gap, columnOrder: [], columns: {} },
  );

  return {
    id,
    displayName,
    cells,
    drawer: {
      width: 300,
    },
    header: {
      height: 'medium',
    },
  };
};

export const MultiRowProfileProvider = initStoreHook(createInitialState('default profile'));
