import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from './sanitizeHtml'

describe('sanitizeHtml', () => {
  it('should allow regular text', () => {
    expect(sanitizeHtml('My post content')).toEqual('My post content')
    expect(sanitizeHtml('My post content\n second line.')).toEqual(
      'My post content\n second line.'
    )
  })

  it('should allow span tags with class attribute', () => {
    expect(sanitizeHtml('<span>My post content</span>')).toEqual(
      '<span>My post content</span>'
    )
    expect(
      sanitizeHtml('<span id="my-id" class="my-class">My post content</span>')
    ).toEqual('<span class="my-class">My post content</span>')
  })

  it('should scape unwanted tags like script', () => {
    expect(sanitizeHtml('<script>console.log("hello")</script>')).toEqual(
      '&lt;script&gt;console.log("hello")&lt;/script&gt;'
    )
  })
})
