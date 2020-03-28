import React, { useRef, useMemo } from 'react';
import styled from 'styled-components';
import shallowequal from 'shallowequal';
import { useDrag } from '../utils/useDrag';
import { useMultiRowProfileDispatch, useMultiRowProfile } from '../utils/useMultiRowProfile';
import { DragHandleHorizontal } from '../utils/DragHandle';
import { Row } from './Row';
import { HEADER_HEIGHT } from '../../shared/constants';
import { createCellStylesInColumn } from '../../shared/styleFactory';

interface ColumnProps {
  id: string;
  showHandle: boolean;
}

export const Column = ({ id, showHandle }: ColumnProps) => {
  const selected = useMultiRowProfile(({ header, cells: { gap, columns } }) => {
    return [columns[id], HEADER_HEIGHT[header.height], gap] as const;
  }, shallowequal);
  const [column, headerHeight, gap] = selected;
  const [width, heightMap] = useMemo(() => createCellStylesInColumn(column, headerHeight, gap), [selected]);

  const dispatch = useMultiRowProfileDispatch();
  const prevWidthRef = useRef(column.width);

  const handleRight = useDrag(({ mode, start: [start], curr: [curr] }) => {
    if (mode === 'start') prevWidthRef.current = column.width;
    dispatch('tweakColumnWidth', column.id, prevWidthRef.current + curr - start);
  });

  let totalHeight = 0;
  const rows = column.rowOrder.map((id, idx) => {
    const row = column.rows[id];
    totalHeight += row.height;

    return (
      <Row
        key={id}
        showHandle={showHandle}
        row={column.rows[id]}
        height={heightMap[id]}
        headerHeight={headerHeight}
        totalHeight={totalHeight}
        isFirstRow={idx === 0}
        isLastRow={idx === column.rowOrder.length - 1}
      />
    );
  });

  return (
    <>
      <Wrapper style={{ width }}>{rows}</Wrapper>
      <DragHandleHorizontal hidden={!showHandle} Size={`${gap}px`} {...handleRight} />
    </>
  );
};

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  position: relative;
  flex: 0 0 auto;
`;
