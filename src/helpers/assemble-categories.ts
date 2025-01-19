export type Category = {
  id: number
  slug: string
  title: string
  description: string | null
  keywords: string | null
  parentId: number | null
  subcategories: Category[]
}

export type FlatCategory = Omit<Category, 'subcategories'>

export const withSubcategory = (flatCategory: FlatCategory): Category => {
  const subcategories: Category[] = []
  return { ...flatCategory, subcategories }
}

export function indexCategories<T extends { id: number }>(categories: T[]) {
  const index = new Map<number, T>()
  categories.forEach((category) => index.set(category.id, category))

  return index
}

export function assembleCategories(flatCategories: FlatCategory[]) {
  const categories = flatCategories.map(withSubcategory)
  const index = indexCategories(categories)
  const rootCategories: Category[] = []

  categories.forEach((category) => {
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
  flatCategories: FlatCategory[],
  categoryId: number
) {
  const index = indexCategories(flatCategories)
  const breadcrumbs: FlatCategory[] = []

  let currentCategory = index.get(categoryId)

  while (currentCategory) {
    breadcrumbs.unshift(currentCategory)
    currentCategory = index.get(currentCategory.parentId!)
  }

  return breadcrumbs
}
