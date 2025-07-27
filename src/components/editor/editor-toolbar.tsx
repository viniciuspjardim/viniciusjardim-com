'use client'

import type { TipTapEditor } from './use-tiptap-editor'

import { useCallback } from 'react'
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
import { EditorButton } from './editor-button'
import { ImageDialog } from './image-dialog'
import { CodeBlockDialog } from './code-block-dialog'

interface EditorToolbarProps {
  tipTapEditor: TipTapEditor
}

export function EditorToolbar({ tipTapEditor }: EditorToolbarProps) {
  const addVideo = useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      tipTapEditor?.chain().focus().setVideo(url).run()
    }
  }, [tipTapEditor])

  const setLink = useCallback(() => {
    const previousUrl = tipTapEditor?.getAttributes('link').href as
      | string
      | undefined
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      tipTapEditor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    tipTapEditor
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run()
  }, [tipTapEditor])

  return (
    <>
      <EditorButton
        title="Paragraph"
        isActive={tipTapEditor?.isActive('paragraph')}
        onClick={() => tipTapEditor?.chain().focus().setParagraph().run()}
      >
        <PilcrowIcon className="size-5" />
      </EditorButton>
      <EditorButton
        title="Heading 3"
        isActive={tipTapEditor?.isActive('heading', { level: 3 })}
        onClick={() =>
          tipTapEditor?.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        <Heading3Icon className="size-5" />
      </EditorButton>
      <ImageDialog tipTapEditor={tipTapEditor} />
      <EditorButton
        title="Code"
        isActive={tipTapEditor?.isActive('code')}
        onClick={() => tipTapEditor?.chain().focus().toggleCode().run()}
      >
        <CodeIcon className="size-5" />
      </EditorButton>
      <CodeBlockDialog tipTapEditor={tipTapEditor} />
      <EditorButton
        title="Link"
        isActive={tipTapEditor?.isActive('link')}
        onClick={setLink}
      >
        <LinkIcon className="size-5" />
      </EditorButton>
      <EditorButton
        title="Line break"
        onClick={() => tipTapEditor?.chain().focus().setHardBreak().run()}
      >
        br
      </EditorButton>
      <EditorButton title="Video" onClick={addVideo}>
        <VideoIcon className="size-5" />
      </EditorButton>
      <EditorButton
        className="text-semibold"
        title="Bold"
        isActive={tipTapEditor?.isActive('bold')}
        onClick={() => tipTapEditor?.chain().focus().toggleBold().run()}
      >
        B
      </EditorButton>
      <EditorButton
        className="font-serif italic"
        title="Italic"
        isActive={tipTapEditor?.isActive('italic')}
        onClick={() => tipTapEditor?.chain().focus().toggleItalic().run()}
      >
        I
      </EditorButton>
      <EditorButton
        className="line-through"
        title="Strike"
        isActive={tipTapEditor?.isActive('strike')}
        onClick={() => tipTapEditor?.chain().focus().toggleStrike().run()}
      >
        S
      </EditorButton>
      <EditorButton
        title="Heading 4"
        isActive={tipTapEditor?.isActive('heading', { level: 4 })}
        onClick={() =>
          tipTapEditor?.chain().focus().toggleHeading({ level: 4 }).run()
        }
      >
        <Heading4Icon className="size-5" />
      </EditorButton>
      <EditorButton
        title="Heading 5"
        isActive={tipTapEditor?.isActive('heading', { level: 5 })}
        onClick={() =>
          tipTapEditor?.chain().focus().toggleHeading({ level: 5 }).run()
        }
      >
        <Heading5Icon className="size-5" />
      </EditorButton>
      <EditorButton
        title="Heading 6"
        isActive={tipTapEditor?.isActive('heading', { level: 6 })}
        onClick={() =>
          tipTapEditor?.chain().focus().toggleHeading({ level: 6 }).run()
        }
      >
        <Heading6Icon className="size-5" />
      </EditorButton>
      <EditorButton
        title="Unordered list"
        isActive={tipTapEditor?.isActive('bulletList')}
        onClick={() => tipTapEditor?.chain().focus().toggleBulletList().run()}
      >
        <ListIcon className="size-5" />
      </EditorButton>
      <EditorButton
        title="Ordered list"
        isActive={tipTapEditor?.isActive('orderedList')}
        onClick={() => tipTapEditor?.chain().focus().toggleOrderedList().run()}
      >
        <ListOrderedIcon className="size-5" />
      </EditorButton>
      <EditorButton
        title="Quote"
        isActive={tipTapEditor?.isActive('blockquote')}
        onClick={() => tipTapEditor?.chain().focus().toggleBlockquote().run()}
      >
        {'"'}
      </EditorButton>
      <EditorButton
        title="Horizontal rule"
        onClick={() => tipTapEditor?.chain().focus().setHorizontalRule().run()}
      >
        <FlipVerticalIcon className="size-5" />
      </EditorButton>
      <EditorButton
        title="Undo"
        onClick={() => tipTapEditor?.chain().focus().undo().run()}
      >
        <Undo2Icon className="size-5" />
      </EditorButton>
      <EditorButton
        title="Redo"
        onClick={() => tipTapEditor?.chain().focus().redo().run()}
      >
        <Redo2Icon className="size-5" />
      </EditorButton>
      <EditorButton
        title="Remove link"
        onClick={() => tipTapEditor?.chain().focus().unsetLink().run()}
        disabled={!tipTapEditor?.isActive('link')}
      >
        <UnlinkIcon className="size-5" />
      </EditorButton>
      <EditorButton
        title="Clear formatting"
        onClick={() => tipTapEditor?.chain().focus().unsetAllMarks().run()}
      >
        CF
      </EditorButton>
      <EditorButton
        title="Clear nodes"
        onClick={() => tipTapEditor?.chain().focus().clearNodes().run()}
      >
        CN
      </EditorButton>
    </>
  )
}
