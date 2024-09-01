export type Category = {
  id: number
  slug: string
  title: string
  description: string | null
  keywords: string | null
  parentId: number | null
  subcategories: Category[]
}

export function assembleCategories(flatCategories: Category[]) {
  const index = new Map<number, Category>()
  flatCategories.forEach((category) => index.set(category.id, category))

  const rootCategories: Category[] = []

  flatCategories.forEach((category) => {
    if (!category.parentId) {
      rootCategories.push(category)
      return
    }

    const parent = index.get(category.parentId)
    parent?.subcategories.push(category)
  })

  return { rootCategories, index }
}
