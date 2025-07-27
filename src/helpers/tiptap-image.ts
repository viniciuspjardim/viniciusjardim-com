import { type TipTapEditor } from '~/components/editor/use-tiptap-editor'

import Image from '@tiptap/extension-image'
import { NodeSelection } from 'prosemirror-state'

export type ImageAttributes = {
  src: string
  description?: string
  alt?: string
  title?: string
  isPriority?: boolean
  width?: number
  height?: number
}

export const TipTapImage = Image.extend({
  addAttributes() {
    return {
      src: {
        default: '',
      },
      description: {
        default: undefined,
      },
      alt: {
        default: undefined,
      },
      title: {
        default: undefined,
      },
      isPriority: {
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

export function getSelectedImageAttributes(tipTapEditor: TipTapEditor) {
  if (!tipTapEditor) {
    return null
  }

  const { selection } = tipTapEditor.state

  if (selection instanceof NodeSelection) {
    const node = selection.node

    if (node.type.name === 'image') {
      return { ...node.attrs } as ImageAttributes
    }
  }

  return null
}
