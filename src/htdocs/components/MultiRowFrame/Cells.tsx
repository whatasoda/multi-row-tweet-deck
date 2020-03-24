import React, { useMemo } from 'react';
import { createGeneralStyles } from '../../../shared/styles/general';
import { createCellStyles } from '../../../shared/styles/cell';
import styled from 'styled-components';
import { Column } from './Column';
import { ColumnCreator } from './ColumnCreator';
import { useMultiRowProfile } from '../../utils/useMultiRowProfile';

interface CellsProps {
  showHandle: boolean;
  className?: string;
}

export const Cells = ({ showHandle, className }: CellsProps) => {
  const profile = useMultiRowProfile();
  const [cellStyles, generalStyles] = useMemo(() => {
    const cellStyles = createCellStyles(profile);
    const generalStyles = createGeneralStyles(profile, { drawerWidth: 300, headerHeight: 20 });
    return [cellStyles, generalStyles];
  }, [profile]);

  const { columns } = profile.cells;

  return (
    <Wrapper className={className}>
      <Scroll>
        {profile.cells.columnOrder.map((id) => (
          <Column
            key={id}
            showHandle={showHandle}
            column={columns[id]}
            cellStyles={cellStyles}
            generalStyles={generalStyles}
          />
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
