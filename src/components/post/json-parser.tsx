import Image from 'next/image'
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
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-zig'

import { sanitizeHtml } from '~/helpers/sanitize-html'

type TextProps = {
  marks?: { type: string; attrs?: Record<string, unknown> }[]
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

    case 'link':
      if (typeof mark?.attrs?.href === 'string') {
        return (
          <a href={mark.attrs.href} target="_blank">
            {children}
          </a>
        )
      }
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

    case 'hardBreak':
      return <br />

    case 'codeBlock':
      return (
        <CodeBlock
          language={attrs?.language as string}
          contentText={content?.[0]?.text}
        />
      )
    case 'image':
      return (
        <div className="py-2">
          <Image
            className="rounded-md bg-neutral-950"
            src={attrs?.src as string}
            alt={attrs?.alt as string}
            width={(attrs?.width as `${number}`) ?? '768'}
            height={(attrs?.height as `${number}`) ?? '404'}
            quality={90}
          />
        </div>
      )
    case 'video':
      return (
        <div className="py-2">
          <video
            className="rounded-md bg-neutral-950"
            src={attrs?.src as string}
            controls
            width={768}
            height={404}
          />
        </div>
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
