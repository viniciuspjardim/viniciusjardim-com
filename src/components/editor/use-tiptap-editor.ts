import type { JSONContent } from '@tiptap/core'

import {
  useEditor as useInitEditor,
  EditorContent as TipTapEditorContent,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import { TipTapImage } from '~/helpers/tiptap-image'
import { TipTapCodeBlock } from '~/helpers/tiptap-code-block'
import { Speech } from '~/helpers/tiptap-speech'
import { Video } from '~/helpers/tiptap-video'

export function useTipTapEditor(content?: JSONContent) {
  const tipTapEditor = useInitEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'blog-post min-h-48 w-full py-6 focus:outline-hidden',
      },
    },
    extensions: [
      StarterKit.configure({ codeBlock: false, link: false }),
      Placeholder.configure({ placeholder: 'Write your post here...' }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
      TipTapImage,
      TipTapCodeBlock.configure({
        HTMLAttributes: {
          class: 'rounded-md border',
        },
      }),
      Speech,
      Video,
    ],
    content,
  })

  return { TipTapEditorContent, tipTapEditor }
}

export type TipTapEditor = ReturnType<typeof useTipTapEditor>['tipTapEditor']
