import { locales } from '../locales';

const createMessages = () => {
  return locales.messages({
    description: 'TweetDeckを複数段のレイアウトに拡張します。',
  });
};

module.exports = () => ({ code: JSON.stringify(createMessages()) });
