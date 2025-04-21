import { type Editor } from '~/hooks/use-editor'

import CodeBlock from '@tiptap/extension-code-block'

export type CodeBlockAttributes = {
  language: string
  fileName?: string
  showCopyButton?: boolean
}

export const TipTapCodeBlock = CodeBlock.extend({
  addAttributes() {
    return {
      language: {
        default: '',
      },
      fileName: {
        default: undefined,
      },
      showCopyButton: {
        default: undefined,
      },
    }
  },
})

export function getSelectedCodeBlockAttributes(editor: Editor) {
  const $from = editor?.state.selection.$from

  if (!$from) {
    return null
  }

  // Check selected going up to parents until we find a codeBlock node
  for (let depth = $from.depth; depth > 0; depth--) {
    const node = $from.node(depth)
    if (node.type.name === 'codeBlock') {
      return node.attrs as CodeBlockAttributes
    }
  }

  return null
}
