import { describe, it, expect } from 'vitest'
import { assembleCategories, type Category } from './assembleCategories'

describe('assembleCategories', () => {
  const flatCategories: Category[] = [
    {
      id: 1,
      name: 'Default',
      slug: 'default',
      subcategories: [],
    },
    {
      id: 2,
      name: 'Coding',
      slug: 'coding',
      subcategories: [],
    },
    {
      id: 3,
      name: 'JavaScript',
      slug: 'javascript',
      parentId: 2,
      subcategories: [],
    },
    {
      id: 4,
      name: 'TypeScript',
      slug: 'typescript',
      parentId: 2,
      subcategories: [],
    },
  ]

  it('should assemble categories with subcategories', () => {
    const { rootCategories, index } = assembleCategories(flatCategories)

    expect(rootCategories.length).toEqual(2)
    expect(index.size).toEqual(4)

    expect(rootCategories[0]?.name).toEqual('Default')
    expect(rootCategories[0]?.subcategories).toEqual([])

    expect(rootCategories[1]?.name).toEqual('Coding')
    expect(rootCategories[1]?.subcategories.length).toEqual(2)

    expect(rootCategories[1]?.subcategories[0]?.name).toEqual('JavaScript')
    expect(rootCategories[1]?.subcategories[1]?.name).toEqual('TypeScript')
  })
})
