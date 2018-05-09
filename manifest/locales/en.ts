import GenMessage, { ManifestMessage } from './base'

const Gen: GenMessage = (): ManifestMessage => ({
  description: {
    message: 'Extend TweetDeck Layout to Customizable & Multi-Rowed',
    description: 'Extension Description'
  }
})
export default Gen
