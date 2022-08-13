import React, { useCallback, useMemo, useState } from 'react'
import { AddressRecord } from 'state/types'
import { useInvolicaStore } from 'state/zustand'
import { Row, RowBetween, SummitButton, TokenSymbolImage, Text } from 'uikit'
import { SummitPopUp } from 'uikit/widgets/Popup'
import { bn, bnDisplay } from 'utils'
import TokenSelectModal from './TokenSelectModal'

export const TokenSelectButton: React.FC<{
  token: string | null
  setToken: (token: string) => void
  disabledTokens?: AddressRecord<string>
}> = ({ token, setToken, disabledTokens }) => {
  const tokenData = useInvolicaStore((state) => state.tokens?.[token])
  const userTokenData = useInvolicaStore((state) => state.userData?.userTokensData?.[token])

  const selectedTokenBalance = useMemo(
    () => bnDisplay(userTokenData?.balance, tokenData?.decimals, 3),
    [userTokenData?.balance, tokenData?.decimals]
  )
  const selectedTokenBalanceUsd = useMemo(
    () => selectedTokenBalance != null && tokenData?.price != null ? bn(selectedTokenBalance).times(tokenData.price).toFixed(2) : null,
    [selectedTokenBalance, tokenData?.price]
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
    <>
      <SummitPopUp
        open={tokenSelectModalOpen}
        callOnDismiss={hideSelectTokenModal}
        modal
        button={
          <SummitButton onClick={showSelectTokenModal} padding={tokenData != null && "0 12px 0 2px"} width="100px">
            {tokenData != null ? (
              <RowBetween>
                <TokenSymbolImage
                  symbol={tokenData.symbol}
                  width={24}
                  height={24}
                />
                {tokenData.symbol}
              </RowBetween>
            ) : (
              'Select'
            )}
          </SummitButton>
        }
        popUpContent={
          <TokenSelectModal setToken={setToken} disabledTokens={disabledTokens} />
        }
      />
      { selectedTokenBalance != null &&
        <Text>
          Balance: <b>{selectedTokenBalance}</b>
          <br/>
          { selectedTokenBalanceUsd != null && <Text small italic>(USD: ${selectedTokenBalanceUsd})</Text>}
        </Text>
      }
    </>
  )
}
