import React from 'react';
import styled from 'styled-components';
import { Icon } from '../../../shared/components/Icon';
import { TwitterColor } from '../../../shared/theme';

interface NavBarProps {
  className?: string;
  drawerOpened: boolean;
  setDrawerOpened: (isOpened: boolean) => void;
}

export const NavBar = ({ className, drawerOpened, setDrawerOpened }: NavBarProps) => {
  const icon = <Icon icon="cog" size="18px" color={TwitterColor.white} />;
  return (
    <Wrapper className={className}>
      <ButtonWrapper>
        {drawerOpened ? (
          <OptionButtonClose onClick={() => setDrawerOpened(false)} children={icon} />
        ) : (
          <OptionButtonOpen onClick={() => setDrawerOpened(true)} children={icon} />
        )}
      </ButtonWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  height: 100%;
  width: 60px;
  padding: 10px 12px;
  box-sizing: border-box;
  background-color: ${({ theme: { color } }) => color.navBackground};
`;

const ButtonWrapper = styled.div`
  margin-right: -12px;
`;

const OptionButtonBase = styled.button`
  height: 36px;
  box-sizing: border-box;
  margin: 8px 0 10px;
  text-align: left;
  padding-left: 9px;
`;

const OptionButtonOpen = styled(OptionButtonBase)`
  width: 36px;
  border-radius: 45px;
  background-color: ${TwitterColor.blue};
  &:hover {
    background-color: ${TwitterColor.deepBlue};
  }
`;

const OptionButtonClose = styled(OptionButtonBase)`
  width: 48px;
  border-radius: 45px 0 0 45px;
  background-color: ${({ theme: { color } }) => color.primaryButtonPushed};
`;
