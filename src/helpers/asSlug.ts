const before = 'áéíóúâêîôûãõñçà'.split('')
const after = 'aeiouaeiouaonca'.split('')

export function asSlug(value: string): string {
  let slug = value.toLocaleLowerCase()

  before.forEach((letter, index) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    slug = slug.replaceAll(letter, after[index]!)
  })

  slug = slug.replaceAll(/[^a-z0-9]+/g, '-')
  slug = slug.replaceAll(/^-|-$/g, '')

  return slug
}
