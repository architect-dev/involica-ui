import React, { useCallback, useMemo } from 'react'
import { StepContentWrapper } from './StepContentWrapper'
import { Text } from 'uikit'
import TokenInput from 'components/TokenInput'
import { useInvolicaStore } from 'state/zustand'
import { bnDisplay } from 'utils'
import { IntroStep, useIntroActiveStep, usePositionConfigState } from './introStore'

export const AmountIn: React.FC = () => {
  const introStep = useIntroActiveStep()
  const expanded = introStep >= IntroStep.Amount
  const tokenInAdd = usePositionConfigState((state) => state.tokenIn)
  const tokenIn = useInvolicaStore((state) => state.tokens?.[tokenInAdd])
  const tokenInUserData = useInvolicaStore((state) => state.userData?.userTokensData?.[tokenInAdd])
  const amountDCA = usePositionConfigState((state) => state.amountDCA)
  const amountDCAInvalidReason = usePositionConfigState((state) => state.amountDCAInvalidReason)
  const setAmountDCA = usePositionConfigState((state) => state.setAmountDCA)

  const fullBalance = useMemo(
    () => bnDisplay(tokenInUserData?.balance, tokenIn?.decimals),
    [tokenIn?.decimals, tokenInUserData?.balance],
  )

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setAmountDCA(e.currentTarget.value, fullBalance)
    },
    [setAmountDCA, fullBalance],
  )

  const handleSelectMax = useCallback(() => {
    setAmountDCA(fullBalance, fullBalance)
  }, [setAmountDCA, fullBalance])

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
        value={amountDCA}
        max={fullBalance}
        invalid={amountDCAInvalidReason != null && amountDCA !== ''}
      />
      { amountDCAInvalidReason != null && <Text red italic mt='-12px'>{amountDCAInvalidReason}</Text>}
    </StepContentWrapper>
  )
}
