import { describe, it, expect } from 'bun:test'
import { assembleCategories, type Category } from './assemble-categories'

describe('assembleCategories', () => {
  const categories: Category[] = [
    {
      id: 1,
      slug: 'default',
      title: 'Default',
      description: null,
      keywords: null,
      parentId: null,
    },
    {
      id: 2,
      slug: 'coding',
      title: 'Coding',
      description: null,
      keywords: null,
      parentId: null,
    },
    {
      id: 3,
      slug: 'javascript',
      title: 'JavaScript',
      description: null,
      keywords: null,
      parentId: 2,
    },
    {
      id: 4,
      slug: 'typescript',
      title: 'TypeScript',
      description: null,
      keywords: null,
      parentId: 2,
    },
  ]

  it('should assemble categories with subcategories', () => {
    const { rootCategories, index } = assembleCategories(categories)

    expect(rootCategories.length).toEqual(2)
    expect(index.size).toEqual(4)

    expect(rootCategories[0]?.title).toEqual('Default')
    expect(rootCategories[0]?.subcategories).toEqual([])

    expect(rootCategories[1]?.title).toEqual('Coding')
    expect(rootCategories[1]?.subcategories.length).toEqual(2)

    expect(rootCategories[1]?.subcategories[0]?.title).toEqual('JavaScript')
    expect(rootCategories[1]?.subcategories[1]?.title).toEqual('TypeScript')
  })
})
