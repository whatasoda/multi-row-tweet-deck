import { initOnContentScript } from '../../shared/firefox-polyfill';

export const initFirefox = () => {
  initOnContentScript((value, sendResponse) => {
    browser.runtime.sendMessage(value, (response) => sendResponse(response));
    return true;
  });
};
