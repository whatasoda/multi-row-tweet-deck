import React from 'react';
import styled from 'styled-components';
import { Icon } from '../../shared/components/Icon';
import { TwitterColor } from '../../shared/theme';
import { Logo } from '../../shared/components/Logo';
import { LanguageSelection } from '../utils/LanguageSelection';

interface NavBarProps {
  className?: string;
  type: OneOfDrawerType;
  setDrawerType: (type: OneOfDrawerType) => void;
}

export const NavBar = ({ className, type: curr, setDrawerType }: NavBarProps) => {
  const icons: [OneOfDrawerType, React.ReactElement][] = [
    ['home', <Icon icon="home" />],
    ['profileList', <Icon icon="stack" />],
    ['options', <Icon icon="cog" />],
  ];

  return (
    <Wrapper className={className}>
      <TopWrapper>
        {icons.map(([type, icon]) => {
          const [Component, handleClick] =
            curr === type
              ? ([ButtonOpened, () => setDrawerType('unset')] as const)
              : ([ButtonClosed, () => setDrawerType(type)] as const);
          return <Component key={type} onClick={handleClick} children={icon} />;
        })}
        <StyledLanguageSelection />
      </TopWrapper>
      <MiddleWrapper>
        <HeroName>MultiRow{'\n'}TweetDeck</HeroName>
      </MiddleWrapper>
      <BottomWrapper>
        <Logo />
      </BottomWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  height: 100%;
  width: 60px;
  padding: 10px 12px 14px;
  box-sizing: border-box;
  background-color: ${({ theme: { color } }) => color.navBackground};
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`;

const TopWrapper = styled.div`
  flex: 0 0 auto;
  margin-right: -12px;
  color: ${TwitterColor.white};
`;

const MiddleWrapper = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
`;

const BottomWrapper = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  font-size: 36px;
  align-items: center;
`;

const ButtonBase = styled.button`
  height: 36px;
  font-size: 18px;
  line-height: 0;
  box-sizing: border-box;
  margin: 8px 0 10px;
  text-align: left;
  padding-left: 9px;
`;

const ButtonClosed = styled(ButtonBase)`
  width: 36px;
  border-radius: 45px;
  background-color: ${TwitterColor.blue};
  &:hover {
    background-color: ${TwitterColor.deepBlue};
  }
`;

const ButtonOpened = styled(ButtonBase)`
  width: 48px;
  border-radius: 45px 0 0 45px;
  background-color: ${({ theme: { color } }) => color.primaryButtonPushed};
`;

const HeroName = styled.h1`
  letter-spacing: 0.075em;
  writing-mode: vertical-rl;
  color: ${TwitterColor.white};
  padding: 0 8px 0 0;
  margin: 12px 0;
  transform: rotateZ(180deg);
  @media (max-height: 700px) {
    white-space: pre-line;
    font-size: 20px;
    line-height: 1.2em;
    padding: 0 2px;
  }
`;

const StyledLanguageSelection = styled(LanguageSelection)`
  font-size: 24px;
  width: 36px;
  text-align: center;
  padding: 2px 0;
`;
