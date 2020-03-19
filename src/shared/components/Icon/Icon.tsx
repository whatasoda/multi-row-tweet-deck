import React from 'react';

import IcomoonReact from 'icomoon-react';
import { selection } from './selection';

type OneOfIcon = typeof selection['icons'][number]['properties']['name'];

interface IconProps {
  icon: OneOfIcon;
  size: string | number;
  color?: string;
  className?: string;
}

export const Icon = ({ color, size = '100%', icon, className }: IconProps) => (
  <IcomoonReact className={className} iconSet={selection} color={color} size={size} icon={icon} />
);
