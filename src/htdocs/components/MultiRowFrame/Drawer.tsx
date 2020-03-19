import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { createGeneralStyles } from '../../../shared/styles/general';

interface DrawerRootProps {
  open: string | false;
  items: Record<string, () => JSX.Element>;
  profile: MultiRowProfile;
  className?: string;
}

const drawerWidth = 270;

export const DrawerRoot: React.FC<DrawerRootProps> = ({ open, items, profile, className, children }) => {
  const isOpen = open !== false && open in items;
  const { drawer, appContentClosed, appContentOpened } = useMemo(() => {
    return createGeneralStyles(profile, { drawerWidth, headerHeight: 40 });
  }, [profile]);

  return (
    <Wrapper Opened={isOpen} style={isOpen ? appContentOpened : appContentClosed} className={className}>
      <Drawer style={drawer}>{isOpen && items[open as string]()}</Drawer>
      {children}
    </Wrapper>
  );
};

const styleOpened = css`
  transition-duration: 200ms;
  transform: translateX(${drawerWidth}px);
  margin-right: ${drawerWidth}px;
`;

const Wrapper = styled.div<{ Opened: boolean }>`
  ${({ Opened }) => Opened && styleOpened}
`;

const Drawer = styled.div`
  background-color: ${({ theme: { color } }) => color.primaryButtonPushed};
  position: absolute;
  top: 0;
  height: 100%;
`;
