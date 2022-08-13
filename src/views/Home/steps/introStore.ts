import { PositionOut } from 'state/types'
import { useInvolicaStore } from 'state/zustand'
import { bn, CHAIN_ID } from 'utils'
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface PositionConfig {
  tokenIn?: string
  outs: PositionOut[]
  amountDCA?: string
  intervalDCA?: number
  maxGasPrice?: number
}
interface PositionConfigMutators {
  setTokenIn: (tokenIn: string) => void
  addOut: (token: string, weight: number, maxSlippage: number) => void
  removeOut: (token: string) => void
  updateOutWeight: (token: string, weight: number) => void
  updateOutMaxSlippage: (token: string, maxSlippage: number) => void
  setIntervalDCA: (intervalDCA: number) => void
  setAmountDCA: (amountDCA: string) => void
}

export const usePositionConfigState = create<PositionConfig & PositionConfigMutators>()(
  // persist(
    (set, get) => ({
      tokenIn: null,
      outs: [],
      amountDCA: null,
      intervalDCA: null,
      maxGasPrice: null,
      setTokenIn: (tokenIn: string) => set({ tokenIn }),
      addOut: (token: string, weight: number, maxSlippage: number) =>
        set({ outs: get().outs.concat({ token, weight, maxSlippage }) }),
      removeOut: (token: string) =>
        set({
          outs: get().outs.filter(({ token: outToken }) => token !== outToken),
        }),
      updateOutWeight: (token: string, weight: number) =>
        set({
          outs: get().outs.map((out) =>
            out.token === token ? { ...out, weight } : out,
          ),
        }),
      updateOutMaxSlippage: (token: string, maxSlippage: number) =>
        set({
          outs: get().outs.map((out) =>
            out.token === token ? { ...out, maxSlippage } : out,
          ),
        }),
      setIntervalDCA: (intervalDCA: number) => set({ intervalDCA }),
      setAmountDCA: (amountDCA: string) => set({ amountDCA }),
    }),
  //   {
  //     name: `involica_positionConfig_${CHAIN_ID}`,
  //   },
  // ),
)

export enum IntroStep {
  TokenIn,
  IntervalAndAmount,
  Outs,
  Treasury,
  Approve,
  Finalize
}

export const usePositionConfig = (): PositionConfig => usePositionConfigState(state => ({
  tokenIn: state.tokenIn,
  outs: state.outs,
  amountDCA: state.amountDCA,
  intervalDCA: state.intervalDCA,
  maxGasPrice: state.maxGasPrice,
}))

export const useIntroActiveStep = () => {
  const {
    tokenIn,
    outs,
    amountDCA,
    intervalDCA,
  } = usePositionConfig()
  const userTreasury = useInvolicaStore((state) => state.userData?.userTreasury)
  const tokenInApprovedAmount = useInvolicaStore((state) => state.userData?.userTokensData?.[tokenIn]?.balance)

  if (tokenIn == null) return IntroStep.TokenIn

  if (intervalDCA == null || amountDCA == null) return IntroStep.IntervalAndAmount 
  if (intervalDCA <= 30 * 60) return IntroStep.IntervalAndAmount
  if (amountDCA === '0') return IntroStep.IntervalAndAmount

  if (outs.length === 0) return IntroStep.Outs

  if (userTreasury == null) return IntroStep.Treasury
  if (bn(userTreasury).toNumber() === 0) return IntroStep.Treasury

  if (tokenInApprovedAmount == null) return IntroStep.Approve
  if (bn(tokenInApprovedAmount).toNumber() === 0) return IntroStep.Approve

  return IntroStep.Finalize
}
