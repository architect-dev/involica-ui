import { PositionOut } from 'state/types'
import { useInvolicaStore } from 'state/zustand'
import { bn, CHAIN_ID } from 'utils'
import { ethers } from 'ethers'
import create from 'zustand'
import { persist } from 'zustand/middleware'

type MaxGasPriceOptions = '5' | '15' | '50'
interface PositionConfig {
  tokenIn?: string
  outs: PositionOut[]
  amountDCA?: string
  intervalDCA?: number
  maxGasPrice?: MaxGasPriceOptions
  executeImmediately?: boolean
}
interface PositionConfigMutators {
  startIntro: boolean
  amountDCAInvalidReason: string | null
  fundingAmount: string | null
  fundingInvalidReason: string | null
  getStarted: () => void
  setTokenIn: (tokenIn: string) => void
  setOutsFromPreset: (outs: PositionOut[]) => void
  addOut: (token: string, weight: number, maxSlippage: number) => void
  removeOut: (index: number) => void
  updateWeights: (weights: number[]) => void
  updateOutMaxSlippage: (token: string, maxSlippage: number) => void
  setAmountDCA: (amountDCA: string, fullBalance: string | null) => void
  setFundingAmount: (fundingAmount: string, fullBalance: string | null) => void
  setMaxGasPrice: (maxGasPrice: MaxGasPriceOptions) => void

  // Transient
  dcasCount: string
  setDcasCount: (string) => void

  weeks: string
  setWeeks: (string) => void
  days: string
  setDays: (string) => void
  hours: string
  setHours: (string) => void
}

const weights = (n: number) => {
  const weight = 100 / n
  return [...new Array(n)].map(
    (_, i) => Math.round(weight * i) - Math.round(weight * (i - 1)),
  )
}

export const usePositionConfigState = create<
  PositionConfig & PositionConfigMutators
>()(
  persist(
    (set, get) => ({
      tokenIn: null,
      outs: [],
      amountDCA: null,
      amountDCAInvalidReason: 'DCA Amount required',
      intervalDCA: null,
      maxGasPrice: '50',
      executeImmediately: true,
      startIntro: false,
      fundingAmount: '',
      fundingInvalidReason: 'Funding required',
      getStarted: () => set({ startIntro: true }),
      setTokenIn: (tokenIn: string) => set({ tokenIn }),
      setOutsFromPreset: (outs: PositionOut[]) => set({ outs }),
      addOut: (token: string) => {
        const w = weights(get().outs.length + 1)
        set({
          outs: get()
            .outs.concat({
              token,
              weight: 0,
              maxSlippage: 10,
            })
            .map((out, i) => ({ ...out, weight: w[i] })),
        })
      },
      removeOut: (index: number) => {
        const w = weights(get().outs.length - 1)
        set({
          outs: get()
            .outs.filter((_, i) => index !== i)
            .map((out, i) => ({ ...out, weight: w[i] })),
        })
      },
      updateWeights: (w: number[]) =>
        set({
          outs: get().outs.map((out, i) => ({ ...out, weight: w[i] })),
        }),
      updateOutMaxSlippage: (token: string, maxSlippage: number) =>
        set({
          outs: get().outs.map((out) =>
            out.token === token ? { ...out, maxSlippage } : out,
          ),
        }),
      setAmountDCA: (amountDCA: string, fullBalance: string | null) => {
        let amountDCAInvalidReason = null
        if (amountDCA === '') amountDCAInvalidReason = 'Funding required'
        else if (isNaN(parseFloat(amountDCA)))
          amountDCAInvalidReason = 'Not a number'
        else if (parseFloat(amountDCA) === 0)
          amountDCAInvalidReason = 'Must be greater than 0'
        else if (parseFloat(amountDCA ?? '0') > parseFloat(fullBalance ?? '0'))
          amountDCAInvalidReason = 'Insufficient balance to cover 1 DCA'
        set({ amountDCA, amountDCAInvalidReason })
      },
      setFundingAmount: (fundingAmount: string, fullBalance: string | null) => {
        let fundingInvalidReason = null
        if (fundingAmount === '') fundingInvalidReason = 'Funding required'
        else if (isNaN(parseFloat(fundingAmount)))
          fundingInvalidReason = 'Not a number'
        else if (parseFloat(fundingAmount) === 0)
          fundingInvalidReason = 'Must be greater than 0'
        else if (
          parseFloat(fundingAmount ?? '0') > parseFloat(fullBalance ?? '0')
        )
          fundingInvalidReason = 'Insufficient balance'

        set({ fundingAmount, fundingInvalidReason })
      },
      setMaxGasPrice: (maxGasPrice: MaxGasPriceOptions) => set({ maxGasPrice }),

      // TRANSIENT
      dcasCount: '',
      setDcasCount: (dcasCount: string) => set({ dcasCount }),
      weeks: '',
      setWeeks: (weeks: string) => {
        set({ weeks, intervalDCA: wdhToSec(weeks, get().days, get().hours) })
      },
      days: '',
      setDays: (days: string) => {
        set({ days, intervalDCA: wdhToSec(get().weeks, days, get().hours) })
      },
      hours: '',
      setHours: (hours: string) => {
        set({ hours, intervalDCA: wdhToSec(get().weeks, get().days, hours) })
      },
    }),
    {
      name: `involica_positionConfig_${CHAIN_ID}`,
    },
  ),
)

