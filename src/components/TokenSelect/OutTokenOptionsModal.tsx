import React, { useCallback } from 'react'
import { Flex, SummitButton, Text } from 'uikit'
import { usePositionConfigState } from 'views/Tutorial/steps/introStore'

// TODO: Add max slippage setting
export const OutTokenOptionsModal: React.FC<{
  token: string
  index: number
  onDismiss?: () => void
}> = ({ index, onDismiss }) => {
  const removeOut = usePositionConfigState((state) => state.removeOut)
  const handleRemove = useCallback(() => {
    removeOut(index)
    onDismiss()
  }, [removeOut, index, onDismiss])
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minWidth="300px"
    >
      <Text bold>Manage Token:</Text>
      <br />
      <SummitButton onClick={handleRemove} activeText="Remove" />
      <br />
      <SummitButton onClick={onDismiss} activeText="Close" />
    </Flex>
  )
}
