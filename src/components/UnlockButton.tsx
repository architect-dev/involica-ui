import React, { useCallback } from 'react'
import SummitButton from 'uikit/components/Button/SummitButton'
import { useInvolicaStore } from 'state/zustand'

const UnlockButton = ({ summitPalette = null, ...props}) => {
  const setConnectModalOpen = useInvolicaStore((state) => state.setConnectModalOpen)
  const onPresentConnectModal = useCallback(
    () => setConnectModalOpen(true),
    [setConnectModalOpen]
  )

  return (
    <SummitButton onClick={onPresentConnectModal} summitPalette={summitPalette} {...props}>
      CONNECT WALLET
    </SummitButton>
  )
}

export default React.memo(UnlockButton)
