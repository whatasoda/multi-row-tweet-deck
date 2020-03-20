import React from 'react';
import styled from 'styled-components';
import { NavBar } from './NavBar';
import { Cells } from './Cells';
import { Options } from './Options';
import { WrapperWithDrawer } from './Drawer';

interface MultiRowFrameProps {
  drawerType: OneOfDrawerType;
  setDrawerType: (type: OneOfDrawerType) => void;
  saveProfile: () => Promise<void>;
  discardChanges: () => void;
  profileList: ProfileWithMetaData[];
  updateProfileList: (rule: OneOfProfileSortRule) => Promise<void>;
  switchProfile: (id: string) => Promise<void>;
  deleteCurrentProfile: () => Promise<void>;
}

export const MultiRowFrame = ({ drawerType, setDrawerType, saveProfile, discardChanges }: MultiRowFrameProps) => (
  <Wrapper>
    <CustomNavBar type={drawerType} setDrawerType={setDrawerType} />
    <StyledWrapperWithDrawer
      opened={drawerType !== 'unset'}
      drawer={drawerType === 'options' ? <Options {...{ saveProfile, discardChanges }} /> : null}
    >
      <CustomCells />
    </StyledWrapperWithDrawer>
  </Wrapper>
);

const StyledWrapperWithDrawer = styled(WrapperWithDrawer)`
  position: absolute;
  left: 60px;
  top: 0;
  bottom: 0;
  right: 0;
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  user-select: none;
  overflow: hidden;
  color: ${({ theme: { color } }) => color.primaryText};
`;

const CustomNavBar = styled(NavBar)`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
`;

const CustomCells = styled(Cells)`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
`;
