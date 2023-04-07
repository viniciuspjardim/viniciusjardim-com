import { useEditor as useInitEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export function useEditor(content: string) {
  const editor = useInitEditor({
    editorProps: {
      attributes: {
        class: 'focus:outline-none rounded-sm bg-slate-900/75 py-1 px-2',
      },
    },
    extensions: [StarterKit],
    content: content ?? '',
  })

  return { Editor: EditorContent, editor }
}
