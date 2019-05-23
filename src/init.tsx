import React from 'react';
import { render } from 'react-dom';
import { DefaultTypelessProvider } from 'typeless';
import App from './App';
import ContextScope from './libs/contextScope';
import { ROOT_CLASS_NAME } from './style/appStyle';
import { initNativeEnvironment } from './style/NativeEnvironments';

const { IntegratedProvider } = ContextScope;

const collections = {
  application: document.getElementsByClassName('application') as HTMLCollectionOf<HTMLElement>,
  appContent: document.getElementsByClassName('app-content') as HTMLCollectionOf<HTMLElement>,
};
const waitForElement = <T extends HTMLElement>(collection: HTMLCollectionOf<T>, cb: (elem: T) => void) => {
  if (collection.length) {
    cb(collection[0]);
  } else {
    setTimeout(() => waitForElement(collection, cb), 100);
  }
};

const initMultiRowApp = (application: HTMLElement) => {
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

const initialize = () => {
  waitForElement(collections.application, initMultiRowApp);
  waitForElement(collections.appContent, initNativeEnvironment);
};

export default initialize;
