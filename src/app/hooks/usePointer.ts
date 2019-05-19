import { useEffect, useMemo } from 'react';
import ContextScope from '../libs/contextScope';

type PointerTerminal = {
  start: (initial: MouseEvent) => void;
  end: () => void;
  movement: () => [number, number] | null;
};
const emptyPointerTerminal: PointerTerminal = {
  start: () => void 0,
  end: () => void 0,
  movement: () => null,
};

const usePointer = ContextScope.create<PointerTerminal>(emptyPointerTerminal, (set) => {
  const effect = useMemo(() => {
    let active = false;
    let dead = false;
    const origin = new Float32Array([0, 0]);
    const curr = new Float32Array([0, 0]);

    const start: PointerTerminal['start'] = (initial) => {
      if (active || dead) {
        return;
      }

      active = true;
      origin[0] = curr[0] = initial.clientX;
      origin[1] = curr[1] = initial.clientY;
      initial.preventDefault();
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
      !active || dead ? null : [curr[0] - origin[0], curr[1] - origin[1]];

    set({ start, movement, end });
    const effect = () => {
      window.addEventListener('mouseup', end);
      return () => {
        end();
        window.removeEventListener('mouseup', end);
        dead = true;
      };
    };
    return effect;
  }, []);

  useEffect(effect, []);
});

export default usePointer;
