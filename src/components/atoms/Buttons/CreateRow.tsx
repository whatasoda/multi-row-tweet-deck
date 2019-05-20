import React, { FC, useCallback } from 'react';
import AppStore from '../../../store/app';
import Icon from '../Icon';
import useButtonClass from './cnm';

type CreateRowProps = {
  col: number;
  row: number;
};

const CreateRow: FC<CreateRowProps> = ({ col, row }) => {
  const { newRow } = AppStore.useActions();
  const handle = useCallback(() => newRow([col, row]), [col, row]);

  return (
    <a href="#" className={useButtonClass(['button', 'create-row'])} onClick={handle}>
      <Icon type="plus" />
    </a>
  );
};

export default CreateRow;
