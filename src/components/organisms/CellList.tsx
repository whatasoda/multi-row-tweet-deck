import React, { FC } from 'react';
import useProfile from '../../hooks/useProfile';
import { NativeClassName } from '../../style/appStyle';
import Column from '../molecules/Column';

type CellListProps = {};

const CellList: FC<CellListProps> = () => {
  const profile = useProfile();
  return (
    <div className={NativeClassName.html.columnsContainer + ' scroll-h'}>
      <div className={NativeClassName.html.columns + ' horizontal-flow-container'}>
        {profile.rows.map((rowList, col) => (
          <Column key={col} col={col} rows={rowList} />
        ))}
      </div>
    </div>
  );
};

export default CellList;
