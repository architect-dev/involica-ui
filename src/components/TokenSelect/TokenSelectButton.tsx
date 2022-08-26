import { TokenButton } from 'components/TokenButton'
import React, { useCallback, useMemo, useState } from 'react'
import { AddressRecord } from 'state/types'
import { useInvolicaStore } from 'state/store'
import { Column, Text } from 'uikit'
import { SummitPopUp } from 'uikit/widgets/Popup'
import { bn, bnDisplay } from 'utils'
import TokenSelectModal, { ModalVariant } from './TokenSelectModal'

export const TokenSelectButton: React.FC<{
  token: string | null
  noTokenString: string
  setToken: (token: string) => void
  selectedTokens?: string[]
  disabledTokens?: AddressRecord<string>
  modalVariant: ModalVariant
}> = ({ token, setToken, noTokenString, selectedTokens, disabledTokens, modalVariant }) => {
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

  const [tokenSelectModalOpen, setTokenSelectModalOpen] = useState(false)
  const showSelectTokenModal = useCallback(
    () => setTokenSelectModalOpen(true),
    [setTokenSelectModalOpen],
  )
  const hideSelectTokenModal = useCallback(
    () => setTokenSelectModalOpen(false),
    [setTokenSelectModalOpen],
  )

  return (
    <Column gap='18px'>
      <SummitPopUp
        open={tokenSelectModalOpen}
        callOnDismiss={hideSelectTokenModal}
        modal
        button={
          <TokenButton
            token={token}
            onClick={showSelectTokenModal}
            noTokenString={noTokenString}
          />
        }
        popUpContent={
          <TokenSelectModal
            setToken={setToken}
            selectedTokens={selectedTokens ?? [token]}
            disabledTokens={disabledTokens}
            variant={modalVariant}
          />
        }
      />
      {selectedTokenBalance != null && (
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
