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
import { generateHeadingItem } from '~/helpers/tiptap-utils'

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
  id?: string
  children: React.ReactNode
}

function Heading({ level = 1, id, children }: HeadingProps) {
  const Hx = `h${level}` as keyof JSX.IntrinsicElements

  return <Hx id={id}>{children}</Hx>
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

export function JsonParser(node: JSONContent) {
  switch (node.type) {
    case 'doc':
      return (
        <div className="blog-post text-md whitespace-pre-wrap md:text-xl">
          {node.content?.map((item, index) => (
            <JsonParser key={index} {...item} />
          ))}
        </div>
      )

    case 'text':
      return <Text marks={node.marks}>{node.text}</Text>

    case 'heading':
      return (
        <Heading
          level={node.attrs?.level as number | undefined}
          id={generateHeadingItem(node)?.slug}
        >
          {node.content?.map((item, index) => (
            <JsonParser key={index} {...item} />
          ))}
        </Heading>
      )

    case 'paragraph':
      return (
        <p>
          {node.content?.map((item, index) => (
            <JsonParser key={index} {...item} />
          ))}
        </p>
      )

    case 'hardBreak':
      return <br />

    case 'codeBlock':
      return (
        <CodeBlock
          language={node.attrs?.language as string}
          contentText={node.content?.[0]?.text}
        />
      )
    case 'image':
      return (
        <div className="py-2">
          <Image
            className="rounded-md bg-neutral-950"
            src={node.attrs?.src as string}
            alt={node.attrs?.alt as string}
            width={(node.attrs?.width as `${number}`) ?? '768'}
            height={(node.attrs?.height as `${number}`) ?? '432'}
            quality={90}
          />
        </div>
      )
    case 'video':
      return (
        <div className="py-2">
          <video
            className="rounded-md bg-neutral-950"
            src={node.attrs?.src as string}
            controls
            width={768}
            height={432}
          />
        </div>
      )
    case 'bulletList':
      return (
        <ul>
          {node.content?.map((item, index) => (
            <JsonParser key={index} {...item} />
          ))}
        </ul>
      )

    case 'listItem':
      return (
        <li>
          {node.content?.map((item, index) => (
            <JsonParser key={index} {...item} />
          ))}
        </li>
      )

    default:
      return null
  }
}
