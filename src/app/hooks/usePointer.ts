import { useEffect } from 'react';
import ContextScope from '../libs/contextScope';

type PointerTerminal = {
  start: (initial: MouseEvent) => void;
  end: () => void;
  movement: () => [number, number];
};
const emptyPointerTerminal: PointerTerminal = {
  start: () => void 0,
  end: () => void 0,
  movement: () => [0, 0],
};

const usePointer = ContextScope.create<PointerTerminal>(emptyPointerTerminal, (set) => {
  useEffect(() => {
    let active = false;
    let dead = true;
    const origin = new Float32Array([0, 0]);
    const curr = new Float32Array([0, 0]);

    const start: PointerTerminal['start'] = (initial) => {
      if (active || dead) {
        return;
      }

      active = true;
      origin[0] = initial.clientX;
      origin[1] = initial.clientY;
      window.addEventListener('mousemove', observer);
    };

    const observer = (event: MouseEvent) => {
      curr[0] = event.clientX;
      curr[1] = event.clientY;
    };

    const end: PointerTerminal['end'] = () => {
      if (!active || dead) {
        return;
      }

      active = false;
      origin.fill(0);
      curr.fill(0);
      window.removeEventListener('mousemove', observer);
    };

    const movement: PointerTerminal['movement'] = () =>
      !active || dead ? [0, 0] : [curr[0] - origin[0], curr[1] - origin[1]];

    window.addEventListener('mouseup', end);
    set({ start, movement, end });

    return () => {
      end();
      window.removeEventListener('mouseup', end);
      dead = true;
    };
  }, []);
});

export default usePointer;
