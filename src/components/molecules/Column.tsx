import React, { FC } from 'react';
import Cell from './Cell';

type ColumnProps = {
  col: number;
  rows: number[];
};

const Column: FC<ColumnProps> = ({ col, rows }) => (
  <>
    {rows.map((_, i) => (
      <Cell key={`${col}:${i}`} col={col} row={i} />
    ))}
  </>
);

export default Column;
