type Author = {
  userName: string | null
  firstName: string | null
  lastName: string | null
}

export const authorFallback = 'Unknown author'

export function formatAuthorName(author?: Author, fallback = authorFallback) {
  if (!author) return fallback

  if (author.firstName && author.lastName) {
    return `${author.firstName} ${author.lastName}`
  } else if (author.firstName) {
    return author.firstName
  } else if (author.lastName) {
    return author.lastName
  } else if (author.userName) {
    return author.userName
  }

  return fallback
}
