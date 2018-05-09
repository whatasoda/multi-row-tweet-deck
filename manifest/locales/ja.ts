import GenMessage, { ManifestMessage } from './base'

const Gen: GenMessage = (isTrial: boolean): ManifestMessage => ({
  description: {
    message: `${isTrial ? '[無料試用版] ' : ''}TweetDeckを複数段のレイアウトに拡張します。`,
    description: 'Extension Description'
  }
})
export default Gen
