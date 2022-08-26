import React, { useState, useCallback } from 'react'
import { TokenButton } from 'components/TokenButton'
import { SummitPopUp } from 'uikit/widgets/Popup'
import { OutTokenOptionsModal } from './OutTokenOptionsModal'

export const OutTokenButton: React.FC<{ token: string; index: number }> = ({
  token,
  index,
}) => {
  const [open, setOpen] = useState(false)
  const hide = useCallback(() => setOpen(false), [setOpen])

  return (
    <SummitPopUp
      open={open}
      callOnDismiss={hide}
      modal
      button={<TokenButton token={token} noTokenString="Missing" />}
      popUpContent={<OutTokenOptionsModal token={token} index={index} />}
    />
  )
}
