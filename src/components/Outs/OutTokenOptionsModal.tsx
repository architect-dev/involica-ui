import React, { useCallback } from 'react'
import { useConfigurableOuts } from 'state/hooks'
import { SummitButton, Text } from 'uikit'
import { ModalContentContainer } from 'uikit/widgets/Popup/SummitPopUp'

// TODO: Add max slippage setting
export const OutTokenOptionsModal: React.FC<{
  token: string
  index: number
  onDismiss?: () => void
}> = ({ index, onDismiss }) => {
  const { removeOut } = useConfigurableOuts()
  const handleRemove = useCallback(() => {
    removeOut(index)
    onDismiss()
  }, [removeOut, index, onDismiss])
  return (
    <ModalContentContainer
      minWidth="300px"
    >
      <Text bold>Manage Token:</Text>
      <br />
      <SummitButton onClick={handleRemove} activeText="Remove" />
      <br />
      <SummitButton onClick={onDismiss} activeText="Close" />
    </ModalContentContainer>
  )
}
