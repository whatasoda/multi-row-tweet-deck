import { ManifestMessage } from '../../../src/manifest/interface';
import ValLoaderCode from '../../../src/utils/val-loader-helper';

const message = (): ManifestMessage => ({
  description: {
    message: 'TweetDeckを複数段のレイアウトに拡張します。',
    description: 'Extension Description',
  },
});

export = ValLoaderCode(message);
