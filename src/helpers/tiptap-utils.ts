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
