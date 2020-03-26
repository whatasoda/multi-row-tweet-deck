import { locales } from '../locales';

const createMessages = () => {
  return locales.messages({
    description: 'It gives your TweetDeck multi row layout.',
  });
};

module.exports = () => ({ code: JSON.stringify(createMessages()) });
