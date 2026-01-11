import type { JSONContent } from '@tiptap/core'

import Image from 'next/image'
import { FileIcon, TerminalIcon } from 'lucide-react'
import { GitHubLogoIcon } from '@radix-ui/react-icons'

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
import 'prismjs/components/prism-diff'
import 'prismjs/plugins/diff-highlight/prism-diff-highlight'

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
  language: string
  contentText: string
  fileName?: string
  showCopyButton?: boolean
  gitHubUrl?: string
}

function CodeBlock({
  language,
  contentText,
  fileName,
  showCopyButton,
  gitHubUrl,
}: CodeBlockProps) {
  const isDiff = language.startsWith('diff-')
  const gramar = isDiff ? Prism.languages.diff : Prism.languages?.[language]
  const headerState =
    fileName || showCopyButton || gitHubUrl ? 'visible' : 'hidden'

  const codeContent = gramar ? (
    <code
      className={`language-${language} ${isDiff ? 'diff-highlight' : ''}`}
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
    <div className="overflow-clip border-y bg-neutral-900/75 md:border">
      <div
        className="flex min-h-8 items-center justify-between border-b px-5 data-[state=hidden]:hidden"
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

        {(gitHubUrl || showCopyButton) && (
          <div className="flex items-center gap-4">
            {gitHubUrl && (
              <a
                className="text-muted-foreground! hover:text-white!"
                href={gitHubUrl}
                target="_blank"
                aria-label="View on GitHub"
              >
                <GitHubLogoIcon className="size-5" />
              </a>
            )}
            {showCopyButton && <CopyButton textToCopy={contentText} />}
          </div>
        )}
      </div>
      <pre className="[scrollbar-width:none] md:[scrollbar-width:thin]">
        {codeContent}
      </pre>
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
        <div className="md:px-10">
          <CodeBlock
            language={(node.attrs?.language as string | null) ?? 'plaintext'}
            contentText={node.content?.[0]?.text ?? ''}
            fileName={node.attrs?.fileName as string}
            showCopyButton={node.attrs?.showCopyButton as boolean}
            gitHubUrl={node.attrs?.gitHubUrl as string}
          />
        </div>
      )
    case 'image':
      return (
        <div className="space-y-2 py-2 md:px-10">
          <Image
            className="bg-card md:rounded-md"
            src={node.attrs?.src as string}
            alt={node.attrs?.alt as string}
            preload={!!node.attrs?.isPriority}
            loading={node.attrs?.isPriority ? 'eager' : 'lazy'}
            fetchPriority={node.attrs?.isPriority ? 'high' : 'low'}
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
        <div className="py-2 md:px-10">
          <video
            className="bg-card md:rounded-md"
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
