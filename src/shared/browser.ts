// There is a type package '@types/firefox-webext-browser',
// but the 'browser' api has same type of 'chrome'.
declare global {
  const browser: typeof chrome;
  interface Window {
    browser: typeof chrome;
  }
}

window.chrome = window.browser = window.chrome || window.browser;

export {};
