import sanitize from 'sanitize-html'

sanitize.defaults.disallowedTagsMode = 'recursiveEscape'

export function sanitizeHtml(dirtyHtml: string) {
  return sanitize(dirtyHtml)
}
