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
