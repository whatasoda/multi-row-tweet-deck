import { locales } from '../../../locales';

const createMessages = () => {
  return locales.messages({
    description: 'TweetDeckを複数段のレイアウトに拡張します。',
  });
};

module.exports = (): ValLoader => ({ code: JSON.stringify(createMessages()), cacheable: true });
