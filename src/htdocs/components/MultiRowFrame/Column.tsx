import React, { useRef } from 'react';
import { CellStyles } from '../../../shared/styles/cell';
import { GeneralStyles } from '../../../shared/styles/general';
import { useDrag } from '../../utils/useDrag';
import { useMultiRowProfileDispatch } from '../../utils/useMultiRowProfile';
import styled from 'styled-components';
import { DragHandleHorizontal } from './DragHandle';
import { Row } from './Row';

interface ColumnProps {
  cellStyles: CellStyles;
  generalStyles: GeneralStyles;
  column: ColumnProfile;
}

export const Column = ({ column, cellStyles, generalStyles }: ColumnProps) => {
  const dispatch = useMultiRowProfileDispatch();
  const prevWidthRef = useRef(column.width);

  const handleRight = useDrag(({ mode, start: [start], curr: [curr] }) => {
    if (mode === 'start') prevWidthRef.current = column.width;
    dispatch('tweakColumnWidth', column.id, prevWidthRef.current + curr - start);
  });

  const { marginRight: size, ...commonStyle } = cellStyles.common;
  const [columStyle] = cellStyles.cells[column.id];
  let totalHeight = 0;
  const rows = column.rowOrder.map((id, idx) => {
    const row = column.rows[id];
    totalHeight += row.height;

    return (
      <Row
        key={id}
        row={column.rows[id]}
        cellStyles={cellStyles}
        generalStyles={generalStyles}
        totalHeight={totalHeight}
        isFirstRow={idx === 0}
        isLastRow={idx === column.rowOrder.length - 1}
      />
    );
  });

  return (
    <>
      <Wrapper style={{ ...commonStyle, ...columStyle }}>{rows}</Wrapper>
      <DragHandleHorizontal Size={`${size || 0}`} {...handleRight} />
    </>
  );
};

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  position: relative;
`;
