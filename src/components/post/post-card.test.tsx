import {
  describe,
  expect,
  it,
  beforeAll,
  afterAll,
  setSystemTime,
} from 'bun:test'
import { screen, render } from '@testing-library/react'
import { type JSONContent } from '@tiptap/react'
import { PostCard } from './post-card'

beforeAll(() => {
  setSystemTime(new Date('2025-01-02T00:00:00Z'))
})
afterAll(() => {
  setSystemTime()
})

describe('PostCard', () => {
  it('should render PostCard', () => {
    const post = {
      id: 1,
      slug: 'example-post',
      title: 'My Post',
      description: 'My Post Description',
      keywords: 'example, post',
      content: {} as JSONContent,
      rank: 10,
      authorId: 'author-1',
      categoryId: 1,
      lang: 'en',
      writtenAt: new Date('2025-01-01T00:00:00Z'),
      createdAt: new Date('2025-01-01T00:00:00Z'),
      updatedAt: new Date('2025-01-01T00:00:00Z'),
      published: true,
    }

    render(<PostCard post={post} userName="John Doe" />)

    expect(screen.getByRole('link')).toBeInTheDocument()
    expect(screen.getByText('My Post')).toBeInTheDocument()
    expect(screen.getByText('My Post Description')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('1 day ago')).toBeInTheDocument()
  })
})
