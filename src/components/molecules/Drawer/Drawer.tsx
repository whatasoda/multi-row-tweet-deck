import React, { FC } from 'react';
import useDragger from '../../../hooks/useDragger';
import usePointer from '../../../hooks/usePointer';
import AppStore from '../../../store/app';
import { NativeClassName } from '../../../style/appStyle';
import { useDrawerStyle } from '../../../style/useStyleModule';
import DragHandle from '../../atoms/DragHandle';

type DrawerProps = {};

const Drawer: FC<DrawerProps> = () => {
  const { commitEdit } = AppStore.useActions();
  const pointer = usePointer();

  const [drawerStyle, updateDrawerStyle] = useDrawerStyle('drawer');
  const startDrawer = useDragger(pointer, 0, {
    onUpdate: updateDrawerStyle,
    onEnd: commitEdit,
  });

  return (
    <div className={NativeClassName.html.drawer} style={drawerStyle}>
      <div className={'compose'} />
      <DragHandle type="col" start={startDrawer} />
    </div>
  );
};

export default Drawer;
