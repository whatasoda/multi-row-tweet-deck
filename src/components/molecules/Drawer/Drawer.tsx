import React, { FC } from 'react';
import useDragger from '../../../hooks/useDragger';
import usePointer from '../../../hooks/usePointer';
import AppStore from '../../../store/app';
import { NativeClassName } from '../../../style/appStyle';
import { useDrawerStyle } from '../../../style/useStyleModule';
import DragHandle from '../../atoms/DragHandle';
import { SelectGap, SelectHeaderType, SelectProfile } from '../../atoms/Select';

type DrawerProps = {};

const Drawer: FC<DrawerProps> = () => {
  const { commitEdit } = AppStore.useActions();
  const { currentProfile, profiles } = AppStore.useState();
  const profile = profiles[currentProfile];
  const pointer = usePointer();

  const [drawerStyle, updateDrawerStyle] = useDrawerStyle('drawer');
  const startDrawer = useDragger(pointer, 0, {
    onUpdate: updateDrawerStyle,
    onEnd: commitEdit,
  });

  return (
    <div className={NativeClassName.html.drawer} style={drawerStyle}>
      <div className={'compose'}>
        <SelectProfile />
        <SelectHeaderType type={profile.headerType} />
        <SelectGap defaultGap={profile.cellGap} />
      </div>
      <DragHandle type="col" start={startDrawer} />
    </div>
  );
};

export default Drawer;
