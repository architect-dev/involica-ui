import React, { useCallback } from 'react'
import { TokenButton } from 'components/TokenButton'
import { ModalContentContainer, RowBetween, RowCenter, SummitButton, SummitPopUp, Text } from 'uikit'
import { useConfigurableOuts } from 'state/hooks'
import { useShowHideModal } from 'utils'
import { MaxSlippageSelector } from './MaxSlippageSelector'
import TokenIconAndSymbol from 'components/TokenIconAndSymbol'
import styled from 'styled-components'

export const ManageOutTokenModal: React.FC<{
  token: string
  onDismiss?: () => void
}> = ({ token, onDismiss }) => {
  const { removeOut } = useConfigurableOuts()
  const handleRemove = useCallback(() => {
    removeOut(token)
    onDismiss()
  }, [removeOut, token, onDismiss])
  return (
    <ModalContentContainer minWidth="300px" alignItems="flex-start" gap='12px'>
      <Text small>Set Max Slippage:</Text>
      <MaxSlippageSelector token={token} />
      <br/>
      <RowBetween>
        <Text small italic>
          Remove Token from Position:
        </Text>
        <SummitButton onClick={handleRemove} variant="danger" activeText="-" padding="0" width="28px" />
      </RowBetween>
      <br/>
      <RowCenter>
        <SummitButton onClick={onDismiss} activeText="Close" />
      </RowCenter>
    </ModalContentContainer>
  )
}

const FlexText = styled(Text)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: bold;
`

export const ManageOutTokenButton: React.FC<{ token: string; changed?: boolean }> = ({ token, changed }) => {
  const [open, show, hide] = useShowHideModal()
  return (
    <SummitPopUp
      open={open}
      callOnDismiss={hide}
      modal
      button={<TokenButton token={token} noTokenString="Missing" changed={changed} onClick={show} />}
      popUpTitle={
        <FlexText>
          Manage
          <TokenIconAndSymbol token={token} />
        </FlexText>
      }
      popUpContent={<ManageOutTokenModal token={token} />}
    />
  )
}