import { locales } from '../../../locales';

const createMessages = () => {
  return locales.messages({
    description: 'It gives your TweetDeck multi row layout.',
  });
};

module.exports = (): ValLoader => ({ code: JSON.stringify(createMessages()), cacheable: true });
