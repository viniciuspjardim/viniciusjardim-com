import sanitize from 'sanitize-html'

sanitize.defaults.disallowedTagsMode = 'recursiveEscape'
sanitize.defaults.allowedTags = ['span']
sanitize.defaults.allowedAttributes = { span: ['class'] }

export function sanitizeHtml(dirtyHtml: string) {
  return sanitize(dirtyHtml)
}
