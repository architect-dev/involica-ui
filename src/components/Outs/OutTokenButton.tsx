import React, { useCallback } from 'react'
import { TokenButton } from 'components/TokenButton'
import { ModalContentContainer, RowBetween, RowCenter, SummitButton, SummitPopUp, Text } from 'uikit'
import { useConfigurableOuts } from 'state/hooks'
import { useShowHideModal } from 'utils'
import { MaxSlippageSelector } from './MaxSlippageSelector'

export const OutTokenOptionsModal: React.FC<{
  token: string
  onDismiss?: () => void
}> = ({ token, onDismiss }) => {
  const { removeOut } = useConfigurableOuts()
  const handleRemove = useCallback(() => {
    removeOut(token)
    onDismiss()
  }, [removeOut, token, onDismiss])
  return (
    <ModalContentContainer minWidth="300px" alignItems="flex-start">
      <Text small>Set Max Slippage:</Text>
      <MaxSlippageSelector token={token} />
      <RowBetween>
        <Text small italic>
          Remove Position Token:
        </Text>
        <SummitButton onClick={handleRemove} variant="danger" activeText="-" padding="0" width="28px" />
      </RowBetween>
      <RowCenter>
        <SummitButton onClick={onDismiss} activeText="Close" />
      </RowCenter>
    </ModalContentContainer>
  )
}

export const OutTokenButton: React.FC<{ token: string; changed?: boolean }> = ({ token, changed }) => {
  const [open, show, hide] = useShowHideModal()
  return (
    <SummitPopUp
      open={open}
      callOnDismiss={hide}
      modal
      button={<TokenButton token={token} noTokenString="Missing" changed={changed} onClick={show} />}
      popUpTitle="Manage Token"
      popUpContent={<OutTokenOptionsModal token={token} />}
    />
  )
}
