type GenMessage = () => ManifestMessage
export default GenMessage

export interface ManifestMessage {
  [name: string]: {
    message     : string // Message text, with optional placeholders.
    description : string // Translator-aimed description of the message.,
    placeholders?: {
      [name: string]: {
        content: string // A string to be placed within the message.
        example: string // Translator-aimed example of the placeholder string.
      }
    }
  }
}
