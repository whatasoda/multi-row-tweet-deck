import GenMessage, { ManifestMessage } from './base'

const Gen: GenMessage = (isTrial: boolean): ManifestMessage => ({
  description: {
    message: `${isTrial ? '[TRIAL] ' : ''}Extend TweetDeck Layout to Customizable & Multi-Rowed`,
    description: 'Extension Description'
  }
})
export default Gen
