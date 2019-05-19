import React from 'react';
import { render } from 'react-dom';
import { DefaultTypelessProvider } from 'typeless';
import App from './App';
import ContextScope from './libs/contextScope';
import { NativeClassName } from './style/appStyle';

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
  const multiRowApp = document.createElement('div');
  const multiRowDynamicStyle = document.createElement('style');
  const multiRowStaticStyle = document.createElement('link');
  const { IntegratedProvider } = ContextScope;

  multiRowApp.className = NativeClassName.html.appContent;
  multiRowApp.style.transform = 'translateX(400px)';
  multiRowApp.style.marginRight = '400px';

  const onChange = (active: boolean) => (multiRowApp.style.zIndex = active ? '1' : '');

  multiRowStaticStyle.rel = 'stylesheet';
  multiRowStaticStyle.href = chrome.runtime.getURL('style.css');

  application.appendChild(multiRowApp);
  document.head.appendChild(multiRowStaticStyle);
  document.head.appendChild(multiRowDynamicStyle);
  render(
    <DefaultTypelessProvider>
      <IntegratedProvider>
        <App styleElement={multiRowDynamicStyle} onActivityChange={onChange} />
      </IntegratedProvider>
    </DefaultTypelessProvider>,
    multiRowApp,
  );
};

const initialize = () => waitForTDInit();

export default initialize;
