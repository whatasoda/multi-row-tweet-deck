import React from 'react';
import styled from 'styled-components';
import logoImg from '../../../assets/icons/icon-128.png';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => <StyledImg className={className} src={logoImg} />;

const StyledImg = styled.img`
  width: 1em;
  height: 1em;
  padding: 1px;
  box-sizing: border-box;
  display: inline-block;
  user-select: none;
  background-color: #fff2;
  border-radius: 0.1em;
`;
