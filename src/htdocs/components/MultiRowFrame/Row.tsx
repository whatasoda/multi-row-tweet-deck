import React, { useRef } from 'react';
import { CellStyles } from '../../../shared/styles/cell';
import { GeneralStyles } from '../../../shared/styles/general';
import { useMultiRowProfileDispatch } from '../../utils/useMultiRowProfile';
import { useDrag } from '../../utils/useDrag';
import styled from 'styled-components';
import { DragHandleVertical } from './DragHandle';

interface RowProps {
  cellStyles: CellStyles;
  generalStyles: GeneralStyles;
  row: RowProfile;
  totalHeight: number;
  isFirstRow: boolean;
  isLastRow: boolean;
}

export const Row = ({ row, cellStyles, totalHeight, isLastRow }: RowProps) => {
  const dispatch = useMultiRowProfileDispatch();
  const prevHeightRef = useRef(row.height);

  const handleVertical = useDrag(({ mode, start: [, start], curr: [, curr] }) => {
    if (mode === 'start') prevHeightRef.current = totalHeight;
    const pct = ((curr - start) / window.innerHeight) * 100;
    dispatch('tweakRowHeightByBoundary', row.columnId, row.id, prevHeightRef.current + pct);
  });

  const rowStyle = cellStyles.cells[row.columnId][1][row.id];

  return (
    <>
      <Wrapper style={rowStyle} />
      {isLastRow ? null : <DragHandleVertical Size={'0'} {...handleVertical} />}
    </>
  );
};

const Wrapper = styled.div`
  border-radius: 0;
  position: relative;
  z-index: 1;
  overflow: hidden;
  background-color: ${({ theme }) => theme.color.cellBackground};
  font-size: 1rem;
  white-space: normal;
  width: 100%;
`;
