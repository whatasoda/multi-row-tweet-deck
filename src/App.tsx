import React, { FC, useEffect, useState } from 'react';
import AppContent from './components/organisms/AppContent';
import Repository from './store/Repository';
import useStyleModule from './style/useStyleModule';

type AppProps = {
  styleElement: HTMLStyleElement;
};

const App: FC<AppProps> = ({ styleElement }) => {
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

  return (
    <>
      {active && <AppContent />}
      <Repository />
    </>
  );
};

export default App;
