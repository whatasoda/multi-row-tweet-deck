import React from 'react';
import styled from 'styled-components';
import { HEADER_HEIGHT, MIN_DRAWER_WIDTH } from '../../../shared/constants';
import { useMultiRowProfileDispatch } from '../../utils/useMultiRowProfile';
import { Icon } from '../../../shared/components/Icon';

const heightList = Object.keys(HEADER_HEIGHT) as OneOfHeaderHeight[];

interface OptionsProps {
  profile: MultiRowProfile;
}

export const Options = ({ profile }: OptionsProps) => {
  const dispatch = useMultiRowProfileDispatch();
  const { gap } = profile.cells;
  const g = `${gap / 2}px`;

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
      <Section>
        <Title>Gap</Title>
        <GapSampleWrapper>
          <GapSampleCell style={{ width: `calc(50% - ${g})`, height: `calc(35% - ${g})` }} />
          <GapSampleCell style={{ width: `calc(50% - ${g})`, height: `calc(65% - ${g})` }} />
          <GapSampleCell style={{ width: `calc(50% - ${g})`, height: `calc(70% - ${g})` }} />
          <GapSampleCell style={{ width: `calc(50% - ${g})`, height: `calc(30% - ${g})` }} />
        </GapSampleWrapper>
        <GapTweakerWrapper>
          <Button onClick={() => dispatch('setCells', { gap: gap - 1 })}>
            <Icon icon="minus" size="22px" />
          </Button>
          <span>{gap}</span>
          <Button onClick={() => dispatch('setCells', { gap: gap + 1 })}>
            <Icon icon="plus" size="20px" />
          </Button>
        </GapTweakerWrapper>
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
  border-bottom: 2px solid currentColor;
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
  color: ${({ theme: { color } }) => color.primaryText};
  font-size: 16px;
  font-weight: 900;
  display: flex;
  align-items: center;
`;

const GapSampleWrapper = styled.div`
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

const GapSampleCell = styled.div`
  background-color: ${({ theme: { color } }) => color.cellBackground};
  background-clip: content-box;
  box-sizing: border-box;
  flex: 0 0 auto;
`;

const GapTweakerWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  padding: 0 42px;
  font-size: 20px;
  justify-content: space-between;
`;

const Button = styled.button`
  border-radius: 4px;
  background-color: ${({ theme: { color } }) => color.cellBackground};
  padding: 2px;
  height: 26px;
  width: 26px;
  box-sizing: border-box;
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
