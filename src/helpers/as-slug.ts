const before = 'áéíóúâêîôûãõñçà'.split('')
const after = 'aeiouaeiouaonca'.split('')

export function asSlug(title: string) {
  let slug = title.toLocaleLowerCase()

  before.forEach((letter, index) => {
    slug = slug.replaceAll(letter, after[index]!)
  })

  slug = slug.replaceAll(/[^a-z0-9]+/g, '-')
  slug = slug.replaceAll(/^-|-$/g, '')

  return slug
}
