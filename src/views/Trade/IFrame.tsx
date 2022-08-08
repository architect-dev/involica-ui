import React, { useContext, useRef } from 'react'
import IframeResizer from 'iframe-resizer-react'
import { ThemeContext } from '../../contexts/ThemeContext'

interface IFrameProps {
  url: string
  title: string
}

const IFrame: React.FC<IFrameProps> = (props) => {
  const { url, title } = props
  const iframeRef = useRef(null)
  const { isDark } = useContext(ThemeContext)
  const sendSettings = (e) => {
    const payload = {
      isDark,
    }
    iframeRef.current.sendMessage(payload)
  }
  return (
    <IframeResizer
      forwardRef={iframeRef}
      heightCalculationMethod="max"
      title={title}
      src={url}
      onLoad={sendSettings}
      style={{ width: '1px', minWidth: '100%' }}
    />
  )
}

export default IFrame
