import { useMemo } from 'react'
import { ethers } from 'ethers'
import { getChainGwei } from 'config/tokens'
import { eN, bn } from 'utils'
import { useConfigSupplements, useConfigurableGetStarted, useTokenPublicData, useTokenUserData } from './hooks'
import { useInvolicaStore } from './store'
import { IntroStep, PositionConfig } from './types'

export const usePositionConfig = (): PositionConfig =>
  useInvolicaStore((state) => ({
    tokenIn: state.config.tokenIn,
    outs: state.config.outs,
    amountDCA: state.config.amountDCA,
    intervalDCA: state.config.intervalDCA,
    maxGasPrice: state.config.maxGasPrice,
    executeImmediately: state.config.executeImmediately,
  }))
export const useSubmissionReadyPositionConfig = (): any[] => {
  const { tokenIn, outs, amountDCA, intervalDCA, maxGasPrice, executeImmediately } = usePositionConfig()
  const { data: tokenInData } = useTokenPublicData(tokenIn)

  return useMemo(
    () => [
      ethers.constants.AddressZero,
      tokenIn,
      outs.map((out) => ({
        token: out.token,
        weight: Math.round(out.weight * 100),
        maxSlippage: Math.round(out.maxSlippage * 100),
      })),
      eN(amountDCA, tokenInData?.decimals),
      intervalDCA,
      getChainGwei(maxGasPrice),
      executeImmediately,
    ],
    [amountDCA, executeImmediately, intervalDCA, maxGasPrice, outs, tokenIn, tokenInData?.decimals],
  )
}

export const useIntroActiveStep = () => {
  const { startIntro } = useConfigurableGetStarted()

  const { tokenIn, outs, amountDCA, intervalDCA } = usePositionConfig()
  const { userData: tokenInUserData } = useTokenUserData(tokenIn)
  const tokenInAllowance = tokenInUserData?.allowance

  const { dcasCount, dcasCountInvalidReason, fundingAmount, fundingInvalidReason } = useConfigSupplements([
    'dcasCount',
    'dcasCountInvalidReason',
    'fundingAmount',
    'fundingInvalidReason',
  ])

    if (!startIntro) return IntroStep.NotStarted

  if (tokenIn == null) return IntroStep.TokenIn

  if (amountDCA == null || amountDCA === '' || amountDCA === '0') return IntroStep.Amount

  if (outs.length === 0) return IntroStep.Outs

  if (intervalDCA == null || intervalDCA <= 30 * 60) return IntroStep.Interval

  if (tokenInAllowance == null) return IntroStep.Approve
  if (dcasCountInvalidReason != null) return IntroStep.Approve
  if (dcasCount === 'Inf') {
    if (bn(tokenInAllowance).lt(bn(ethers.constants.MaxUint256.toString()))) return IntroStep.Approve
  } else if (bn(tokenInAllowance).lt(bn(amountDCA).times(dcasCount))) return IntroStep.Approve

  if (fundingAmount == null || fundingAmount === '' || fundingAmount === '0' || fundingInvalidReason != null)
    return IntroStep.Treasury

  return IntroStep.Finalize
}
