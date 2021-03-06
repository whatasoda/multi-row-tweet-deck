import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useMultiRowProfileDispatch } from '../utils/useMultiRowProfile';
import { useDrag } from '../utils/useDrag';
import { DragHandleVertical } from '../utils/DragHandle';
import { Icon } from '../../shared/components/Icon';
import { TwitterColor } from '../../shared/theme';
import { Splitter } from '../utils/Splitter';

interface RowProps {
  showHandle: boolean;
  height: string;
  headerHeight: number;
  row: RowProfile;
  totalHeight: number;
  isFirstRow: boolean;
  isLastRow: boolean;
}

export const Row = ({ showHandle, row, height, headerHeight, totalHeight, isLastRow }: RowProps) => {
  const { columnId, id } = row;
  const [mode, setMode] = useState<'unset' | 'split'>('unset');

  const dispatch = useMultiRowProfileDispatch();
  const prevHeightRef = useRef(row.height);
  const handleVertical = useDrag(({ mode, start: [, start], curr: [, curr] }) => {
    if (mode === 'start') prevHeightRef.current = totalHeight;
    const pct = ((curr - start) / window.innerHeight) * 100;
    dispatch('tweakRowHeightByBoundary', columnId, id, prevHeightRef.current + pct);
  });

  return (
    <>
      <Wrapper style={{ height: height }}>
        <Header Height={headerHeight}>
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
          headerHeight={`${headerHeight}px`}
          onCanceled={() => setMode('unset')}
          onSplit={({ pct }) => (setMode('unset'), dispatch('splitRow', columnId, id, pct))}
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

const Header = styled.header<{ Height: number }>`
  height: ${({ Height }) => Height}px;
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
