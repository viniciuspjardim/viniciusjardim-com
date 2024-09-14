import type { JSONContent } from '@tiptap/core'

import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-bash'

import { sanitizeHtml } from '~/helpers/sanitize-html'

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

    case 'strike':
      return <del>{children}</del>

    case 'code':
      return <code>{children}</code>

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

type CodeBlockProps = {
  language?: string
  contentText?: string
}

function CodeBlock({
  language = 'plaintext',
  contentText = '',
}: CodeBlockProps) {
  const gramar = Prism.languages?.[language]

  if (!gramar) {
    return (
      <pre>
        <code>{contentText}</code>
      </pre>
    )
  }

  return (
    <pre>
      <code
        className={`language-${language}`}
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(Prism.highlight(contentText, gramar, language)),
        }}
      />
    </pre>
  )
}

export function JsonParser({ content, type, text, attrs, marks }: JSONContent) {
  switch (type) {
    case 'doc':
      return (
        <div className="blog-post text-md whitespace-pre-wrap md:text-xl">
          {content?.map((item, index) => <JsonParser key={index} {...item} />)}
        </div>
      )

    case 'text':
      return <Text marks={marks}>{text}</Text>

    case 'heading':
      return (
        <Heading level={attrs?.level as number | undefined}>
          {content?.map((item, index) => <JsonParser key={index} {...item} />)}
        </Heading>
      )

    case 'paragraph':
      return (
        <p>
          {content?.map((item, index) => <JsonParser key={index} {...item} />)}
        </p>
      )

    case 'codeBlock':
      return (
        <CodeBlock
          language={attrs?.language as string}
          contentText={content?.[0]?.text}
        />
      )
    case 'image':
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={attrs?.src as string}
          alt={attrs?.alt as string}
          className="w-full"
        />
      )

    case 'bulletList':
      return (
        <ul>
          {content?.map((item, index) => <JsonParser key={index} {...item} />)}
        </ul>
      )

    case 'listItem':
      return (
        <li>
          {content?.map((item, index) => <JsonParser key={index} {...item} />)}
        </li>
      )

    default:
      return null
  }
}
