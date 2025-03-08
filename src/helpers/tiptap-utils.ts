import type { JSONContent } from '@tiptap/core'

export function findPostNode(
  node: JSONContent,
  type: string
): JSONContent | null {
  if (node.type === type) {
    return node
  }

  if (node.content) {
    for (const child of node.content) {
      const result = findPostNode(child, type)

      if (result) {
        return result
      }
    }
  }

  return null
}

/** Add the speech audio into the post. In case the audio already exists it will replace it. */
export function addOrReplaceSpeechNode(content: string, speechUrl: string) {
  const root = JSON.parse(content) as JSONContent
  const speechNode = findPostNode(root, 'speech')

  if (speechNode?.attrs) {
    speechNode.attrs.src = speechUrl
  } else {
    root.content?.push({
      type: 'speech',
      attrs: { src: speechUrl },
    })
  }

  return JSON.stringify(root)
}

function getPostTextRecursive(
  node: JSONContent,
  textArray: string[],
  separator: string,
  titlesSeparator: string,
  skipCodeBlocks: boolean
) {
  if (skipCodeBlocks && node.type === 'codeBlock') {
    return textArray
  }

  if (node.type === 'text' && node.text) {
    textArray.push(node.text)
  }
  if (node.type === 'hardBreak') {
    textArray.push('\n')
  }

  if (node.content) {
    for (const child of node.content) {
      getPostTextRecursive(
        child,
        textArray,
        separator,
        titlesSeparator,
        skipCodeBlocks
      )
    }
  }

  if (node.type === 'heading') {
    textArray.push(titlesSeparator)
  }
  if (node.type === 'paragraph') {
    textArray.push(separator)
  }
  if (node.type === 'codeBlock' && !skipCodeBlocks) {
    textArray.push(separator)
  }

  return textArray
}

type GetPostTextOptions = {
  title?: string
  description?: string | null
  separator?: string
  titlesSeparator?: string
  skipCodeBlocks?: boolean
}

const getPostTextDefaultOptions = Object.freeze({
  separator: '\n\n',
  titlesSeparator: '\n\n',
  skipCodeBlocks: true,
})

/**
 * Parse the tiptap post object into a string, so it can be used to generate a text to
 * speech audio
 */
export function getPostText(
  content: string,
  {
    title,
    description,
    separator = getPostTextDefaultOptions.separator,
    titlesSeparator = getPostTextDefaultOptions.titlesSeparator,
    skipCodeBlocks = getPostTextDefaultOptions.skipCodeBlocks,
  }: GetPostTextOptions = getPostTextDefaultOptions
) {
  const root = JSON.parse(content) as JSONContent
  const textArray: string[] = []

  if (title) {
    textArray.push(title)
    textArray.push(titlesSeparator)
  }

  if (description) {
    textArray.push(description)
    textArray.push(separator)
  }

  getPostTextRecursive(
    root,
    textArray,
    separator,
    titlesSeparator,
    skipCodeBlocks
  )

  return textArray.join('')
}
