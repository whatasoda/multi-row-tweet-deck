import React, { FC } from 'react';
import { NativeClassName } from '../../style/appStyle';
import NativeEnvironments from '../../style/NativeEnvironments';
import { useDrawerStyle } from '../../style/useStyleModule';
import Drawer from '../molecules/Drawer';
import CellList from './CellList';

type AppContentProps = {};

const AppContent: FC<AppContentProps> = () => {
  const [appContentStyle] = useDrawerStyle('appContent');

  return (
    <div
      className={NativeClassName.html.appContent}
      style={{
        transform: `translateX(${NativeEnvironments.drawerWidth}px)`,
        marginRight: `${NativeEnvironments.drawerWidth}px`,
        zIndex: 100,
        ...appContentStyle,
      }}
    >
      <Drawer />
      <CellList />
    </div>
  );
};

export default AppContent;
