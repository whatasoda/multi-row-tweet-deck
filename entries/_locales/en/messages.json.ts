import { ManifestMessage } from '../../../src/manifest/interface';
import ValLoaderCode from '../../../src/utils/val-loader-helper';

const message = (): ManifestMessage => ({
  description: {
    message: 'It gives your TweetDeck multi row layout.',
    description: 'Extension Description',
  },
});

export = ValLoaderCode(message);
