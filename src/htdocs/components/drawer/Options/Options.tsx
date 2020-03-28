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
      <SaveButton icon="checkmark" color={TwitterColor.green} onClick={saveProfile} />
      <SaveButton icon="cross" color={TwitterColor.red} onClick={discardChanges} />
    </SectionBottom>
  </>
);

const SaveButton = styled(Icon.Button)`
  padding-left: 28px;
  padding-right: 28px;
  font-size: 20px;
  flex: 0 0 auto;
`;
