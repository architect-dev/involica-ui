import React, { useCallback, useState } from 'react'
import { SummitButton } from 'uikit'
import { SummitPopUp } from 'uikit/widgets/Popup'
import { ConfigPreviewModal } from './ConfigPreviewModal'
import { IntroStep, useIntroActiveStep } from './introStore'

export const ConfigPreview: React.FC = () => {
  const activeStep = useIntroActiveStep()
  const [open, setOpen] = useState(false)
  const show = useCallback(() => setOpen(false), [setOpen])
  const hide = useCallback(() => setOpen(false), [setOpen])
  if (activeStep <= IntroStep.TokenIn) return null
  return (
    <SummitPopUp
      open={open}
      callOnDismiss={hide}
      modal
      button={
        <SummitButton
          onClick={show}
          activeText="Preview"
          width='100px'
        />
      }
      popUpContent={<ConfigPreviewModal />}
    />
  )
}
