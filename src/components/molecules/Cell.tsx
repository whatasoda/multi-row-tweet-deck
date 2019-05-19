import React, { FC, MouseEventHandler, useMemo } from 'react';
import usePointer from '../../hooks/usePointer';
import AppStore from '../../store/app';
import { NativeClassName } from '../../style/appStyle';
import { useColStyle, useRowStyle } from '../../style/useStyleModule';
import DragHandle from '../atoms/DragHandle';

type CellProps = {
  col: number;
  row: number;
};

const Cell: FC<CellProps> = ({ col, row }) => {
  const { commitEdit } = AppStore.useActions();
  const pointer = usePointer();

  const [rowStyle, updateRowStyle] = useRowStyle([col, row]);
  const [colStyle, updateColStyle] = useColStyle(col);

  const [startCol, startRow] = useMemo<[MouseEventHandler, MouseEventHandler]>(() => {
    let prev: number | null = 0;
    let mode: 'row' | 'col' | null = null;
    const update = () => {
      const movement = pointer.movement();
      if (movement) {
        switch (mode) {
          case 'col': {
            if (prev !== movement[0]) {
              updateColStyle(movement[0]);
              prev = movement[0];
            }
            break;
          }
          case 'row': {
            if (prev !== movement[1]) {
              updateRowStyle(movement[1]);
              prev = movement[1];
            }
            break;
          }
        }
        requestAnimationFrame(update);
      } else {
        prev = null;
        mode = null;
        commitEdit();
      }
    };

    const start: MouseEventHandler = (e) => {
      pointer.start(e.nativeEvent);
      update();
    };

    const startRow: MouseEventHandler = (e) => {
      mode = 'row';
      start(e);
    };

    const startCol: MouseEventHandler = (e) => {
      mode = 'col';
      start(e);
    };

    return [startCol, startRow];
  }, [pointer]);

  return (
    <div className={NativeClassName.html.column} style={{ ...rowStyle, ...colStyle }}>
      <DragHandle start={startRow} type="row" />
      <DragHandle start={startCol} type="col" />
    </div>
  );
};

export default Cell;
