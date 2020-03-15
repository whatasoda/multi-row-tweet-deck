import React, { FC } from 'react';
import AppStore from '../../../store/app';
import Icon from '../Icon';
import useButtonClass from './cnm';

const CreateCol: FC = () => {
  const { newCol } = AppStore.useActions();
  return (
    <a href="#" className={useButtonClass(['button', 'create-col'], ['stream-item'])} onClick={newCol}>
      <Icon type="plus" />
    </a>
  );
};

export default CreateCol;
