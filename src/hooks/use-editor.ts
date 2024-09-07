import type { JSONContent } from '@tiptap/core'

import { useEditor as useInitEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

export function useEditor(content: string) {
  const editor = useInitEditor({
    editorProps: {
      attributes: {
        class:
          'blog-post blog-post-min-h focus:outline-none w-full border border-neutral-800 p-2',
      },
    },
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Write your post here...' }),
    ],
    content: JSON.parse(
      content || '{ "type": "doc", "content:": []}'
    ) as JSONContent,
  })

  return { Editor: EditorContent, editor }
}
