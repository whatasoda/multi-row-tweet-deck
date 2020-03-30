# MultiRow TweetDeck

MultiRow TweetDeck extends your TweetDeck layout with customizable rows.

## Architecture
MultiRow TweetDeck has three or four JavaScript context.
1. https://tweetdeck.twitter.com/ as a content script
2. https://multirow.page/ as a general web page
3. https://multirow.page/ as a content script (this is only for firefox)
4. a background script

On https://tweetdeck.twitter.com/, the content script apply styles from saved layout profile via styled-components.
https://muiltirow.page/ serves two roles. One is a promotion and another is setting page.
Since Firefox browser does not have access for `browser` from general web page JavaScript context, a content scripts is needed for communicate with extension.
The background script serves migration from older versions, storage management, and so on.

## Developemnt
### install dependencies
```sh
npm i
```

### dev
```sh
npm run dev:htdocs # start dev-server for multirow.page in localhost:8080
npm run dev:extension # start watching process for extension
```

### build
```sh
npm run build:htdocs
npm run build:extension
```

### deployment
We use GitHub Actions for deployment of https://multirow.page/. The page is deployed on GitHub Pages.
