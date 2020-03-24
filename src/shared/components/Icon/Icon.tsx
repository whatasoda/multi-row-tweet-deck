import React from 'react';

import IcomoonReact from 'icomoon-react';
import { selection } from './selection';
import styled from 'styled-components';

export type OneOfIcon = typeof selection['icons'][number]['properties']['name'];
interface IconProps {
  icon: OneOfIcon;
  color?: string;
  className?: string;
}

export const Icon = ({ icon, color, className }: IconProps) => (
  <StyledIcomoonReact className={className} iconSet={selection} icon={icon} Color={color} />
);

const StyledIcomoonReact = styled(IcomoonReact)<{ Color?: string }>`
  width: 1em;
  height: 1em;
  color: ${({ Color }) => Color || 'inherit'};
  fill: currentColor;
`;

type ButtonProps = Omit<JSX.IntrinsicElements['button'], 'children' | 'ref'>;

Icon.Button = ({ icon, color, ...props }: IconProps & ButtonProps) => (
  <ButtonWrapper {...props} Color={color} children={<Icon icon={icon} />} />
);

const ButtonWrapper = styled.button<{ Color?: string }>`
  color: ${({ Color }) => Color || 'inherit'};
  display: inline-block;
  width: 1.4em;
  height: 1em;
  padding: 0.2em 0;
  text-align: center;
  box-sizing: content-box;
  line-height: 0;
  vertical-align: middle;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 0.1em;
    background-color: currentColor;
    opacity: 0;
  }
  &:hover {
    &:before {
      opacity: 0.2;
    }
  }
  &:active {
    &:before {
      background: none;
      box-shadow: 0 0 0.2em currentColor inset;
      opacity: 1;
    }
  }
`;
