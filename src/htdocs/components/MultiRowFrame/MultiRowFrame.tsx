import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { NavBar } from './NavBar';
import { Cells } from './Cells';
import { createDrawerWrapper } from './Drawer';
import { DragHandleHorizontal } from './DragHandle';
import { useDrag } from '../../utils/useDrag';
import { useMultiRowProfileDispatch } from '../../utils/useMultiRowProfile';
import { Options } from './Options';

interface MultiRowFrameProps {
  profile: MultiRowProfile;
}

export const MultiRowFrame = ({ profile }: MultiRowFrameProps) => {
  const [drawerOpened, setDrawerOpened] = useState(true);
  const drawerWidthRef = useRef(profile.drawer.width);
  const dispatch = useMultiRowProfileDispatch();
  const handleDrawerWidth = useDrag(({ mode, start: [start], curr: [curr] }) => {
    if (mode === 'start') drawerWidthRef.current = profile.drawer.width;
    dispatch('setDrawer', { width: drawerWidthRef.current - start + curr });
  });

  return (
    <Wrapper>
      <CustomNavBar drawerOpened={drawerOpened} setDrawerOpened={setDrawerOpened} />
      <StyledDrawerWrapper profile={profile} open={drawerOpened ? 'options' : false} props={{ profile }}>
        <DragHandleHorizontal Size="6px" hidden={!drawerOpened} {...handleDrawerWidth} />
        <CustomCells profile={profile} />
      </StyledDrawerWrapper>
    </Wrapper>
  );
};

const DrawerWrapper = createDrawerWrapper(({ profile }: { profile: MultiRowProfile }) => ({ options: { profile } }), {
  options: Options,
});

const StyledDrawerWrapper = styled(DrawerWrapper)`
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
