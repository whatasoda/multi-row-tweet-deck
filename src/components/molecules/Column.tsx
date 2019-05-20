import React, { FC } from 'react';
import Cell from './Cell';

type ColumnProps = {
  col: number;
  rows: number[];
};

const Column: FC<ColumnProps> = ({ col, rows }) => (
  <>
    {rows.map((_, i, { length }) => (
      <Cell key={`${col}:${i}`} col={col} row={i} isLastRow={i === length - 1} />
    ))}
  </>
);

export default Column;
