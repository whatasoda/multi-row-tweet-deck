import React, { useState } from 'react';
import styled from 'styled-components';
import { NavBar } from './NavBar';
import { Cells } from './Cells';
import { DrawerRoot } from './Drawer';

interface MultiRowFrameProps {
  profile: MultiRowProfile;
}

export const MultiRowFrame = ({ profile }: MultiRowFrameProps) => {
  const [drawerOpened, setDrawerOpened] = useState(true);
  return (
    <Wrapper>
      <CustomNavBar drawerOpened={drawerOpened} setDrawerOpened={setDrawerOpened} />
      <CustomDrawerRoot
        profile={profile}
        open={drawerOpened ? 'options' : false}
        items={{
          options() {
            return <></>;
          },
        }}
      >
        <Cells profile={profile} />
      </CustomDrawerRoot>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;

const CustomNavBar = styled(NavBar)`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
`;

const CustomDrawerRoot = styled(DrawerRoot)`
  position: absolute;
  left: 60px;
  top: 0;
  bottom: 0;
  right: 0;
`;
