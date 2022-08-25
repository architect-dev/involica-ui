/* eslint-disable no-param-reassign */
import { CHAIN_ID } from 'utils'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import fetchPublicData from './fetchPublicData'
import fetchUserData from './fetchUserData'
import { State, MaxGasPriceOptions, PositionOut } from './types'

const weights = {
  0: [100],
  1: [100],
  2: [56, 44],
  3: [42, 33, 25],
  4: [36, 28, 21, 15],
  5: [33, 25, 19, 13, 10],
  6: [31, 24, 18, 12, 9, 6],
  7: [30, 23, 17, 11, 8, 6, 5],
  8: [30, 22, 16, 12, 8, 5, 4, 3],
}

const sToF = (s: string): number => {
  return s == null || s === '' || isNaN(parseFloat(s)) ? 0 : parseFloat(s)
}
const wdhToSec = (w: string, d: string, h: string): number => {
  return Math.round((sToF(w) * 7 + sToF(d)) * 24 + sToF(h)) * 3600
}

export const useInvolicaStore = create<State>()(
  persist(
    immer((set, get) => ({
      account: null,
      isDark: false,
      connectModalOpen: false,
      setActiveAccount: (account: string) => set({ account }),
      clearActiveAccount: () => set({ account: null }),
      setIsDark: (isDark) => set({ isDark }),
      setConnectModalOpen: (connectModalOpen) => set({ connectModalOpen }),

      userData: null,
      userDataLoaded: false,
      fetchUserData: async (account) => {
        const userData = await fetchUserData(account)
        if (userData == null) return
        set({ userData, userDataLoaded: true })
      },

      tokens: null,
      nativeToken: null,
      publicDataLoaded: false,
      fetchPublicData: async () => {
        const publicData = await fetchPublicData()
        if (publicData == null) return
        set({ ...publicData, publicDataLoaded: true })
      },

      // Position Config,
      config: {
        tokenIn: null,
        outs: [],
        amountDCA: null,
        amountDCAInvalidReason: 'DCA Amount required',
        intervalDCA: null,
        maxGasPrice: '100',
        executeImmediately: true,
        startIntro: false,
        fundingAmount: '',
        fundingInvalidReason: 'Funding required',
        getStarted: () =>
          set((state) => {
            state.config.startIntro = true
          }),
        setTokenIn: (tokenIn: string) =>
          set((state) => {
            state.config.tokenIn = tokenIn
          }),
        setOutsFromPreset: (outs: PositionOut[]) =>
          set((state) => {
            state.config.outs = outs
          }),
        addOut: (token: string) => {
          const w = weights[get().config.outs.length + 1]
          set((state) => {
            state.config.outs = get()
              .config.outs.concat({
                token,
                weight: 0,
                maxSlippage: 1,
              })
              .map((out, i) => ({ ...out, weight: w[i] }))
          })
        },
        removeOut: (index: number) => {
          const w = weights[get().config.outs.length - 1]
          set((state) => {
            state.config.outs = get()
              .config.outs.filter((_, i) => index !== i)
              .map((out, i) => ({ ...out, weight: w[i] }))
          })
        },
        updateWeights: (w: number[]) =>
          set((state) => {
            state.config.outs = get().config.outs.map((out, i) => ({
              ...out,
              weight: w[i],
            }))
          }),
        updateOutMaxSlippage: (token: string, maxSlippage: number) =>
          set((state) => {
            state.config.outs = get().config.outs.map((out) =>
              out.token === token ? { ...out, maxSlippage } : out,
            )
          }),
        setAmountDCA: (amountDCA: string, fullBalance: string | null) => {
          let amountDCAInvalidReason = null
          if (amountDCA === '') amountDCAInvalidReason = 'Funding required'
          else if (isNaN(parseFloat(amountDCA)))
            amountDCAInvalidReason = 'Not a number'
          else if (parseFloat(amountDCA) === 0)
            amountDCAInvalidReason = 'Must be greater than 0'
          else if (
            parseFloat(amountDCA ?? '0') > parseFloat(fullBalance ?? '0')
          )
            amountDCAInvalidReason =
              'Insufficient wallet balance to cover 1 DCA'
          set((state) => {
            state.config.amountDCA = amountDCA
            state.config.amountDCAInvalidReason = amountDCAInvalidReason
          })
        },
        setFundingAmount: (
          fundingAmount: string,
          fullBalance: string | null,
        ) => {
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

          set((state) => {
            state.config.fundingAmount = fundingAmount
            state.config.fundingInvalidReason = fundingInvalidReason
          })
        },
        setMaxGasPrice: (maxGasPrice: MaxGasPriceOptions) =>
          set((state) => {
            state.config.maxGasPrice = maxGasPrice
          }),

        // TRANSIENT
        dcasCount: '',
        setDcasCount: (dcasCount: string) =>
          set((state) => {
            state.config.dcasCount = dcasCount
          }),
        weeks: '',
        setWeeks: (weeks: string) => {
          set((state) => {
            state.config.weeks = weeks
            state.config.intervalDCA = wdhToSec(
              weeks,
              get().config.days,
              get().config.hours,
            )
          })
        },
        days: '',
        setDays: (days: string) => {
          set((state) => {
            state.config.days = days
            state.config.intervalDCA = wdhToSec(
              get().config.weeks,
              days,
              get().config.hours,
            )
          })
        },
        hours: '',
        setHours: (hours: string) => {
          set((state) => {
            state.config.hours = hours
            state.config.intervalDCA = wdhToSec(
              get().config.weeks,
              get().config.days,
              hours,
            )
          })
        },
      },
    })),
    {
      name: `involica_${CHAIN_ID}`,
    },
  ),
)
