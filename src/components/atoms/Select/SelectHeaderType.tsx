import React, { ChangeEventHandler, FC, memo, useMemo } from 'react';
import AppStore, { AppProfile, HEADER_HEIGHT_MAP } from '../../../store/app';
import useSelectClass from './cnm';

type SelectHeaderTypeProps = {
  type: AppProfile['headerType'];
};

const TYPES = Object.keys(HEADER_HEIGHT_MAP) as Array<AppProfile['headerType']>;

const SelectHeaderType: FC<SelectHeaderTypeProps> = memo(({ type: currType }) => {
  const { setHeaderType } = AppStore.useActions();

  const entries = useMemo<Array<[string, ChangeEventHandler<HTMLInputElement>]>>(
    () => TYPES.map((type) => [type, (e) => e.target.checked && setHeaderType(type)]),
    [],
  );

  return (
    <div className={useSelectClass(['container'])}>
      <label className={useSelectClass([], ['fixed-width-label', 'txt-uppercase'])}>header type</label>
      {entries.map(([type, handle]) => (
        <label key={type} className={useSelectClass([], ['fixed-width-label', 'radio'])}>
          <input type="radio" name="headerType" value={type} onChange={handle} defaultChecked={type === currType} />
          {type.replace(/^./, (v) => v.toUpperCase())}
        </label>
      ))}
    </div>
  );
});

export default SelectHeaderType;
