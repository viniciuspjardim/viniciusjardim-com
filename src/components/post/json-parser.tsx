import type { JSONContent } from '@tiptap/core'

import Image from 'next/image'
import { FileIcon, TerminalIcon } from 'lucide-react'

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

import { CopyButton } from '~/components/post/copy-button'
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
  const Hx = `h${level}` as keyof React.JSX.IntrinsicElements

  return <Hx id={id}>{children}</Hx>
}

type CodeBlockProps = {
  language?: string
  contentText?: string
  fileName?: string
  showCopyButton?: boolean
}

function CodeBlock({
  contentText = '',
  language = 'plaintext',
  fileName,
  showCopyButton,
}: CodeBlockProps) {
  const gramar = Prism.languages?.[language]
  const headerState = fileName || showCopyButton ? 'visible' : 'hidden'

  const codeContent = gramar ? (
    <code
      className={`language-${language}`}
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(Prism.highlight(contentText, gramar, language)),
      }}
    />
  ) : (
    <code>{contentText}</code>
  )

  const fileIcon =
    fileName === 'Terminal' ? (
      <TerminalIcon className="size-4" />
    ) : (
      <FileIcon className="size-4" />
    )

  return (
    <div className="overflow-clip rounded-md border">
      <div
        className="flex min-h-10 items-center justify-between border-b px-4 py-1 data-[state=hidden]:hidden"
        data-state={headerState}
      >
        {fileName ? (
          <span className="text-muted-foreground inline-flex items-center gap-2 text-sm font-medium">
            {fileIcon}
            <span>{fileName}</span>
          </span>
        ) : (
          <span />
        )}
        {showCopyButton && <CopyButton textToCopy={contentText} />}
      </div>
      <pre>{codeContent}</pre>
    </div>
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
          contentText={node.content?.[0]?.text}
          language={node.attrs?.language as string}
          fileName={node.attrs?.fileName as string}
          showCopyButton={node.attrs?.showCopyButton as boolean}
        />
      )
    case 'image':
      return (
        <div className="space-y-2 py-2">
          <Image
            className="bg-card rounded-md"
            src={node.attrs?.src as string}
            alt={node.attrs?.alt as string}
            priority={(node.attrs?.isPriority as boolean) ?? false}
            width={(node.attrs?.width as `${number}`) ?? '768'}
            height={(node.attrs?.height as `${number}`) ?? '432'}
            quality={80}
          />
          {node.attrs?.description && (
            <p className="text-muted-foreground text-lg font-medium">
              {node.attrs?.description}
            </p>
          )}
        </div>
      )
    case 'video':
      return (
        <div className="py-2">
          <video
            className="bg-card rounded-md"
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
