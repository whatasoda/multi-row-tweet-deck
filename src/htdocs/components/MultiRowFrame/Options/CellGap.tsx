import React from 'react';
import styled from 'styled-components';
import { useMultiRowProfileDispatch, useMultiRowProfile } from '../../../utils/useMultiRowProfile';
import { Icon } from '../../../../shared/components/Icon';

export const CellGapOption = () => {
  const dispatch = useMultiRowProfileDispatch();
  const profile = useMultiRowProfile();
  const { gap } = profile.cells;
  const g = `${gap / 2}px`;
  return (
    <>
      <SampleWrapper>
        <SampleCell style={{ width: `calc(50% - ${g})`, height: `calc(35% - ${g})` }} />
        <SampleCell style={{ width: `calc(50% - ${g})`, height: `calc(65% - ${g})` }} />
        <SampleCell style={{ width: `calc(50% - ${g})`, height: `calc(70% - ${g})` }} />
        <SampleCell style={{ width: `calc(50% - ${g})`, height: `calc(30% - ${g})` }} />
      </SampleWrapper>
      <Setter>
        <Button onClick={() => dispatch('setCells', { gap: gap - 1 })}>
          <Icon icon="minus" size="22px" />
        </Button>
        <span>{gap}</span>
        <Button onClick={() => dispatch('setCells', { gap: gap + 1 })}>
          <Icon icon="plus" size="20px" />
        </Button>
      </Setter>
    </>
  );
};

const SampleWrapper = styled.div`
  width: 100%;
  height: 182px;
  box-sizing: border-box;
  padding: 0 4px;
  background-color: ${({ theme: { color } }) => color.cellsBackground};
  background-clip: content-box;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-between;
`;

const SampleCell = styled.div`
  background-color: ${({ theme: { color } }) => color.cellBackground};
  background-clip: content-box;
  box-sizing: border-box;
  flex: 0 0 auto;
`;

const Setter = styled.div`
  margin-top: 10px;
  display: flex;
  padding: 0 40px;
  font-size: 22px;
  justify-content: space-between;
`;

const Button = styled.button`
  border-radius: 4px;
  background-color: ${({ theme: { color } }) => color.cellBackground};
  padding: 6px;
  height: 34px;
  width: 34px;
  box-sizing: border-box;
  text-align: center;
  &:hover {
    background-color: ${({ theme: { color } }) => color.cellsBackground};
  }
  &:active {
    svg {
      fill: ${({ theme: { color } }) => color.primaryButtonPushed};
    }
  }
  svg {
    fill: ${({ theme: { color } }) => color.primaryText};
  }
`;
