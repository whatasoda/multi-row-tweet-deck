import React from 'react';
import styled from 'styled-components';
import { useMultiRowProfileDispatch, useMultiRowProfile } from '../../../utils/useMultiRowProfile';

export const ProfileNameOption = () => {
  const dispatch = useMultiRowProfileDispatch();
  const { displayName } = useMultiRowProfile();

  return (
    <>
      <StyledInput defaultValue={displayName} onBlur={(event) => dispatch('setDisplayName', event.target.value)} />
    </>
  );
};

const StyledInput = styled.input`
  border: none;
  height: 28px;
  width: 100%;
  padding: 6px;
  box-sizing: border-box;
  font-size: 16px;
  border-radius: 2px;
`;
