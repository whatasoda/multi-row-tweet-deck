import { initOnContentScript } from '../../shared/firefox-polyfill';

export const initFirefox = () => {
  initOnContentScript((value, sendResponse) => {
    console.log(value);
    
    browser.runtime.sendMessage(value, (response) => response(sendResponse));
    return true;
  });
};
