import React, { FC, MouseEventHandler } from 'react';
import ClassNameModule from '../../../hooks/useClassName';
import cnm from './DragHandle.scss';

const useClassName = ClassNameModule(cnm);

type DragHandleProps = {
  type: 'col' | 'row';
  start: MouseEventHandler;
};

const DragHandle: FC<DragHandleProps> = ({ type, start }) => (
  <div className={useClassName(['drag-handle__container', `drag-handle__container--${type}`])} onMouseDown={start} />
);

export default DragHandle;
