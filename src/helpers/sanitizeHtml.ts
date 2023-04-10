import sanitize from 'sanitize-html'

sanitize.defaults.disallowedTagsMode = 'recursiveEscape'
sanitize.defaults.allowedAttributes = { code: ['class'], span: ['class'] }

export function sanitizeHtml(dirtyHtml: string) {
  return sanitize(dirtyHtml)
}
