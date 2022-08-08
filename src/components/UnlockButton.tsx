import React, { useCallback } from 'react'
import SummitButton from 'uikit/components/Button/SummitButton'
import { useDispatch } from 'react-redux'
import { setForceOpenConnectModal } from 'state/summitEcosystem'

const UnlockButton = ({ summitPalette = null, ...props}) => {
  const dispatch = useDispatch()
  const onPresentConnectModal = useCallback(
    () => dispatch(setForceOpenConnectModal(true)),
    [dispatch]
  )

  return (
    <SummitButton onClick={onPresentConnectModal} summitPalette={summitPalette} {...props}>
      CONNECT WALLET
    </SummitButton>
  )
}

export default React.memo(UnlockButton)
