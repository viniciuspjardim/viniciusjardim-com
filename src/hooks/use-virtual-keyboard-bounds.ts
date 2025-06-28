import { useEffect, useState } from 'react'

export const useVirtualKeyboardBounds = () => {
  const [bounds, setBounds] = useState({ x: 0, y: 0, width: 0, height: 0 })

  useEffect(() => {
    if ('virtualKeyboard' in navigator) {
      console.log('useVirtualKeyboardBounds: has VirtualKeyboard API')

      // Make the virtual keyboard overlay the page content
      navigator.virtualKeyboard.overlaysContent = true

      const handleGeometryChange = (
        event: VirtualKeyboardGeometryChangeEvent
      ) => {
        // Update state when bounds change
        const { x, y, width, height } = event.target.boundingRect
        setBounds({ x, y, width, height })
      }

      navigator.virtualKeyboard.addEventListener(
        'geometrychange',
        handleGeometryChange
      )

      return () => {
        console.log('useVirtualKeyboardBounds: cleanup')
        navigator.virtualKeyboard.overlaysContent = false
        navigator.virtualKeyboard.removeEventListener(
          'geometrychange',
          handleGeometryChange
        )
      }
    }

    console.log('useVirtualKeyboardBounds: no VirtualKeyboard API')
  }, [])

  return bounds
}
