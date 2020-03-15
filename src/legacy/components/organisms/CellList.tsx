import React, { FC, Fragment } from 'react';
import useProfile from '../../hooks/useProfile';
import { NativeClassName } from '../../style/appStyle';
import { CreateCol } from '../atoms/Buttons';
import Cell from '../molecules/Cell';

type CellListProps = {};

const CellList: FC<CellListProps> = () => {
  const profile = useProfile();
  return (
    <div className={NativeClassName.html.columnsContainer + ' scroll-h'}>
      <div className={NativeClassName.html.columns + ' horizontal-flow-container'}>
        {profile.rows.map((rowList, col) => (
          <Fragment key={col}>
            {rowList.map((_, i, { length: rLength }) => (
              <Cell key={`${col}:${i}`} col={col} row={i} isLastRow={i === rLength - 1} />
            ))}
          </Fragment>
        ))}
        <CreateCol />
      </div>
    </div>
  );
};

export default CellList;
