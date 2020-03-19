import React, { useMemo } from 'react';
import { createGeneralStyles } from '../../../shared/styles/general';
import { createCellStyles } from '../../../shared/styles/cell';
import styled from 'styled-components';
import { Column } from './Column';

interface MultiRowFrameProps {
  profile: MultiRowProfile;
}

export const MultiRowFrame = ({ profile }: MultiRowFrameProps) => {
  const [cellStyles, generalStyles] = useMemo(() => {
    const cellStyles = createCellStyles(profile);
    const generalStyles = createGeneralStyles(profile, { drawerWidth: 300, headerHeight: 20 });
    return [cellStyles, generalStyles];
  }, [profile]);

  const { columns } = profile.cells;

  return (
    <Scroll>
      <Wrapper>
        {profile.cells.columnOrder.map((id) => (
          <Column key={id} column={columns[id]} cellStyles={cellStyles} generalStyles={generalStyles} />
        ))}
      </Wrapper>
    </Scroll>
  );
};

const Scroll = styled.div`
  height: 100%;
  overflow-y: hidden;
  overflow-x: auto;
  background-color: ${({ theme: { color } }) => color.cellsBackground};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;
  height: 100%;
  padding: 0 0 0 6px;
  margin-right: 300px;
  /* min-width: 100%; */
  user-select: none;
`;
