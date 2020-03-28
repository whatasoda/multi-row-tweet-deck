import React from 'react';
import styled from 'styled-components';
import { TwitterColor } from '../../../../shared/theme';
import { Section, Title } from '../Section';
import { useMultiRowProfile } from '../../../utils/useMultiRowProfile';
import { Icon } from '../../../../shared/components/Icon';

interface ProfileListProps {
  profileList: ProfileWithMetaData[];
  selectedProfileId: string | null;
  sortRule: OneOfProfileSortRule;
  selectCurrentProfile: () => Promise<void>;
  setSortRule: (rule: OneOfProfileSortRule) => void;
  reloadProfileList: () => Promise<void>;
  switchProfile: (id: string) => Promise<void>;
  deleteCurrentProfile: () => Promise<void>;
  createNewProfile: () => Promise<void>;
}

const rules: OneOfProfileSortRule[] = ['dateRecentUse', 'dateCreated', 'dateUpdated'];
const ruleText: Record<OneOfProfileSortRule, string> = {
  dateCreated: '作成順',
  dateRecentUse: '使用順',
  dateUpdated: '更新順',
};

export const ProfileList = ({
  profileList,
  selectedProfileId,
  sortRule,
  switchProfile,
  createNewProfile,
  deleteCurrentProfile,
  selectCurrentProfile,
  reloadProfileList,
  setSortRule,
}: ProfileListProps) => {
  const curr = useMultiRowProfile(({ id }) => id);
  return (
    <Section>
      <Title>Profile List</Title>
      <SelectWrapper>
        <Select defaultValue={sortRule} onChange={(evt) => setSortRule(evt.target.value as OneOfProfileSortRule)}>
          {rules.map((rule) => (
            <option key={rule} value={rule}>
              {ruleText[rule]}
            </option>
          ))}
        </Select>
        <DownIcon icon="down" />
      </SelectWrapper>
      <ScrollWrapper>
        <ScrollBox>
          {profileList.map(({ profile: { id, displayName } }) => {
            const picked = id === curr;
            const selected = id === selectedProfileId;
            return (
              <ProfileItem
                key={id}
                title={displayName}
                Picked={picked}
                Selected={selected}
                onClick={() => switchProfile(id)}
              >
                <ProfileInnerWrapper>
                  <Name>{displayName}</Name>
                  <Checkmark>{selected ? <Icon icon="star" /> : null}</Checkmark>
                </ProfileInnerWrapper>
              </ProfileItem>
            );
          })}
        </ScrollBox>
      </ScrollWrapper>
      <ButtonWrapperRoot>
        <ButtonWrapperLeft>
          <Icon.Button icon="spinner" onClick={reloadProfileList} />
        </ButtonWrapperLeft>
        <ButtonWrapperRight>
          <Icon.Button icon="plus" onClick={createNewProfile} />
          <Icon.Button icon="minus" onClick={deleteCurrentProfile} />
          <Icon.Button icon="star" onClick={selectCurrentProfile} />
        </ButtonWrapperRight>
      </ButtonWrapperRoot>
      <p>
        編集したいプロファイルを選択してください。
        <br />
        ★がついているプロファイルがTweetDeckに反映されます。
      </p>
    </Section>
  );
};

const SelectWrapper = styled.div`
  height: 28px;
  width: 100%;
  margin: 0 0 16px;
  position: relative;
  background-color: ${TwitterColor.white};
  border-radius: 2px;
`;

const Select = styled.select`
  height: 100%;
  width: 100%;
  padding: 2px 30px 4px 10px;
  box-sizing: border-box;
  font-size: 16px;
  background: none;
  position: relative;
  z-index: 1;
  option {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const DownIcon = styled(Icon)`
  position: absolute;
  z-index: 0;
  right: 8px;
  top: 0;
  bottom: 0;
  margin: auto 0;
  color: ${TwitterColor.darkGray};
`;

const ScrollWrapper = styled.div`
  height: 220px;
  position: relative;
  border-radius: 2px;
  background-color: ${TwitterColor.white};
  color: ${TwitterColor.darkBlack};
  &:after {
    content: '';
    display: block;
    position: absolute;
    height: 60px;
    right: 0;
    left: 0;
    bottom: 0;
    background: linear-gradient(#fff0, #ffff);
    z-index: 1;
  }
`;

const ScrollBox = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  font-size: 16px;
  height: 100%;
  padding-bottom: calc(100% - 36px);
  box-sizing: border-box;
`;

const ProfileItem = styled.button<{ Selected: boolean; Picked: boolean }>`
  display: block;
  height: 36px;
  padding: 4px 8px 4px 8px;
  box-sizing: border-box;
  width: 100%;
  text-align: left;
  border-bottom: 1px solid ${TwitterColor.darkGray};
  font-weight: ${({ Picked }) => (Picked ? 700 : 400)};
  background-color: ${({ Picked }) => (Picked ? TwitterColor.lightGray : TwitterColor.white)};
  &:hover {
    background-color: ${TwitterColor.lighterGray};
  }
`;

const ProfileInnerWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 20px;
`;

const Name = styled.span`
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  grid-column: 1 / 2;
  flex: 0 0 auto;
  white-space: nowrap;
`;

const Checkmark = styled.span`
  display: block;
  width: 24px;
  grid-column: 2 / 3;
  color: ${TwitterColor.yellow};
`;

const ButtonWrapperRoot = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
`;

const ButtonWrapperLeft = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const ButtonWrapperRight = styled.div`
  display: flex;
  justify-content: flex-end;
`;
