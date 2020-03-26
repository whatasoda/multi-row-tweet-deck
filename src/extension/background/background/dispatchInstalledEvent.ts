import { WEB_EVENT } from '../../../shared/constants';

export const dispatchInstalledEvent = () => {
  browser.runtime.onInstalled.addListener(() => {
    browser.tabs.query({ url: 'https://tweetdeck.twitter.com/*' }, (tabList) => {
      tabList.forEach(({ id }) => {
        if (typeof id !== 'number') return;
        browser.tabs.executeScript(id, { code: `window.dispatchEvent(new Event(${WEB_EVENT.installed}))` }, () => {});
      });
    });
  });
};
