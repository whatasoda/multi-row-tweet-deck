import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '../../../shared/components/Icon';
import { TwitterColor } from '../../../shared/theme';
import { Splitter } from './Splitter';
import { useMultiRowProfileDispatch } from '../../utils/useMultiRowProfile';

interface ColumnCreatorProps {
  showHandle: boolean;
}

export const ColumnCreator = ({ showHandle }: ColumnCreatorProps) => {
  const dispatch = useMultiRowProfileDispatch();
  const [mode, setMode] = useState<'unset' | 'create'>('unset');

  return (
    <Wrapper>
      {mode === 'unset' && showHandle && <AreaButton icon="page-break" onClick={() => setMode('create')} />}
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
  width: 100%;
  display: flex;
`;

const AreaButton = styled(Icon.Button)`
  height: 100%;
  width: calc(6vh + 80px);
  font-size: 6vh;
  color: ${TwitterColor.green};
  & > svg {
    transform: rotateZ(90deg);
  }
`;

const StyledSplitter = styled(Splitter)`
  height: 100%;
  width: 100%;
`;
