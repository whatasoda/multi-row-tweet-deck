import { MouseEventHandler, useMemo } from 'react';
import { PointerTerminal } from './usePointer';

const useDragger = (
  pointer: PointerTerminal,
  axis: 0 | 1,
  cb: {
    onStart?: () => void;
    onUpdate: (val: number) => void;
    onEnd?: () => void;
  },
) =>
  useMemo<MouseEventHandler>(() => {
    let prev: number | null = 0;

    const update = () => {
      const movement = pointer.movement();
      if (movement) {
        const val = movement[axis];
        if (val !== prev) {
          cb.onUpdate(val);
          prev = val;
        }
        requestAnimationFrame(update);
      } else {
        prev = null;
        if (cb.onEnd) {
          cb.onEnd();
        }
      }
    };

    return (e) => {
      pointer.start(e.nativeEvent);
      update();
    };
  }, [pointer, axis, cb.onStart, cb.onUpdate, cb.onEnd]);

export default useDragger;
