import React from 'react';
import styled from 'styled-components';
import { Icon } from '../../../../shared/components/Icon';
import { TwitterColor } from '../../../../shared/theme';
import { ProfileNameOption } from './ProfileName';
import { HeaderOption } from './Header';
import { CellGapOption } from './CellGap';
import { Section, Title, SectionBottom } from '../Section';

interface OptionsProps {
  saveProfile: () => Promise<void>;
  discardChanges: () => void;
}

export const Options = ({ discardChanges, saveProfile }: OptionsProps) => (
  <>
    <Section>
      <Title>Profile Name</Title>
      <ProfileNameOption />
    </Section>
    <Section>
      <Title>Header</Title>
      <HeaderOption />
    </Section>
    <Section>
      <Title>Cell Gap</Title>
      <CellGapOption />
    </Section>
    <SectionBottom>
      <Title>Save or Discard</Title>
      <SaveButton onClick={saveProfile}>
        <Icon icon="checkmark" size="30px" color={TwitterColor.green} />
      </SaveButton>
      <SaveButton onClick={discardChanges}>
        <Icon icon="cross" size="30px" color={TwitterColor.red} />
      </SaveButton>
    </SectionBottom>
  </>
);

const SaveButton = styled.button`
  padding: 4px 26px;
  border-radius: 4px;
  opacity: 0.7;
  flex: 0 0 auto;
  &:hover {
    opacity: 1;
    background-color: #9999;
  }
  &:active {
    background-color: #ddd;
  }
`;
