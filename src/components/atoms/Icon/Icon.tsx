import React, { FC } from 'react';
import ClassNameModule from '../../../hooks/useClassName';

const useClassName = ClassNameModule({});

type IconProps = {
  type: keyof typeof ICON_CLASS_MAP;
};

const ICON_CLASS_MAP = {
  plus: ['icon-plus', 'icon-medium'],
};

const Icon: FC<IconProps> = ({ type }) => <i className={useClassName([], ICON_CLASS_MAP[type])} />;

export default Icon;
