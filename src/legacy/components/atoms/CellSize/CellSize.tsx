import React, { FC } from 'react';
import ClassNameModule from '../../../hooks/useClassName';
import AppStore from '../../../store/app';
import cnm from './CellSize.scss';

const useClassName = ClassNameModule(cnm);

type CellSizeProps = {
  col: number;
  row: number;
};

const CellSize: FC<CellSizeProps> = ({ col, row }) => {
  const { editing, profiles, currentProfile } = AppStore.useState();

  const profile = editing || profiles[currentProfile];
  const width = profile.columns[col];
  const height = profile.rows[col][row];

  return (
    <div className={useClassName(['size'])}>
      W: {width} px / H: {`${height}`.slice(0, 5)} %
    </div>
  );
};

export default CellSize;
