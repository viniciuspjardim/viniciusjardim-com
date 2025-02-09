import Image from '@tiptap/extension-image'

export type ImageAttributes = {
  src: string
  alt?: string
  title?: string
  width?: string
  height?: string
}

export const TipTapImage = Image.extend({
  addAttributes() {
    return {
      src: {
        default: '',
      },
      alt: {
        default: undefined,
      },
      title: {
        default: undefined,
      },
      width: {
        default: undefined,
      },
      height: {
        default: undefined,
      },
    }
  },
})
