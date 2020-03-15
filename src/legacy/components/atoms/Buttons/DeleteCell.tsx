import React, { FC, useCallback } from 'react';
import AppStore from '../../../store/app';
import Icon from '../Icon';
import useButtonClass from './cnm';

type DeleteCellProps = {
  col: number;
  row: number;
};

const DeleteCell: FC<DeleteCellProps> = ({ col, row }) => {
  const { deleteCell } = AppStore.useActions();
  const handle = useCallback(() => deleteCell([col, row]), [col, row]);
  return (
    <div className={useButtonClass(['delete-cell-box'], ['column-header-links'])}>
      <a href="#" className={useButtonClass(['delete-cell-button'], ['column-header-link'])} onClick={handle}>
        <Icon type="close" />
      </a>
    </div>
  );
};

export default DeleteCell;
