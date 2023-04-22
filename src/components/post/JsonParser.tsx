import type { JSONContent } from '@tiptap/core'

type TextProps = {
  marks?: { type: string }[]
  children: React.ReactNode
}

function Text({ marks = [], children }: TextProps) {
  const [mark] = marks

  switch (mark?.type) {
    case 'bold':
      return <strong>{children}</strong>

    case 'italic':
      return <em>{children}</em>

    case 'code':
      return <code>{children}</code>

    case 'strike':
      return <del>{children}</del>

    default:
      return <>{children}</>
  }
}

type HeadingProps = {
  level?: number
  children: React.ReactNode
}

function Heading({ level = 1, children }: HeadingProps) {
  const Hx = `h${level}` as keyof JSX.IntrinsicElements

  return <Hx>{children}</Hx>
}

export function JsonParser({ content, type, text, attrs, marks }: JSONContent) {
  switch (type) {
    case 'doc':
      return (
        <div className="blog-post text-md my-4 whitespace-pre-wrap md:my-6 md:text-xl">
          {content?.map((item, index) => (
            <JsonParser key={index} {...item} />
          ))}
        </div>
      )

    case 'text':
      return <Text marks={marks}>{text}</Text>

    case 'heading':
      return (
        <Heading level={attrs?.level as number | undefined}>
          {content?.map((item, index) => (
            <JsonParser key={index} {...item} />
          ))}
        </Heading>
      )

    case 'paragraph':
      return (
        <p>
          {content?.map((item, index) => (
            <JsonParser key={index} {...item} />
          ))}
        </p>
      )

    case 'codeBlock':
      return (
        <pre>
          <code>
            {content?.map((item, index) => (
              <JsonParser key={index} {...item} />
            ))}
          </code>
        </pre>
      )

    case 'bulletList':
      return (
        <ul>
          {content?.map((item, index) => (
            <JsonParser key={index} {...item} />
          ))}
        </ul>
      )

    case 'listItem':
      return (
        <li>
          {content?.map((item, index) => (
            <JsonParser key={index} {...item} />
          ))}
        </li>
      )

    default:
      return null
  }
}
