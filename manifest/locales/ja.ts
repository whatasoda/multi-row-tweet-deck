import GenMessage, { ManifestMessage } from './base'

const Gen: GenMessage = (): ManifestMessage => ({
  description: {
    message: 'TweetDeckを複数段のレイアウトに拡張します。',
    description: 'Extension Description'
  }
})
export default Gen
