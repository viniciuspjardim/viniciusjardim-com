import type { JSONContent } from '@tiptap/core'

import { useEditor as useInitEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import HardBreak from '@tiptap/extension-hard-break'
import { TipTapImage } from '~/helpers/tiptap-image'
import { Video } from '~/helpers/tiptap-video'

export function useEditor(content: string) {
  const editor = useInitEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'blog-post blog-post-min-h focus:outline-none w-full border border-neutral-800 p-2',
      },
    },
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Write your post here...' }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
      HardBreak,
      TipTapImage,
      Video,
    ],
    content: content ? (JSON.parse(content) as JSONContent) : null,
  })

  return { EditorContent, editor }
}

export type Editor = ReturnType<typeof useEditor>['editor']
