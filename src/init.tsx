import React from 'react';
import { render } from 'react-dom';
import { DefaultTypelessProvider } from 'typeless';
import App from './App';
import ContextScope from './libs/contextScope';
import { ROOT_CLASS_NAME } from './style/appStyle';

const { IntegratedProvider } = ContextScope;

const target = document.getElementsByClassName('application');
const waitForTDInit = () => {
  if (target.length) {
    init();
  } else {
    setTimeout(waitForTDInit, 100);
  }
};

const init = () => {
  const application = target[0];
  const root = document.documentElement;
  const body = document.body;
  const multiRowApp = document.createElement('div');
  const multiRowDynamicStyle = document.createElement('style');
  const multiRowStaticStyle = document.createElement('link');

  root.classList.add(ROOT_CLASS_NAME);
  body.classList.add(ROOT_CLASS_NAME);

  multiRowStaticStyle.rel = 'stylesheet';
  multiRowStaticStyle.href = chrome.runtime.getURL('style.css');

  application.appendChild(multiRowApp);
  document.head.appendChild(multiRowStaticStyle);
  document.head.appendChild(multiRowDynamicStyle);
  render(
    <DefaultTypelessProvider>
      <IntegratedProvider>
        <App styleElement={multiRowDynamicStyle} />
      </IntegratedProvider>
    </DefaultTypelessProvider>,
    multiRowApp,
  );
};

const initialize = () => waitForTDInit();

export default initialize;
