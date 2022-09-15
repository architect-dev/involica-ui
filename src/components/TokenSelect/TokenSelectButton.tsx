import { TokenButton } from 'components/TokenButton'
import React, { useMemo } from 'react'
import { AddressRecord } from 'state/types'
import { useInvolicaStore } from 'state/store'
import { Column, Text, SummitPopUp } from 'uikit'
import { bn, bnDisplay, useShowHideModal } from 'utils'
import TokenSelectModal, { ModalVariant } from './TokenSelectModal'

export const TokenSelectButton: React.FC<{
  token: string | null
  noTokenString: string
  setToken?: (token: string) => void
  selectedTokens?: string[]
  disabledTokens?: AddressRecord<string>
  modalVariant: ModalVariant
  intro?: boolean
  className?: string
  changed?: boolean
}> = ({ token, setToken, noTokenString, selectedTokens, disabledTokens, modalVariant, intro, className, changed }) => {
  const tokenData = useInvolicaStore((state) => state.tokens?.[token])
  const userTokenData = useInvolicaStore(
    (state) => state.userData?.userTokensData?.[token],
  )

  const selectedTokenBalance = useMemo(
    () => bnDisplay(userTokenData?.balance, tokenData?.decimals, 3),
    [userTokenData?.balance, tokenData?.decimals],
  )
  const selectedTokenBalanceUsd = useMemo(
    () =>
      selectedTokenBalance != null && tokenData?.price != null
        ? bn(selectedTokenBalance).times(tokenData.price).toFixed(2)
        : null,
    [selectedTokenBalance, tokenData?.price],
  )

  const [open, show, hide] = useShowHideModal()

  return (
    <Column gap='18px' className={className}>
      <SummitPopUp
        open={open}
        callOnDismiss={hide}
        modal
        button={
          <TokenButton
            token={token}
            onClick={show}
            noTokenString={noTokenString}
            changed={changed}
          />
        }
        popUpTitle='Select Token:'
        popUpContent={
          <TokenSelectModal
            setToken={setToken}
            selectedTokens={selectedTokens ?? [token]}
            disabledTokens={disabledTokens}
            variant={modalVariant}
          />
        }
      />
      {intro && selectedTokenBalance != null && (
        <Text>
          Balance: <b>{selectedTokenBalance}</b>
          <br />
          {selectedTokenBalanceUsd != null && (
            <Text small italic>
              (USD: ${selectedTokenBalanceUsd})
            </Text>
          )}
        </Text>
      )}
    </Column>
  )
}
