const { PageStateMatcher, ShowPageAction } = chrome.declarativeContent;
const conditions = [
  new PageStateMatcher({
    pageUrl: { urlPrefix: 'https://tweetdeck.twitter.com' },
  }),
];
const actions = [new ShowPageAction()];

chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{ conditions, actions }]);
  });
});

chrome.pageAction.onClicked.addListener((tab) => {
  return chrome.tabs.sendMessage(tab.id as number, 'clicked');
});
