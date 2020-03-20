import React from 'react';
import styled from 'styled-components';
import { HEADER_HEIGHT, MIN_DRAWER_WIDTH } from '../../../shared/constants';
import { useMultiRowProfileDispatch } from '../../utils/useMultiRowProfile';

const heightList = Object.keys(HEADER_HEIGHT) as OneOfHeaderHeight[];

interface OptionsProps {
  profile: MultiRowProfile;
}

export const Options = ({ profile }: OptionsProps) => {
  const dispatch = useMultiRowProfileDispatch();
  return (
    <>
      <Section>
        <Title>Header</Title>
        <SampleWrapper>
          {heightList.map((height) => (
            <HeaderSample key={height} Height={height}>
              <Radio
                defaultChecked={height === profile.header.height}
                onChange={() => dispatch('setHeader', { height })}
              />
              {height[0].toUpperCase() + height.slice(1)}
            </HeaderSample>
          ))}
        </SampleWrapper>
      </Section>
    </>
  );
};

const Section = styled.div`
  padding: 10px 0;
  width: ${MIN_DRAWER_WIDTH - 30}px;
`;

const Title = styled.div`
  font-weight: 900;
  padding: 0 0 4px 4px;
  margin-bottom: 14px;
  border-bottom: 2px solid ${({ theme: { color } }) => color.primaryText};
`;

const SampleWrapper = styled.div`
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
  font-size: 16px;
  font-weight: 900;
  display: flex;
  align-items: center;
`;