export enum IntroStep {
  NotStarted,
  TokenIn,
  Outs,
  Interval,
  Amount,
  Approve,
  Treasury,
  Finalize,
}

export const usePositionConfig = (): PositionConfig =>
  usePositionConfigState((state) => ({
    tokenIn: state.tokenIn,
    outs: state.outs,
    amountDCA: state.amountDCA,
    intervalDCA: state.intervalDCA,
    maxGasPrice: state.maxGasPrice,
    executeImmediately: state.executeImmediately,
  }))

export const useIntroActiveStep = () => {
  // return IntroStep.Amount

  const startIntro = usePositionConfigState((state) => state.startIntro)
  const { tokenIn, outs, amountDCA, intervalDCA } = usePositionConfig()
  const tokenInAllowance = useInvolicaStore(
    (state) => state.userData?.userTokensData?.[tokenIn]?.allowance,
  )
  const fundingInvalidReason = usePositionConfigState(
    (state) => state.fundingInvalidReason,
  )
  const dcasCount = usePositionConfigState((state) => state.dcasCount)

  if (!startIntro) return IntroStep.NotStarted

  if (tokenIn == null) return IntroStep.TokenIn

  if (outs.length === 0) return IntroStep.Outs

  if (intervalDCA == null || intervalDCA <= 30 * 60) return IntroStep.Interval

  if (amountDCA == null || amountDCA === '' || amountDCA === '0')
    return IntroStep.Amount

  if (tokenInAllowance == null) return IntroStep.Approve
  if (dcasCount === 'Inf') {
    if (bn(tokenInAllowance).lt(bn(ethers.constants.MaxUint256.toString())))
      return IntroStep.Approve
  } else if (
    dcasCount === '0' ||
    dcasCount === '' ||
    isNaN(parseInt(dcasCount)) ||
    bn(tokenInAllowance).lt(bn(amountDCA).times(dcasCount))
  )
    return IntroStep.Approve

  if (fundingInvalidReason != null) return IntroStep.Treasury

  return IntroStep.Finalize
}

const sToF = (s: string): number => {
  return s == null || s === '' || isNaN(parseFloat(s)) ? 0 : parseFloat(s)
}
const wdhToSec = (w: string, d: string, h: string): number => {
  return Math.round((sToF(w) * 7 + sToF(d)) * 24 + sToF(h)) * 3600
}
