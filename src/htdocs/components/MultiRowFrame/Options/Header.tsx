import React from 'react';
import { HEADER_HEIGHT } from '../../../../shared/constants';
import { useMultiRowProfileDispatch, useMultiRowProfile } from '../../../utils/useMultiRowProfile';
import styled from 'styled-components';

const heightList = Object.keys(HEADER_HEIGHT).reverse() as OneOfHeaderHeight[];

export const HeaderOption = () => {
  const dispatch = useMultiRowProfileDispatch();
  const header = useMultiRowProfile(({ header }) => header);

  return (
    <HeaderSampleWrapper>
      {heightList.map((height) => (
        <HeaderSample key={height} Height={height}>
          <Radio defaultChecked={height === header.height} onChange={() => dispatch('setHeader', { height })} />
          {height[0].toUpperCase() + height.slice(1)}
        </HeaderSample>
      ))}
    </HeaderSampleWrapper>
  );
};

const HeaderSampleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const Radio = styled.input.attrs({ type: 'radio', name: 'header' })`
  margin: 0 12px 0 14px;
`;

const HeaderSample = styled.label<{ Height: OneOfHeaderHeight }>`
  height: ${({ Height }) => HEADER_HEIGHT[Height]}px;
  line-height: 0;
  margin: 0 4px 10px;
  box-sizing: border-box;
  background-color: ${({ theme: { color } }) => color.cellBackground};
  color: ${({ theme: { color } }) => color.primaryText};
  font-size: 16px;
  font-weight: 900;
  display: flex;
  align-items: center;
`;
