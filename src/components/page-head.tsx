import Head from 'next/head'

type PageHeadProps = {
  page?: string
  description?: string
}

const blogName = 'Vinícius Jardim'

export function PageHead({
  page,
  description = `${blogName} - blog (draft)`,
}: PageHeadProps) {
  const title = page ? `${page} | ${blogName}` : blogName

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.svg" />
    </Head>
  )
}
