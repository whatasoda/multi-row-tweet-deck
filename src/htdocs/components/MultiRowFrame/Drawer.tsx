import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { createGeneralStyles } from '../../../shared/styles/general';
import { TwitterColor } from '../../../shared/theme';

const drawerWidth = 270;
const VANILLA: VanillaTweetDeck = { drawerWidth, headerHeight: 40 };

interface DrawerWrapperProps<P extends object, T extends DrawerItemMap> {
  open: Extract<keyof T, string> | false;
  profile: MultiRowProfile;
  props: P;
  className?: string;
}
interface DrawerItemMap extends Record<string, object> {}

const Dummy: React.ComponentType = () => <></>;

export const createDrawerWrapper = <P extends object, T extends DrawerItemMap>(
  propsFactory: (props: P) => T,
  components: {
    [K in keyof T]: React.ComponentType<T[K]>;
  },
): React.FC<DrawerWrapperProps<P, T>> => {
  return ({ open, props, profile, className, children }) => {
    const { drawer, appContentClosed, appContentOpened } = useMemo(() => {
      return createGeneralStyles(profile, VANILLA);
    }, [profile]);

    const [isOpen, Component, p] = open
      ? [true, components[open] as React.ComponentType, propsFactory(props)[open]]
      : [false, Dummy, {}];

    return (
      <Wrapper Opened={isOpen} style={isOpen ? appContentOpened : appContentClosed} className={className}>
        <Drawer style={drawer}>{Component && <Component {...p} />}</Drawer>
        {children}
      </Wrapper>
    );
  };
};

const styleOpened = css`
  transform: translateX(${drawerWidth}px);
  margin-right: ${drawerWidth}px;
  transition: 200ms transform, margin-right;
`;

const Wrapper = styled.div<{ Opened: boolean }>`
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
