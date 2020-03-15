import React, { FC } from 'react';
import ClassNameModule from '../../../hooks/useClassName';
import useDragger from '../../../hooks/useDragger';
import usePointer from '../../../hooks/usePointer';
import AppStore from '../../../store/app';
import { NativeClassName } from '../../../style/appStyle';
import { useColStyle, useRowStyle } from '../../../style/useStyleModule';
import { DeleteCell } from '../../atoms/Buttons';
import CreateRow from '../../atoms/Buttons/CreateRow';
import CellSize from '../../atoms/CellSize';
import DragHandle from '../../atoms/DragHandle';
import cnm from './Cell.scss';

const useClassName = ClassNameModule(cnm);

type CellProps = {
  col: number;
  row: number;
  isLastRow: boolean;
};

const Cell: FC<CellProps> = ({ col, row, isLastRow }) => {
  const { commitEdit } = AppStore.useActions();
  const pointer = usePointer();

  const [rowStyle, updateRowStyle] = useRowStyle([col, row]);
  const [colStyle, updateColStyle] = useColStyle(col);

  const startCol = useDragger(pointer, 0, {
    onUpdate: updateColStyle,
    onEnd: commitEdit,
  });

  const startRow = useDragger(pointer, 1, {
    onUpdate: updateRowStyle,
    onEnd: commitEdit,
  });

  return (
    <div className={useClassName([], [NativeClassName.html.column])} style={{ ...rowStyle, ...colStyle }}>
      <header className={useClassName(['header'], ['column-header'])}>
        <DeleteCell col={col} row={row} />
        <CellSize col={col} row={row} />
      </header>
      <CreateRow col={col} row={row} />
      <div className={useClassName(['handle-container'])}>
        {!isLastRow && <DragHandle start={startRow} type="row" />}
        <DragHandle start={startCol} type="col" />
      </div>
    </div>
  );
};

export default Cell;
