import { describe, it, expect } from 'bun:test'
import { getPostText } from './tiptap-utils'

describe('getPostText', () => {
  const post = {
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
    const result = getPostText(JSON.stringify(post))

    expect(result).toEqual(
      'First paragraph.\n\nH3 title\n\nSecond paragraph.\n\nThird paragraph.\n\n'
    )
  })
  it('should skip code blocks by default', () => {
    const result = getPostText(JSON.stringify(postWithCode))

    expect(result).toEqual('First paragraph.\n\nSecond paragraph.\n\n')
  })
  it('should not skip code when flag is passed', () => {
    const result = getPostText(JSON.stringify(postWithCode), {
      skipCodeBlocks: false,
    })

    expect(result).toEqual(
      "First paragraph.\n\nconsole.log('abc')\n\nSecond paragraph.\n\n"
    )
  })
  it('should include title and description', () => {
    const result = getPostText(JSON.stringify(post), {
      title: 'Title',
      description: 'Description',
    })

    expect(result).toEqual(
      'Title\n\nDescription\n\nFirst paragraph.\n\nH3 title\n\nSecond paragraph.\n\nThird paragraph.\n\n'
    )
  })
  it('should be able to use custom separators', () => {
    const result = getPostText(JSON.stringify(post), {
      title: 'Title',
      separator: ' ',
      titlesSeparator: '. ',
    })

    expect(result).toEqual(
      'Title. First paragraph. H3 title. Second paragraph. Third paragraph. '
    )
  })
  it('should be able to use custom separators when title is not passed', () => {
    const result = getPostText(JSON.stringify(post), {
      separator: ' ',
      titlesSeparator: '. ',
    })

    expect(result).toEqual(
      'First paragraph. H3 title. Second paragraph. Third paragraph. '
    )
  })
})
