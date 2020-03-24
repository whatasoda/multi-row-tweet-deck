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
  showHandle: boolean;
  cellStyles: CellStyles;
  generalStyles: GeneralStyles;
  row: RowProfile;
  totalHeight: number;
  isFirstRow: boolean;
  isLastRow: boolean;
}

export const Row = ({ showHandle, row, cellStyles, generalStyles, totalHeight, isLastRow }: RowProps) => {
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
  const { columnId, id } = row;

  return (
    <>
      <Wrapper style={rowStyle}>
        <Header style={columnHeader}>
          <HeaderIcon icon="sphere" />
          <HeaderTitle>Column</HeaderTitle>
        </Header>
        {showHandle && (
          <ButtonWrapper>
            <Icon.Button icon="page-break" color={TwitterColor.green} onClick={() => setMode('split')} />
            <Icon.Button icon="bin" color={TwitterColor.red} onClick={() => dispatch('removeRow', columnId, id)} />
          </ButtonWrapper>
        )}
        <StyledSplitter
          type="vertical"
          active={mode === 'split'}
          headerHeight={columnHeader.height}
          onCanceled={() => setMode('unset')}
          onSplit={(value) => (setMode('unset'), dispatch('splitRow', columnId, id, value.pct))}
        />
      </Wrapper>
      {isLastRow ? null : <DragHandleVertical Size="0" hidden={mode === 'split' || !showHandle} {...handleVertical} />}
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
  justify-content: flex-start;
  align-items: center;
  padding: 0 9px 0 0;
  &:before {
    flex: 0 0 auto;
    content: counter(cell-number);
    counter-increment: cell-number;
    font-size: 10px;
    margin: 1px 0 0 3px;
    padding: 1px;
    line-height: 1;
    color: ${({ theme: { color } }) => color.subText};
    align-self: flex-start;
  }
`;

const HeaderIcon = styled(Icon)`
  font-size: 20px;
  margin: 0 6px 0 8px;
  color: ${({ theme: { color } }) => color.subText};
`;

const HeaderTitle = styled.span`
  font-size: 16px;
  color: ${({ theme: { color } }) => color.primaryText};
`;

const StyledSplitter = styled(Splitter)<{ headerHeight: string }>`
  height: calc(100% - ${({ headerHeight }) => headerHeight});
  width: 100%;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  padding: 2px 8px 4px;
  box-sizing: border-box;
  font-size: 22px;
  border-radius: 0 0 8px 8px;
  background: ${({ theme: { color } }) => color.border};
  right: 8px;
  top: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;
