import React from 'react'
import { usePageForcedDarkMode } from 'state/hooks'

const PageForcedDarkComponent: React.FC = () => {
  usePageForcedDarkMode()
  return null
}

export default React.memo(PageForcedDarkComponent)
