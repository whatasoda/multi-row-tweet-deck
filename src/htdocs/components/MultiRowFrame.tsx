import React from 'react';
import styled from 'styled-components';
import { NavBar } from './NavBar';
import { Cells } from './Cells';
import { Options } from './drawer/Options';
import { WrapperWithDrawer } from './drawer/Drawer';
import { ProfileList } from './drawer/ProfileList';

interface MultiRowFrameProps {
  drawerType: OneOfDrawerType;
  selectedProfileId: string | null;
  profileList: ProfileWithMetaData[];
  sortRule: OneOfProfileSortRule;
  setDrawerType: (type: OneOfDrawerType) => void;
  saveProfile: () => Promise<void>;
  discardChanges: () => void;
  reloadProfileList: () => Promise<void>;
  switchProfile: (id: string) => Promise<void>;
  deleteCurrentProfile: () => Promise<void>;
  createNewProfile: () => Promise<void>;
  selectCurrentProfile: () => Promise<void>;
  setSortRule: (rule: OneOfProfileSortRule) => void;
}

export const MultiRowFrame = ({
  drawerType: type,
  selectedProfileId,
  profileList,
  sortRule,
  setDrawerType,
  saveProfile,
  discardChanges,
  reloadProfileList,
  switchProfile,
  deleteCurrentProfile,
  createNewProfile,
  selectCurrentProfile,
  setSortRule,
}: MultiRowFrameProps) => {
  const showHandle = type == 'options';
  return (
    <Wrapper>
      <CustomNavBar type={type} setDrawerType={setDrawerType} />
      <StyledWrapperWithDrawer
        opened={type !== 'unset'}
        showHandle={showHandle}
        drawer={
          type === 'options' ? (
            <Options {...{ saveProfile, discardChanges }} />
          ) : type === 'profileList' ? (
            <ProfileList
              {...{
                profileList,
                selectedProfileId,
                sortRule,
                selectCurrentProfile,
                reloadProfileList,
                switchProfile,
                deleteCurrentProfile,
                createNewProfile,
                setSortRule,
              }}
            />
          ) : null
        }
      >
        <CustomCells showHandle={showHandle} />
      </StyledWrapperWithDrawer>
    </Wrapper>
  );
};

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
