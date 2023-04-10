import { useEditor as useInitEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

export function useEditor(content: string) {
  const editor = useInitEditor({
    editorProps: {
      attributes: {
        class:
          'blog-post blog-post-min-h focus:outline-none w-full rounded-md bg-slate-900/75 p-2 md:p-8',
      },
    },
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Write your post here...' }),
    ],
    content: content ?? '',
  })

  return { Editor: EditorContent, editor }
}
