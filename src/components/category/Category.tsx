export type CategoryProps = {
  id: number
  name: string
  slug: string
  subcategories: CategoryProps[]
  breadCrumbs?: { name: string; slug: string }[]
}

export function Category({
  name,
  slug,
  subcategories,
  breadCrumbs = [],
}: CategoryProps) {
  const crumbs = [...breadCrumbs, { name, slug }]

  return (
    <>
      <div className="p-2 transition-all duration-200 hover:bg-slate-500/20">
        <div>
          {name} <span className="opacity-30">({slug})</span>
        </div>

        <div className="opacity-30">
          {crumbs.map((crumb) => (
            <span key={crumb.slug}>
              {' > '}
              {crumb.name}
            </span>
          ))}
        </div>
      </div>

      {subcategories.length > 0 && (
        <div className="flex pl-4">
          <div className="border-l-2 border-l-white/10" />

          <div className="flex-1">
            {subcategories.map((subcategory) => (
              <Category
                key={subcategory.id}
                id={subcategory.id}
                name={subcategory.name}
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
