import {
  describe,
  expect,
  it,
  beforeAll,
  afterAll,
  setSystemTime,
  mock,
} from 'bun:test'
import { screen, render } from '@testing-library/react'
import { type JSONContent } from '@tiptap/react'
import PostPage from './page'

const mockedPost = {
  id: 1,
  slug: 'example-post',
  title: 'My Test Post',
  description: 'Test description',
  keywords: 'test',
  content: { type: 'doc', content: [] } as JSONContent,
  rank: 10,
  authorId: 'author-1',
  categoryId: 1,
  lang: 'en',
  writtenAt: new Date('2025-01-01T00:00:00Z'),
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2025-01-01T00:00:00Z'),
  published: true,
  author: {
    id: 'author-1',
    name: 'John Doe',
    userImageUrl: 'https://example.com/avatar.jpg',
  },
}

const mockedCategories = [{ id: 1, name: 'Technology', slug: 'technology' }]

// Mock the API
void mock.module('~/trpc/server', () => ({
  api: {
    categories: {
      getAll: () => Promise.resolve(mockedCategories),
    },
    posts: {
      getOneBySlug: () => Promise.resolve(mockedPost),
    },
  },
}))

// Mock child components to avoid complex rendering
void mock.module('~/components/ui/breadcrumb', () => ({
  PostBreadcrumb: () => <nav data-testid="breadcrumb">Breadcrumb</nav>,
}))

void mock.module('~/components/post/post', () => ({
  Post: ({ post }: { post: typeof mockedPost }) => (
    <article data-testid="post">
      <h1>{post.title}</h1>
      <p>{post.description}</p>
    </article>
  ),
}))

beforeAll(() => {
  setSystemTime(new Date('2025-01-02T00:00:00Z'))
})

afterAll(() => {
  setSystemTime()
})

describe('PostPage', () => {
  it('should render post page with correct content', async () => {
    const component = await PostPage({
      params: Promise.resolve({ slug: 'example-post' }),
      searchParams: Promise.resolve({}),
    })

    render(component)

    // Verify the page renders correctly
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
    expect(screen.getByTestId('post')).toBeInTheDocument()
    expect(screen.getByText('My Test Post')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })
})
