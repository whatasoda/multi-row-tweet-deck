import React, { ChangeEventHandler, FC, useCallback } from 'react';
import AppStore from '../../../store/app';
import Icon from '../Icon';
import useSelectClass from './cnm';

type SelectProfileProps = {};

const SelectProfile: FC<SelectProfileProps> = () => {
  const { profiles, currentProfile } = AppStore.useState();
  const { selectProfile, newProfile, deleteProfile, setProfileName } = AppStore.useActions();

  const profile = profiles[currentProfile];

  const handleSelect = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (e) => {
      const i = Number(e.target.value);
      if (isNaN(i) || !(i in profiles)) {
        return;
      }
      selectProfile(i);
    },
    [profiles],
  );

  const handleText = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    const name = e.target.value;
    setProfileName(name);
  }, []);

  return (
    <div className={useSelectClass(['container'])}>
      <label className={useSelectClass([], ['txt-uppercase'])}>profile</label>
      <div className={useSelectClass(['item'])}>
        <select
          className={useSelectClass([], ['light-on-dark'])}
          name="profile"
          value={currentProfile}
          onChange={handleSelect}
        >
          {profiles.map(({ name }, i) => (
            <option key={i} value={i}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className={useSelectClass(['item'])}>
        <input
          className={useSelectClass([], ['light-on-dark'])}
          key={currentProfile}
          type="text"
          name="profileName"
          defaultValue={profile.name}
          onChange={handleText}
        />
      </div>
      <div className={useSelectClass(['item'])}>
        <a href="#" onClick={newProfile}>
          <Icon type="plus" />
        </a>
        <a href="#" onClick={deleteProfile}>
          <Icon type="close" />
        </a>
      </div>
    </div>
  );
};

export default SelectProfile;
