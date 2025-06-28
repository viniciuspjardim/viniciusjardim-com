declare global {
  interface VirtualKeyboardGeometryChangeEvent extends Event {
    target: EventTarget & VirtualKeyboard
  }

  interface VirtualKeyboard {
    show(): void
    hide(): void
    readonly boundingRect: DOMRect
    overlaysContent: boolean

    addEventListener(
      type: 'geometrychange',
      listener: (event: VirtualKeyboardGeometryChangeEvent) => void
    ): void

    removeEventListener(
      type: 'geometrychange',
      listener: (event: VirtualKeyboardGeometryChangeEvent) => void
    ): void
  }

  interface Navigator {
    readonly virtualKeyboard: VirtualKeyboard
  }
}

export {}
