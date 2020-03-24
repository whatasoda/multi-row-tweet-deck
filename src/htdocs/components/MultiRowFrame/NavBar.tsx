import React from 'react';
import styled from 'styled-components';
import { Icon } from '../../../shared/components/Icon';
import { TwitterColor } from '../../../shared/theme';

interface NavBarProps {
  className?: string;
  type: OneOfDrawerType;
  setDrawerType: (type: OneOfDrawerType) => void;
}

export const NavBar = ({ className, type: curr, setDrawerType }: NavBarProps) => {
  const icons: [OneOfDrawerType, React.ReactElement][] = [
    ['profileList', <Icon icon="stack" />],
    ['options', <Icon icon="cog" />],
  ];

  return (
    <Wrapper className={className}>
      <ButtonWrapper>
        {icons.map(([type, icon]) => {
          const [Component, handleClick] =
            curr === type
              ? ([ButtonClose, () => setDrawerType('unset')] as const)
              : ([ButtonOpen, () => setDrawerType(type)] as const);
          return <Component key={type} onClick={handleClick} children={icon} />;
        })}
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
  color: ${TwitterColor.white};
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

const ButtonOpen = styled(ButtonBase)`
  width: 36px;
  border-radius: 45px;
  background-color: ${TwitterColor.blue};
  &:hover {
    background-color: ${TwitterColor.deepBlue};
  }
`;

const ButtonClose = styled(ButtonBase)`
  width: 48px;
  border-radius: 45px 0 0 45px;
  background-color: ${({ theme: { color } }) => color.primaryButtonPushed};
`;
