import React, { FC, useEffect, useState } from 'react';
import CellList from './components/organisms/CellList';
import useStyleModule from './style/useStyleModule';

type AppProps = {
  styleElement: HTMLStyleElement;
  onActivityChange?: (active: boolean) => void;
};

const App: FC<AppProps> = ({ styleElement, onActivityChange }) => {
  useStyleModule(styleElement);
  const [active, setActivity] = useState(false);

  useEffect(() => {
    let flag = false;
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg === 'clicked') {
        setActivity((flag = !flag));
      }
    });
  }, []);

  useEffect(() => {
    if (onActivityChange) {
      onActivityChange(active);
    }
  }, [active, onActivityChange]);

  return <>{active && <CellList />}</>;
};

export default App;
