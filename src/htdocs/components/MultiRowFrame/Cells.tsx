import React from 'react';
import styled from 'styled-components';
import { Column } from './Column';
import { ColumnCreator } from './ColumnCreator';
import { useMultiRowProfile } from '../../utils/useMultiRowProfile';

interface CellsProps {
  showHandle: boolean;
  className?: string;
}

export const Cells = ({ showHandle, className }: CellsProps) => {
  const columnOrder = useMultiRowProfile(({ cells }) => cells.columnOrder);
  return (
    <Wrapper className={className}>
      <Scroll>
        {columnOrder.map((id) => (
          <Column key={id} id={id} showHandle={showHandle} />
        ))}
        <ColumnCreator showHandle={showHandle} />
      </Scroll>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  width: calc(100% - 6px);
  overflow-y: hidden;
  overflow-x: auto;
`;

const Scroll = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  margin-right: 300px;
  counter-reset: cell-number;
`;
