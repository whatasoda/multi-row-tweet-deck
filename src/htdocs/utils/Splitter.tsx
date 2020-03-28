import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { clamp } from '../../shared/utils/math';

interface SplitterValue {
  pct: number;
  px: number;
}

interface SplitterProps {
  type: 'vertical' | 'horizontal';
  active: boolean;
  onCanceled: () => void;
  onSplit: (value: SplitterValue) => void;
  className?: string;
}

const KEYS = {
  vertical: { offset: 'offsetY', childOffset: 'offsetTop', base: 'clientHeight', handlePosition: 'top' },
  horizontal: { offset: 'offsetX', childOffset: 'offsetLeft', base: 'clientWidth', handlePosition: 'left' },
} as const;

export const Splitter = ({ active, className, type, onCanceled, onSplit }: SplitterProps) => {
  const [value, setValue] = useState<SplitterValue>({ pct: 0, px: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const props = { type, onCanceled: () => (setValue({ pct: 0, px: 0 }), onCanceled()), onSplit };
  const propsRef = useRef(props);
  propsRef.current = props;

  useEffect(() => {
    if (!active) return;
    let inactive = false;
    let nextValue: SplitterValue = value;
    let needsUpdate = false;

    const handleClick = ({ srcElement }: WindowEventMap['click']) => {
      const { current: wrapper } = wrapperRef;
      if (!wrapper) return propsRef.current.onCanceled();
      if (wrapper === srcElement || wrapper === (srcElement as HTMLElement).parentElement) {
        onSplit(nextValue);
      } else {
        propsRef.current.onCanceled();
      }
    };

    const handleMousemove = (event: WindowEventMap['mousemove']) => {
      const keys = KEYS[propsRef.current.type];
      const { srcElement, [keys.offset]: offset } = event;
      const { current: wrapper } = wrapperRef;

      if (!wrapper) return propsRef.current.onCanceled();
      if (!(srcElement instanceof HTMLElement)) return;
      if (wrapper !== srcElement && wrapper !== srcElement.parentElement) return;

      const px = clamp(offset + (wrapper === srcElement ? 0 : srcElement[keys.childOffset]), 0, wrapper.clientHeight);
      const pct = (px / wrapper[keys.base]) * 100;
      nextValue = { pct, px };
      needsUpdate = true;
    };

    const update = () => {
      if (inactive) return;
      requestAnimationFrame(update);

      if (needsUpdate) setValue(nextValue);
    };

    window.addEventListener('mousemove', handleMousemove);
    window.addEventListener('click', handleClick);
    update();
    return () => {
      window.removeEventListener('mousemove', handleMousemove);
      window.removeEventListener('click', handleClick);
      inactive = true;
    };
  }, [active]);

  return active ? (
    <Wrapper ref={wrapperRef} className={className}>
      <Handle type={type} style={{ [KEYS[type].handlePosition]: `${value.px}px` }} />
    </Wrapper>
  ) : (
    <></>
  );
};

const Wrapper = styled.div`
  background-color: ${({ theme: { color } }) => color.TwitterColor.green}22;
  box-sizing: border-box;
  border: 2px dotted ${({ theme: { color } }) => color.TwitterColor.green}55;
  position: relative;
`;

const Handle = styled.div<Pick<SplitterProps, 'type'>>`
  border-top: 2px dashed ${({ theme: { color } }) => color.TwitterColor.green}99;
  border-left: 2px dashed ${({ theme: { color } }) => color.TwitterColor.green}99;
  position: absolute;
  ${({ type }) => handleStyles[type]}
`;

const handleStyles = {
  vertical: css`
    width: 100%;
    height: 0;
  `,
  horizontal: css`
    width: 0;
    height: 100%;
  `,
};
