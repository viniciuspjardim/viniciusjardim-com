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
      <div className="transition-all duration-200 hover:bg-slate-500/20">
        <div>
          {title} <span className="opacity-30">({slug})</span>
        </div>

        <div className="opacity-30">
          {crumbs.map((crumb) => (
            <span key={crumb.slug}>
              {' > '}
              {crumb.title}
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
