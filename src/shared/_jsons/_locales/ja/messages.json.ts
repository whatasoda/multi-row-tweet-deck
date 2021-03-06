import path from 'path';
import { locales } from '../../../locales';
import { MAX_PROFILE_COUNT } from '../../../constants';

const message = locales.messages({
  description: 'MultiRow TweetDeck は TweetDeck のレイアウトを複数段に拡張します。',
  about: `MultiRow TweetDeck は TweetDeck のレイアウトを複数段に拡張します。

このページでは拡張機能のインストール前でも実際のレイアウトの編集を試すことができます。

その際作ったレイアウトはインストール後に自動で反映されるので、まずは左のボタンからお気軽にお試しください！`,
  installationMessage: 'MultiRow TweetDeck は Google Chrome と Firefox に対応しています。',
  contact: 'フィードバックをお待ちしています！',
  dateRecentUse: '最近使用した順',
  dateCreated: '作成された順',
  dateUpdated: '更新された順',
  profileListDescription: `編集したいプロファイルを選択してください。

★がついているプロファイルがTweetDeckに反映されます。`,
  confirmOnSwitchProfile: 'このプロファイルへの未保存の変更は破棄されます。よろしいですか?',
  confirmOnDeleteCurrentProfile: 'この操作は取り消せません。本当にこのプロファイルを削除しますか?',
  alertOnCreateNewProfile: `保存できるプロフィールは${MAX_PROFILE_COUNT}個までです。`,
  confirmOnCreateNewProfile: 'このプロファイルへの未保存の変更を破棄して新しいプロファイルを作成しますか?',
  beforeUnload: '未保存のプロファイルがあります。本当にページを離れますか?',
});

module.exports = (): ValLoader => ({
  code: JSON.stringify(message),
  cacheable: true,
  contextDependencies: [
    path.resolve(__dirname, '../../../locales.ts'),
    path.resolve(__dirname, '../../../types/custom.d.ts'),
    path.resolve(__dirname, '../../../constants.ts'),
  ],
});
