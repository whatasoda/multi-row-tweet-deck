import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '../../../shared/components/Icon';
import { TwitterColor } from '../../../shared/theme';
import { Splitter } from './Splitter';
import { useMultiRowProfileDispatch } from '../../utils/useMultiRowProfile';

export const ColumnCreator = () => {
  const dispatch = useMultiRowProfileDispatch();
  const [mode, setMode] = useState<'unset' | 'create'>('unset');

  return (
    <Wrapper>
      {mode === 'unset' && (
        <AreaButton onClick={() => setMode('create')}>
          <StyledIcon icon="page-break" size="6vh" color={TwitterColor.green} />
        </AreaButton>
      )}
      <StyledSplitter
        active={mode === 'create'}
        type="horizontal"
        onSplit={({ px }) => (setMode('unset'), dispatch('createColumn', { width: px }))}
        onCanceled={() => setMode('unset')}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  width: 100vw;
  display: flex;
`;

const AreaButton = styled.button`
  display: inline-block;
  height: 100%;
  width: calc(6vh + 80px);
  text-align: left;
  padding: 0 40px;
  border-radius: 4px;
  &:hover {
    opacity: 0.7;
    background-color: #9999;
  }
`;

const StyledIcon = styled(Icon)`
  transform: rotateZ(90deg);
`;

const StyledSplitter = styled(Splitter)`
  height: 100%;
  width: 100%;
`;
