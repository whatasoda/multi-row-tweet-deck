import { ManifestMessage } from '../../../manifest/interface';
import ValLoaderCode from '../../../utils/val-loader-helper';

const message = (): ManifestMessage => ({
  description: {
    message: 'It gives your TweetDeck multi row layout.',
    description: 'Extension Description',
  },
});

export = ValLoaderCode(message);
