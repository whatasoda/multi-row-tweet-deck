import React, { useState } from 'react';
import styled from 'styled-components';
import { NavBar, OneOfDrawerType } from './NavBar';
import { Cells } from './Cells';
import { Options } from './Options';
import { WrapperWithDrawer } from './Drawer';

interface MultiRowFrameProps {
  profile: MultiRowProfile;
}

export const MultiRowFrame = ({ profile }: MultiRowFrameProps) => {
  const [drawerType, setDrawerType] = useState<OneOfDrawerType>('options');

  return (
    <Wrapper>
      <CustomNavBar type={drawerType} setDrawerType={setDrawerType} />
      <StyledWrapperWithDrawer
        opened={drawerType !== 'unset'}
        profile={profile}
        drawer={drawerType === 'options' ? <Options profile={profile} /> : null}
      >
        <CustomCells profile={profile} />
      </StyledWrapperWithDrawer>
    </Wrapper>
  );
};

const StyledWrapperWithDrawer = styled(WrapperWithDrawer)`
  position: absolute;
  left: 60px;
  top: 0;
  bottom: 0;
  right: 0;
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  user-select: none;
  overflow: hidden;
  color: ${({ theme: { color } }) => color.primaryText};
`;

const CustomNavBar = styled(NavBar)`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
`;

const CustomCells = styled(Cells)`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
`;
