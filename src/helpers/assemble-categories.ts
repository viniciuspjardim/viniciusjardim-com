export type RecursiveCategory = {
  id: number
  slug: string
  title: string
  description: string | null
  keywords: string | null
  parentId: number | null
  subcategories: RecursiveCategory[]
}

export type Category = Omit<RecursiveCategory, 'subcategories'>

export const withSubcategory = (category: Category): RecursiveCategory => {
  const subcategories: RecursiveCategory[] = []
  return { ...category, subcategories }
}

export function indexCategories<T extends { id: number }>(categories: T[]) {
  const index = new Map<number, T>()
  categories.forEach((category) => index.set(category.id, category))

  return index
}

export function assembleCategories(categories: Category[]) {
  const recursiveCategories = categories.map(withSubcategory)
  const index = indexCategories(recursiveCategories)
  const rootCategories: RecursiveCategory[] = []

  recursiveCategories.forEach((category) => {
    if (!category.parentId) {
      rootCategories.push(category)
      return
    }

    const parent = index.get(category.parentId)
    parent?.subcategories.push(category)
  })

  return { rootCategories, index }
}

export function getCategoriesBreadcrumbs(
  categories: Category[],
  categoryId: number
) {
  const index = indexCategories(categories)
  const breadcrumbs: Category[] = []

  let currentCategory = index.get(categoryId)

  while (currentCategory) {
    breadcrumbs.unshift(currentCategory)
    currentCategory = index.get(currentCategory.parentId!)
  }

  return breadcrumbs
}
