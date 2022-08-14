import { PositionOut } from 'state/types'
import { useInvolicaStore } from 'state/zustand'
import { bn } from 'utils'
import create from 'zustand'

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
  removeOut: (index: number) => void
  updateWeights: (weights: number[]) => void
  updateOutMaxSlippage: (token: string, maxSlippage: number) => void
  setIntervalDCA: (intervalDCA: number) => void
  setAmountDCA: (amountDCA: string) => void
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
  // persist(
  (set, get) => ({
    tokenIn: null,
    outs: [],
    amountDCA: null,
    intervalDCA: null,
    maxGasPrice: null,
    setTokenIn: (tokenIn: string) => set({ tokenIn }),
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
  }))

export const useIntroActiveStep = () => {
  const { tokenIn, outs, amountDCA, intervalDCA } = usePositionConfig()
  const userTreasury = useInvolicaStore((state) => state.userData?.userTreasury)
  const tokenInApprovedAmount = useInvolicaStore(
    (state) => state.userData?.userTokensData?.[tokenIn]?.balance,
  )

  if (tokenIn == null) return IntroStep.TokenIn

  if (intervalDCA == null || amountDCA == null)
    return IntroStep.Interval
  if (intervalDCA <= 30 * 60) return IntroStep.Interval
  if (amountDCA === '0') return IntroStep.Interval

  if (outs.length === 0) return IntroStep.Outs

  if (userTreasury == null) return IntroStep.Treasury
  if (bn(userTreasury).toNumber() === 0) return IntroStep.Treasury

  if (tokenInApprovedAmount == null) return IntroStep.Approve
  if (bn(tokenInApprovedAmount).toNumber() === 0) return IntroStep.Approve

  return IntroStep.Finalize
}
