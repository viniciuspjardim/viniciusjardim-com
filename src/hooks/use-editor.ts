import type { JSONContent } from '@tiptap/core'

import { useEditor as useInitEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import { TipTapImage } from '~/helpers/tiptap-image'
import { Speech } from '~/helpers/tiptap-speech'
import { Video } from '~/helpers/tiptap-video'

export function useEditor(content?: JSONContent) {
  const editor = useInitEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'blog-post blog-post-min-h focus:outline-hidden w-full p-2',
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
      TipTapImage,
      Speech,
      Video,
    ],
    content,
  })

  return { EditorContent, editor }
}

export type Editor = ReturnType<typeof useEditor>['editor']
