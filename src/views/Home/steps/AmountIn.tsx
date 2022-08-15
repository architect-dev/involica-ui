import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { StepContentWrapper } from './StepContentWrapper'
import { Text } from 'uikit'
import TokenInput from 'components/TokenInput'
import { isNumber } from 'lodash'
import { useInvolicaStore } from 'state/zustand'
import { bnDisplay, eN } from 'utils'
import { IntroStep, useIntroActiveStep, usePositionConfigState } from './introStore'

export const AmountIn: React.FC = () => {
  const introStep = useIntroActiveStep()
  const expanded = introStep >= IntroStep.Amount
  const tokenInAdd = usePositionConfigState((state) => state.tokenIn)
  const tokenIn = useInvolicaStore((state) => state.tokens?.[tokenInAdd])
  const tokenInUserData = useInvolicaStore((state) => state.userData?.userTokensData?.[tokenInAdd])
  const setAmountDCA = usePositionConfigState((state) => state.setAmountDCA)

  const [val, setVal] = useState<string>('')
  const fullBalance = useMemo(
    () => bnDisplay(tokenInUserData?.balance, tokenIn?.decimals),
    [tokenIn?.decimals, tokenInUserData?.balance],
  )

  const validVal = useMemo(
    () =>
      isNumber(parseFloat(val)) &&
      parseFloat(val) > 0 &&
      parseFloat(val) <= parseFloat(fullBalance),
    [fullBalance, val],
  )

  useEffect(
    () => {
      console.log({validVal, val})
      if (!validVal) {
        setAmountDCA(null)
        return
      }
      setAmountDCA(eN(val, tokenIn?.decimals))
    },
    [setAmountDCA, tokenIn?.decimals, val, validVal]
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

  return (
    <StepContentWrapper expanded={expanded}>
      <Text small italic>
        Set the amount of <b>{tokenIn?.symbol}</b> each DCA will pull.
      </Text>
      <TokenInput
        symbol={tokenIn?.symbol}
        balanceText="Wallet Balance"
        onChange={handleChange}
        onSelectMax={handleSelectMax}
        value={val}
        max={fullBalance}
        invalid={!validVal && val !== ''}
      />
    </StepContentWrapper>
  )
}
