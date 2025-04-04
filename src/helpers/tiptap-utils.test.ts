import { describe, it, expect } from 'bun:test'
import type { JSONContent } from '@tiptap/core'
import { addOrReplaceSpeechNode, getPostText } from './tiptap-utils'

describe('addOrReplaceSpeechNode', () => {
  const post: JSONContent = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'First paragraph.' }],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Second paragraph.' }],
      },
    ],
  }

  const postWithSpeech: JSONContent = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'First paragraph.' }],
      },
      {
        type: 'speech',
        attrs: { src: 'old-url' },
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Second paragraph.' }],
      },
    ],
  }

  it('should add the speech node when it does not exists', () => {
    addOrReplaceSpeechNode(post, 'new-url')
    expect(post.content?.[2]?.attrs?.src).toBe('new-url')
  })
  it('should update the speech node when the speech exists', () => {
    addOrReplaceSpeechNode(postWithSpeech, 'new-url')
    expect(postWithSpeech.content?.[1]?.attrs?.src).toBe('new-url')
  })
})

describe('getPostText', () => {
  const post: JSONContent = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'First paragraph.' }],
      },
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: 'H3 title' }],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Second paragraph.' }],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Third paragraph.' }],
      },
    ],
  }

  const postWithCode = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'First paragraph.' }],
      },
      {
        type: 'codeBlock',
        attrs: { language: 'javascript' },
        content: [{ type: 'text', text: "console.log('abc')" }],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Second paragraph.' }],
      },
    ],
  }

  it('should convert the post object into an array of the texts', () => {
    const result = getPostText(post)

    expect(result).toEqual(
      'First paragraph.\n\nH3 title\n\nSecond paragraph.\n\nThird paragraph.\n\n'
    )
  })
  it('should skip code blocks by default', () => {
    const result = getPostText(postWithCode)

    expect(result).toEqual('First paragraph.\n\nSecond paragraph.\n\n')
  })
  it('should not skip code when flag is passed', () => {
    const result = getPostText(postWithCode, {
      skipCodeBlocks: false,
    })

    expect(result).toEqual(
      "First paragraph.\n\nconsole.log('abc')\n\nSecond paragraph.\n\n"
    )
  })
  it('should include title and description', () => {
    const result = getPostText(post, {
      title: 'Title',
      description: 'Description',
    })

    expect(result).toEqual(
      'Title\n\nDescription\n\nFirst paragraph.\n\nH3 title\n\nSecond paragraph.\n\nThird paragraph.\n\n'
    )
  })
  it('should be able to use custom separators', () => {
    const result = getPostText(post, {
      title: 'Title',
      separator: ' ',
      titlesSeparator: '. ',
    })

    expect(result).toEqual(
      'Title. First paragraph. H3 title. Second paragraph. Third paragraph. '
    )
  })
  it('should be able to use custom separators when title is not passed', () => {
    const result = getPostText(post, {
      separator: ' ',
      titlesSeparator: '. ',
    })

    expect(result).toEqual(
      'First paragraph. H3 title. Second paragraph. Third paragraph. '
    )
  })
})
