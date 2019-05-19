import { useEffect } from 'react';
import ContextScope from '../libs/contextScope';

const useScreenHeight = ContextScope.create(800, (set) => {
  useEffect(() => {
    const onResize = () => set(window.innerHeight);
    onResize();

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
});

export default useScreenHeight;
