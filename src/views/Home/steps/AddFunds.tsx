import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { StepContentWrapper } from './styles'
import { SummitButton, Text } from 'uikit'
import TokenInput from 'components/TokenInput'
import { getNativeTokenSymbol, nativeAdd } from 'config/constants'
import { isNumber } from 'lodash'
import { useInvolicaStore } from 'state/zustand'
import { BigNumberish, bn, getFullDisplayBalance } from 'utils'
import { useDepositTreasury } from 'hooks/useExecute'

const useLoadingBnState = (
  bigNum: BigNumberish,
  decimals: number | null,
  transformer: (...args: any[]) => string,
): string | null => {
  const [val, setVal] = useState<string | null>(
    bigNum != null && decimals != null ? transformer(bn(bigNum), decimals) : null,
  )
  useEffect(
    () => {
      if (bigNum == null || decimals == null) return
      setVal(transformer(bn(bigNum), decimals))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bigNum, decimals],
  )
  return val
}

export const AddFundsStep: React.FC<{ expanded: boolean }> = ({ expanded }) => {
  const userDataLoaded = useInvolicaStore((state) => state.userDataLoaded)
  const userTreasury = useInvolicaStore((state) => state.userData?.userTreasury)
  const userNativeToken = useInvolicaStore((state) => state.userData?.userTokensData?.[nativeAdd])
  const nativeToken = useInvolicaStore((state) => state.tokens?.[nativeAdd])
  const { onDepositTreasury, pending } = useDepositTreasury()

  const [val, setVal] = useState<string>('10')
  const treasury = useLoadingBnState(userTreasury, nativeToken?.decimals, getFullDisplayBalance)
  const fullBalance = useLoadingBnState(userNativeToken?.balance, nativeToken?.decimals, getFullDisplayBalance)

  const treasuryUsd = useMemo(
    () => {
      if (treasury == null || nativeToken?.price == null) return null
      console.log({
        treasury,
        price: nativeToken?.price,
        decimals: nativeToken?.decimals,
      })
      return bn(treasury).times(nativeToken.price).toFixed(2)
    },
    [nativeToken?.decimals, nativeToken?.price, treasury]
  )

  const validVal = useMemo(
    () => isNumber(parseFloat(val)) && parseFloat(val) > 0 && parseFloat(val) <= parseFloat(fullBalance),
    [fullBalance, val],
  )

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [setVal, fullBalance])

  const handleDepositTreasury = useCallback(
    () => onDepositTreasury(val, nativeToken?.decimals),
    [nativeToken?.decimals, onDepositTreasury, val]
  )

  const collapsedContent = useMemo(
    () => (
      <Text>
        Funds: <b>{treasury} FTM (${treasuryUsd})</b>
      </Text>
    ),
    [treasury, treasuryUsd],
  )

  const expandedContent = useMemo(() => {
    return (
      <>
        {collapsedContent}
        <Text italic small>
          Deposit <b>{getNativeTokenSymbol()}</b> to cover the cost of your DCA transactions.
          <br />
          You can remove these funds at any point.
          <br />
          (20 FTM should be more than enough)
        </Text>
        <TokenInput
          symbol={getNativeTokenSymbol()}
          balanceText="WALLET"
          onChange={handleChange}
          onSelectMax={handleSelectMax}
          value={val}
          max={fullBalance}
          invalid={!validVal && val !== ''}
        />
        <SummitButton disabled={!validVal} isLoading={pending} onClick={handleDepositTreasury}>ADD FUNDS</SummitButton>
      </>
    )
  }, [collapsedContent, fullBalance, handleChange, handleDepositTreasury, handleSelectMax, pending, val, validVal])

  return <StepContentWrapper expanded={expanded}>{expanded ? expandedContent : collapsedContent}</StepContentWrapper>
}
