'use client'

import { useCallback } from 'react'
import { EditorContent } from '@tiptap/react'
import {
  PilcrowIcon,
  VideoIcon,
  Undo2Icon,
  Redo2Icon,
  CodeIcon,
  LinkIcon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  ListIcon,
  ListOrderedIcon,
  UnlinkIcon,
  FlipVerticalIcon,
} from 'lucide-react'
import { EditorButton } from '~/components/post/editor-button'
import { ImageDialog } from '~/components/post/image-dialog'
import { CodeBlockDialog } from '~/components/post/code-block-dialog'
import type { Editor } from '~/hooks/use-editor'
import { WidthContainer } from '../width-container'

export interface PostFormEditorProps {
  editor: Editor
}

export function PostFormEditor({ editor }: PostFormEditorProps) {
  const addVideo = useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      editor?.chain().focus().setVideo(url).run()
    }
  }, [editor])

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href as string | undefined
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  return (
    <>
      {/* Editor toolbar */}
      <div className="bg-background sticky top-0 z-10 border-b">
        <WidthContainer className="flex items-center gap-x-1.5 gap-y-1 overflow-x-auto px-1 py-2 [scrollbar-width:none] md:flex-wrap md:overflow-visible">
          <EditorButton
            title="Paragraph"
            isActive={editor?.isActive('paragraph')}
            onClick={() => editor?.chain().focus().setParagraph().run()}
          >
            <PilcrowIcon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Heading 3"
            isActive={editor?.isActive('heading', { level: 3 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3Icon className="size-5" />
          </EditorButton>
          <ImageDialog editor={editor} />
          <EditorButton
            title="Code"
            isActive={editor?.isActive('code')}
            onClick={() => editor?.chain().focus().toggleCode().run()}
          >
            <CodeIcon className="size-5" />
          </EditorButton>
          <CodeBlockDialog editor={editor} />
          <EditorButton
            title="Link"
            isActive={editor?.isActive('link')}
            onClick={setLink}
          >
            <LinkIcon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Line break"
            onClick={() => editor?.chain().focus().setHardBreak().run()}
          >
            br
          </EditorButton>
          <EditorButton title="Video" onClick={addVideo}>
            <VideoIcon className="size-5" />
          </EditorButton>
          <EditorButton
            className="text-semibold"
            title="Bold"
            isActive={editor?.isActive('bold')}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            B
          </EditorButton>
          <EditorButton
            className="font-serif italic"
            title="Italic"
            isActive={editor?.isActive('italic')}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            I
          </EditorButton>
          <EditorButton
            className="line-through"
            title="Strike"
            isActive={editor?.isActive('strike')}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          >
            S
          </EditorButton>
          <EditorButton
            title="Heading 4"
            isActive={editor?.isActive('heading', { level: 4 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 4 }).run()
            }
          >
            <Heading4Icon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Heading 5"
            isActive={editor?.isActive('heading', { level: 5 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 5 }).run()
            }
          >
            <Heading5Icon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Heading 6"
            isActive={editor?.isActive('heading', { level: 6 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 6 }).run()
            }
          >
            <Heading6Icon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Unordered list"
            isActive={editor?.isActive('bulletList')}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <ListIcon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Ordered list"
            isActive={editor?.isActive('orderedList')}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <ListOrderedIcon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Quote"
            isActive={editor?.isActive('blockquote')}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          >
            {'"'}
          </EditorButton>
          <EditorButton
            title="Horizontal rule"
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          >
            <FlipVerticalIcon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Undo"
            onClick={() => editor?.chain().focus().undo().run()}
          >
            <Undo2Icon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Redo"
            onClick={() => editor?.chain().focus().redo().run()}
          >
            <Redo2Icon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Remove link"
            onClick={() => editor?.chain().focus().unsetLink().run()}
            disabled={!editor?.isActive('link')}
          >
            <UnlinkIcon className="size-5" />
          </EditorButton>
          <EditorButton
            title="Clear formatting"
            onClick={() => editor?.chain().focus().unsetAllMarks().run()}
          >
            CF
          </EditorButton>
          <EditorButton
            title="Clear nodes"
            onClick={() => editor?.chain().focus().clearNodes().run()}
          >
            CN
          </EditorButton>
        </WidthContainer>
      </div>

      {/* Content of the post in the editor */}
      <WidthContainer>
        {editor && <EditorContent editor={editor} />}
      </WidthContainer>
    </>
  )
}
