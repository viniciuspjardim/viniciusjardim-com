export type CategoryProps = {
  id: number
  slug: string
  title: string
  subcategories: CategoryProps[]
  breadCrumbs?: { title: string; slug: string }[]
}

export function Category({
  slug,
  title,
  subcategories,
  breadCrumbs = [],
}: CategoryProps) {
  const crumbs = [...breadCrumbs, { title, slug }]

  return (
    <>
      <div className="rounded-xl py-2 transition-all hover:bg-neutral-950">
        <div>
          {title} <span className="opacity-40">({slug})</span>
        </div>

        <div className="text-sm opacity-40">
          {crumbs.map((crumb) => (
            <span key={crumb.slug}>
              {' • '}
              {crumb.title}
            </span>
          ))}
        </div>
      </div>

      {subcategories.length > 0 && (
        <div className="flex">
          <div className="border-l border-neutral-800 pr-4" />

          <div className="flex-1">
            {subcategories.map((subcategory) => (
              <Category
                key={subcategory.id}
                id={subcategory.id}
                title={subcategory.title}
                slug={subcategory.slug}
                subcategories={subcategory.subcategories}
                breadCrumbs={crumbs}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
