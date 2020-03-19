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
  const base: [number, number[]][] = [
    [300, [10, 20, 50, 20]],
    [500, [50, 30, 20]],
  ];

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
      height: 'small',
    },
  };
};

export const MultiRowProfileProvider = initStoreHook(createInitialState('default profile'));
