import React, { createContext, useRef, useMemo, useContext, useEffect } from 'react';

export interface DragData {
  mode: 'start' | 'move' | 'end';
  start: readonly [number, number];
  curr: readonly [number, number];
  mvmt: readonly [number, number];
}

export type DragHandler = (data: DragData) => void;
type DragHandlerRef = React.MutableRefObject<DragHandler>;
type DragElementProps = Readonly<Required<Pick<React.HTMLAttributes<HTMLElement>, 'onMouseDown'>>>;

export const useDrag = (handleUpdate: DragHandler): DragElementProps => {
  const registry = useContext(useDrag.context);
  const handlerRef = useRef(handleUpdate);
  handlerRef.current = handleUpdate;

  return useMemo(() => {
    const start = (): void => void registry.add(handlerRef);
    return { onMouseDown: start };
  }, []);
};
useDrag.context = createContext<Set<DragHandlerRef>>(null as any);

export const DragProvider: React.FC<{ mode: 'animationFrame' | 'mousemove' }> = ({ mode, children }) => {
  const registry = useMemo(() => new Set<DragHandlerRef>(), []);

  useEffect(() => {
    let unmount = false;
    let active = false;
    let startX = 0;
    let startY = 0;
    let prevX = 0;
    let prevY = 0;
    let currX = 0;
    let currY = 0;
    const update = (mode: DragData['mode'], x: number, y: number) => {
      const data: DragData = {
        mode,
        start: [startX, startY],
        curr: [x, y],
        mvmt: [x - prevX, y - prevY],
      };
      prevX = x;
      prevY = y;

      registry.forEach(({ current }) => current(data));
    };

    const handleMouseDown = ({ clientX, clientY }: WindowEventMap['mousedown']) => {
      active = Boolean(registry.size);
      if (!active) return;
      startX = currX = prevX = clientX;
      startY = currY = prevY = clientY;

      update('start', clientX, clientY);
    };
    const handleMouseUp = ({ clientX, clientY }: WindowEventMap['mouseup']) => {
      if (active) {
        update('end', clientX, clientY);
        active = false;
      }
      registry.clear();
    };

    const handleMouseMove = ({ clientX, clientY }: WindowEventMap['mousemove']) => {
      if (!active) return;
      currX = clientX;
      currY = clientY;
      if (mode === 'mousemove') update('move', currX, currY);
    };
    const handleAnimationFrame = () => {
      if (unmount) return;
      requestAnimationFrame(handleAnimationFrame);
      if (!active) return;
      update('move', currX, currY);
    };

    if (mode === 'animationFrame') handleAnimationFrame();
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      unmount = true;
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return <useDrag.context.Provider value={registry} children={children} />;
};
