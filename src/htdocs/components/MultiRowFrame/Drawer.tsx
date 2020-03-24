import React, { useMemo, useRef } from 'react';
import styled, { css } from 'styled-components';
import shallowequal from 'shallowequal';
import { createGeneralStyles, DEFAULT_VANILLA } from '../../../shared/styles/general';
import { TwitterColor } from '../../../shared/theme';
import { useMultiRowProfileDispatch, useMultiRowProfile } from '../../utils/useMultiRowProfile';
import { useDrag } from '../../utils/useDrag';
import { DragHandleHorizontal } from './DragHandle';
import { MIN_DRAWER_WIDTH } from '../../../shared/constants';

interface WrapperWithDrawerProps {
  opened: boolean;
  drawer: React.ReactElement | null;
  showHandle: boolean;
  className?: string;
  children?: React.ReactElement | null;
}

export const WrapperWithDrawer = ({ opened, drawer, showHandle, className, children }: WrapperWithDrawerProps) => {
  const profile = useMultiRowProfile(({ header, drawer }) => ({ header, drawer }), shallowequal);

  const dispatch = useMultiRowProfileDispatch();
  const drawerWidthRef = useRef(profile.drawer.width);
  const handleDrawerWidth = useDrag(({ mode, start: [start], curr: [curr] }) => {
    if (mode === 'start') drawerWidthRef.current = profile.drawer.width;
    dispatch('setDrawer', { width: drawerWidthRef.current - start + curr });
  });

  const { appContentClosed, appContentOpened, drawer: drawerStyle } = useMemo(() => {
    return createGeneralStyles(profile);
  }, [profile]);

  return (
    <Wrapper className={className} Opened={opened} style={opened ? appContentOpened : appContentClosed}>
      <Drawer style={drawerStyle}>
        <DrawerContentWrapper children={opened ? drawer : null} />
      </Drawer>
      {showHandle && <DragHandleHorizontal Size="6px" hidden={!opened} {...handleDrawerWidth} />}
      {children}
    </Wrapper>
  );
};

const styleOpened = css`
  transform: translateX(${DEFAULT_VANILLA.drawerWidth}px);
  margin-right: ${DEFAULT_VANILLA.drawerWidth}px;
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
