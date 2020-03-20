import React, { useMemo, useRef } from 'react';
import styled, { css } from 'styled-components';
import { createGeneralStyles } from '../../../shared/styles/general';
import { TwitterColor } from '../../../shared/theme';
import { useMultiRowProfileDispatch, useMultiRowProfile } from '../../utils/useMultiRowProfile';
import { useDrag } from '../../utils/useDrag';
import { DragHandleHorizontal } from './DragHandle';
import { MIN_DRAWER_WIDTH } from '../../../shared/constants';

const drawerWidth = 270;
const VANILLA: VanillaTweetDeck = { drawerWidth, headerHeight: 40 };

interface WrapperWithDrawerProps {
  opened: boolean;
  drawer: React.ReactElement | null;
  className?: string;
  children?: React.ReactElement | null;
}

export const WrapperWithDrawer = ({ opened, drawer, className, children }: WrapperWithDrawerProps) => {
  const profile = useMultiRowProfile();
  const dispatch = useMultiRowProfileDispatch();
  const drawerWidthRef = useRef(profile.drawer.width);
  const handleDrawerWidth = useDrag(({ mode, start: [start], curr: [curr] }) => {
    if (mode === 'start') drawerWidthRef.current = profile.drawer.width;
    dispatch('setDrawer', { width: drawerWidthRef.current - start + curr });
  });

  const style = useMemo(() => {
    return createGeneralStyles(profile, VANILLA);
  }, [profile]);

  return (
    <Wrapper className={className} Opened={opened} style={opened ? style.appContentOpened : style.appContentClosed}>
      <Drawer style={style.drawer}>
        <DrawerContentWrapper children={opened ? drawer : null} />
      </Drawer>
      <DragHandleHorizontal Size="6px" hidden={!opened} {...handleDrawerWidth} />
      {children}
    </Wrapper>
  );
};

const styleOpened = css`
  transform: translateX(${drawerWidth}px);
  margin-right: ${drawerWidth}px;
`;

const Wrapper = styled.div<{ Opened: boolean }>`
  transition: 200ms transform, margin-right;
  ${({ Opened }) => Opened && styleOpened}
`;

const Drawer = styled.div`
  background-color: ${({ theme: { color } }) => color.primaryButtonPushed};
  color: ${TwitterColor.white};
  position: absolute;
  top: 0;
  height: 100%;
  padding: 0 15px;
  box-sizing: border-box;
`;

const DrawerContentWrapper = styled.div`
  position: relative;
  height: 100%;
  box-sizing: border-box;
  padding-top: 10px;
  width: ${MIN_DRAWER_WIDTH - 30}px;
`;
