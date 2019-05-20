import React, { FC } from 'react';
import { NativeClassName } from '../../style/appStyle';
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
        transform: 'translateX(400px)',
        marginRight: '400px',
        zIndex: 1,
        ...appContentStyle,
      }}
    >
      <Drawer />
      <CellList />
    </div>
  );
};

export default AppContent;
