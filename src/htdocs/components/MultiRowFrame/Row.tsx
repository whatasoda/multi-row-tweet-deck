import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { CellStyles } from '../../../shared/styles/cell';
import { GeneralStyles } from '../../../shared/styles/general';
import { useMultiRowProfileDispatch } from '../../utils/useMultiRowProfile';
import { useDrag } from '../../utils/useDrag';
import { DragHandleVertical } from './DragHandle';
import { Icon } from '../../../shared/components/Icon';
import { TwitterColor } from '../../../shared/theme';
import { Splitter } from './Splitter';

interface RowProps {
  cellStyles: CellStyles;
  generalStyles: GeneralStyles;
  row: RowProfile;
  totalHeight: number;
  isFirstRow: boolean;
  isLastRow: boolean;
}

export const Row = ({ row, cellStyles, generalStyles, totalHeight, isLastRow }: RowProps) => {
  const dispatch = useMultiRowProfileDispatch();
  const prevHeightRef = useRef(row.height);
  const [mode, setMode] = useState<'unset' | 'split'>('unset');

  const handleVertical = useDrag(({ mode, start: [, start], curr: [, curr] }) => {
    if (mode === 'start') prevHeightRef.current = totalHeight;
    const pct = ((curr - start) / window.innerHeight) * 100;
    dispatch('tweakRowHeightByBoundary', row.columnId, row.id, prevHeightRef.current + pct);
  });

  const rowStyle = cellStyles.cells[row.columnId][1][row.id];
  const { columnHeader } = generalStyles;

  return (
    <>
      <Wrapper style={rowStyle}>
        <Header style={columnHeader}>
          <Button Height={columnHeader.height} onClick={() => setMode('split')}>
            <Icon size="80%" icon="page-break" color={TwitterColor.green} />
          </Button>
          <Button Height={columnHeader.height} onClick={() => dispatch('removeRow', row.columnId, row.id)}>
            <Icon size="80%" icon="bin" color={TwitterColor.red} />
          </Button>
        </Header>
        <StyledSplitter
          type="vertical"
          active={mode === 'split'}
          headerHeight={columnHeader.height}
          onCanceled={() => setMode('unset')}
          onSplit={(value) => (setMode('unset'), dispatch('splitRow', row.columnId, row.id, value.pct))}
        />
      </Wrapper>
      {isLastRow ? null : <DragHandleVertical Size={'0'} hidden={mode === 'split'} {...handleVertical} />}
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

const Header = styled.header`
  overflow: hidden;
  background-color: ${({ theme: { color } }) => color.cellBackground};
  border-bottom: 1px solid ${({ theme: { color } }) => color.border};
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-right: 4px;
`;

const Button = styled.button<{ Height: string }>`
  height: inherit;
  padding: 0 4px 4px;
  box-sizing: border-box;
  width: ${({ Height }) => Height};
  appearance: none;
  writing-mode: unset;
  background: none;
  border: none;
  box-shadow: none;
  cursor: pointer;
`;

const StyledSplitter = styled(Splitter)<{ headerHeight: string }>`
  height: calc(100% - ${({ headerHeight }) => headerHeight});
  width: 100%;
`;
