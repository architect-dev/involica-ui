import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { SummitButton } from 'uikit'
import { SummitPopUp } from 'uikit/widgets/Popup'
import { ConfigPreviewModal } from './ConfigPreviewModal'
import { IntroStep, useIntroActiveStep } from './introStore'

const FixedDiv = styled.div`
  position: sticky;
  top: 45px;
  margin-left: auto;
  width: 130px;
  z-index: 10;
`

export const ConfigPreview: React.FC = () => {
  const activeStep = useIntroActiveStep()
  const [open, setOpen] = useState(false)
  const show = useCallback(() => setOpen(false), [setOpen])
  const hide = useCallback(() => setOpen(false), [setOpen])
  if (activeStep <= IntroStep.TokenIn) return null
  return (
    <FixedDiv>
      <SummitPopUp
        open={open}
        callOnDismiss={hide}
        modal
        button={
          <SummitButton onClick={show} activeText="Preview Position" width="130px" />
        }
        popUpContent={<ConfigPreviewModal />}
      />
    </FixedDiv>
  )
}
