import { WEB_EVENT } from '../../../shared/constants';

export const dispatchInstalledEvent = () => {
  const { externally_connectable = {} } = browser.runtime.getManifest();
  const { matches = [] } = externally_connectable;

  matches.forEach((url) => {
    browser.tabs.query({ url }, (tabList) => {
      tabList.forEach(({ id }) => {
        if (typeof id !== 'number') return;
        browser.tabs.executeScript(
          id,
          { code: `window.dispatchEvent(new Event(${JSON.stringify(WEB_EVENT.installed)}))` },
          () => {},
        );
      });
    });
  });
};
