import { Node, nodeInputRule } from '@tiptap/react'
import { Plugin, PluginKey } from 'prosemirror-state'

export interface SpeechOptions {
  HTMLAttributes: Record<string, string>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    speech: {
      setSpeech: (src: string) => ReturnType
      toggleSpeech: (src: string) => ReturnType
    }
  }
}

const SPEECH_INPUT_REGEX = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/

export const Speech = Node.create({
  name: 'speech',
  group: 'block',

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (el) => (el as HTMLSpanElement).getAttribute('src'),
        renderHTML: (attrs) => ({ src: attrs.src as string }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'audio',
        getAttrs: (el) => ({
          src: (el as HTMLAudioElement).getAttribute('src'),
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'audio',
      { controls: 'true', ...HTMLAttributes },
      ['source', HTMLAttributes],
    ]
  },

  addCommands() {
    return {
      setSpeech:
        (src: string) =>
        ({ commands }) =>
          commands.insertContent(`<audio controls="true" src="${src}" />`),

      toggleSpeech:
        () =>
        ({ commands }) =>
          commands.toggleNode(this.name, 'paragraph'),
    }
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: SPEECH_INPUT_REGEX,
        type: this.type,
        getAttributes: (match) => {
          const [, , src] = match

          return { src }
        },
      }),
    ]
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('audioDropPlugin'),
      }),
    ]
  },
})
