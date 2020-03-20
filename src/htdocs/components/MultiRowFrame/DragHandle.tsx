import React, { useEffect, useState } from 'react';
import styled, { css, StyledComponent } from 'styled-components';

interface Props extends WrapperProps {
  hidden?: boolean;
  className?: string;
  onMouseDown?: JSX.IntrinsicElements['div']['onMouseDown'];
}

interface WrapperProps {
  Size: string;
}

const createHandle = (StyledHandle: typeof Handle, StyledWrapper: StyledComponent<'div', {}, WrapperProps>) => {
  return ({ className, onMouseDown, Size, hidden }: Props) => {
    const [active, setActive] = useState(false);

    useEffect(() => {
      const handleMouseup = () => setActive(false);
      window.addEventListener('mouseup', handleMouseup);

      return () => void window.removeEventListener('mouseup', handleMouseup);
    }, []);

    return (
      <StyledWrapper Size={Size}>
        {!hidden && (
          <StyledHandle
            className={className}
            draggable={false}
            Active={active}
            onMouseDown={(event) => void (setActive(true), onMouseDown?.(event))}
          />
        )}
      </StyledWrapper>
    );
  };
};

const handleSize = 5;
const dominance = '70%';
const padSize = 3;

const wrapperCommonStyle = css`
  position: relative;
  z-index: 10;
  overflow: visible;
`;

const Handle = styled.div<{ Active: boolean }>`
  ${({ Active }) => (Active ? hoverStyle : '')}
  background-color: ${({ theme: { color } }) => color.primaryText};
  border-radius: 7px;
  padding: ${padSize}px;
  background-clip: content-box;
  position: absolute;
  margin: auto;
  top: -${padSize + handleSize / 2}px;
  left: -${padSize + handleSize / 2}px;
  bottom: -${padSize + handleSize / 2}px;
  right: -${padSize + handleSize / 2}px;
  opacity: ${({ Active }) => (Active ? 0.95 : 0.6)};
`;

const hoverStyle = css`
  transform: scale(1.075);
`;

export const DragHandleHorizontal = createHandle(
  styled(Handle)`
    width: ${handleSize}px;
    height: ${dominance};
    &:hover {
      cursor: col-resize;
      ${hoverStyle}
    }
  `,
  styled.div<WrapperProps>`
    height: 100%;
    width: ${({ Size }) => Size};
    ${wrapperCommonStyle}
  `,
);

export const DragHandleVertical = createHandle(
  styled(Handle)`
    height: ${handleSize}px;
    width: ${dominance};
    &:hover {
      cursor: row-resize;
      ${hoverStyle}
    }
  `,
  styled.div<WrapperProps>`
    width: 100%;
    height: ${({ Size }) => Size};
    ${wrapperCommonStyle}
  `,
);
