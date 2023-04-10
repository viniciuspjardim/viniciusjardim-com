import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from './sanitizeHtml'

describe('sanitizeHtml', () => {
  it('should allow regular text', () => {
    expect(sanitizeHtml('My post content')).toEqual('My post content')
    expect(sanitizeHtml('My post content\n second line.')).toEqual(
      'My post content\n second line.'
    )
  })

  it('should allow basic html tags without attributes', () => {
    expect(sanitizeHtml('<p>My post content</p>')).toEqual(
      '<p>My post content</p>'
    )
    expect(sanitizeHtml('<p class="abc">My post content</p>')).toEqual(
      '<p>My post content</p>'
    )
  })

  it('should scape unwanted tags like script', () => {
    expect(sanitizeHtml('<script>console.log("hello")</script>')).toEqual(
      '&lt;script&gt;console.log("hello")&lt;/script&gt;'
    )
  })
})
