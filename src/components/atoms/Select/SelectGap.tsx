import React, { ChangeEventHandler, FC, memo, useMemo } from 'react';
import AppStore from '../../../store/app';
import useSelectClass from './cnm';

type SelectGapProps = {
  defaultGap: number;
};

const GAP_LIST = [0, 2, 4, 6, 8, 10];

const SelectGap: FC<SelectGapProps> = memo(({ defaultGap }) => {
  const { setCellGap } = AppStore.useActions();

  defaultGap = GAP_LIST.includes(defaultGap) ? defaultGap : 6;

  const entries = useMemo<Array<[number, ChangeEventHandler<HTMLInputElement>]>>(
    () => GAP_LIST.map((gap) => [gap, (e) => e.target.checked && setCellGap(gap)]),
    [],
  );

  return (
    <div className={useSelectClass(['container'])}>
      <label className={useSelectClass([], ['fixed-width-label', 'txt-uppercase'])}>GAP</label>
      {entries.map(([gap, handle]) => (
        <label key={gap} className={useSelectClass([], ['fixed-width-label', 'radio'])}>
          <input type="radio" name="gap" value={gap} onChange={handle} defaultChecked={gap === defaultGap} />
          {gap}
        </label>
      ))}
    </div>
  );
});

export default SelectGap;
