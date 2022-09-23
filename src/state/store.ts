/* eslint-disable no-param-reassign */
import { CHAIN_ID } from 'utils'
import create from 'zustand'
import { ethers } from 'ethers'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import fetchPublicData from './fetchPublicData'
import fetchUserData from './fetchUserData'
import { State, MaxGasPriceOptions, PositionOut, PositionConfig, PositionConfigSupplements } from './types'

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

const emptyConfig: PositionConfig & PositionConfigSupplements = {
  tokenIn: null,
  outs: [],
  amountDCA: '',
  amountDCAInvalidReason: 'DCA Amount required',
  intervalDCA: null,
  maxGasPrice: '100',
  executeImmediately: true,
  startIntro: false,
  fundingAmount: '',
  fundingInvalidReason: 'Funding required',

  dcasCount: '',
  dcasCountInvalidReason: null,
  weeks: '',
  weeksInvalidReason: null,
  days: '',
  daysInvalidReason: null,
  hours: '',
  hoursInvalidReason: null,
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
      config: emptyConfig,

      // Config Mutators
      getStarted: () => {
        set((state) => {
          state.config.startIntro = true
        })
      },
      setTokenIn: (tokenIn: string) =>
        set((state) => {
          state.config.tokenIn = tokenIn
        }),
      setOuts: (outs: PositionOut[]) =>
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
      removeOut: (token: string) => {
        const w = weights[get().config.outs.length - 1]
        set((state) => {
          state.config.outs = get()
            .config.outs.filter((out) => out.token !== token)
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
          state.config.outs = get().config.outs.map((out) => (out.token === token ? { ...out, maxSlippage } : out))
        }),
      setAmountDCA: (amountDCA: string, fullBalance: string | null) => {
        let amountDCAInvalidReason = null
        if (amountDCA === '') amountDCAInvalidReason = 'DCA Amount required'
        else if (isNaN(parseFloat(amountDCA))) amountDCAInvalidReason = 'Not a number'
        else if (parseFloat(amountDCA) <= 0) amountDCAInvalidReason = 'Must be greater than 0'
        else if (parseFloat(amountDCA ?? '0') > parseFloat(fullBalance ?? '0'))
          amountDCAInvalidReason = 'Insufficient wallet balance to cover 1 DCA'
        set((state) => {
          state.config.amountDCA = amountDCA
          state.config.amountDCAInvalidReason = amountDCAInvalidReason
        })
      },
      setFundingAmount: (fundingAmount: string, fullBalance: string | null) => {
        let fundingInvalidReason = null
        if (fundingAmount === '') fundingInvalidReason = 'Funding required'
        else if (isNaN(parseFloat(fundingAmount))) fundingInvalidReason = 'Not a number'
        else if (parseFloat(fundingAmount) <= 0) fundingInvalidReason = 'Must be greater than 0'
        else if (parseFloat(fundingAmount ?? '0') > parseFloat(fullBalance ?? '0'))
          fundingInvalidReason = 'Insufficient balance'

        set((state) => {
          state.config.fundingAmount = fundingAmount
          state.config.fundingInvalidReason = fundingInvalidReason
        })
      },
      setIntervalDCA: (intervalDCA: number) =>
        set((state) => {
          state.config.intervalDCA = intervalDCA
        }),
      setMaxGasPrice: (maxGasPrice: MaxGasPriceOptions) =>
        set((state) => {
          state.config.maxGasPrice = maxGasPrice
        }),

      // TRANSIENT
      setDcasCount: (dcasCount: string) => {
        let dcasCountInvalidReason = null
        if (dcasCount !== 'Inf') {
          if (dcasCount === '') dcasCountInvalidReason = 'DCA Count or Inf required'
          else if (isNaN(parseFloat(dcasCount))) dcasCountInvalidReason = 'Not a number'
          else if (parseFloat(dcasCount) <= 0) dcasCountInvalidReason = 'Must be greater than 0'
        }

        set((state) => {
          state.config.dcasCount = dcasCount
          state.config.dcasCountInvalidReason = dcasCountInvalidReason
        })
      },
      setWeeks: (weeks: string) => {
        let invReason = null
        if (weeks === '') invReason = null
        else if (isNaN(parseFloat(weeks))) invReason = 'Not a number'
        else if (parseFloat(weeks) < 0) invReason = 'Must be >= 0'

        set((state) => {
          state.config.weeks = weeks
          state.config.intervalDCA = wdhToSec(weeks, get().config.days, get().config.hours)
          state.config.weeksInvalidReason = invReason
        })
      },
      setDays: (days: string) => {
        let invReason = null
        if (days === '') invReason = null
        else if (isNaN(parseFloat(days))) invReason = 'Not a number'
        else if (parseFloat(days) < 0) invReason = 'Must be >= 0'

        set((state) => {
          state.config.days = days
          state.config.intervalDCA = wdhToSec(get().config.weeks, days, get().config.hours)
          state.config.daysInvalidReason = invReason
        })
      },
      setHours: (hours: string) => {
        let invReason = null
        if (hours === '') invReason = null
        else if (isNaN(parseFloat(hours))) invReason = 'Not a number'
        else if (parseFloat(hours) < 0) invReason = 'Must be >= 0'

        set((state) => {
          state.config.hours = hours
          state.config.intervalDCA = wdhToSec(get().config.weeks, get().config.days, hours)
          state.config.hoursInvalidReason = invReason
        })
      },

      // DEBUG
      hydrateConfig: () => {
        const position = get().userData?.position
        if (position == null) {
          console.error('No position to hydrate')
          return
        }
        if (position.user === ethers.constants.AddressZero) {
          set({ config: emptyConfig })
          return
        }
        const empty0String = (s: string | null) => (s === '0' ? '' : s)
        set({
          config: {
            tokenIn: position.tokenIn,
            outs: position.outs,
            amountDCA: empty0String(position.amountDCA),
            intervalDCA: position.intervalDCA,
            maxGasPrice: position.maxGasPrice,
            executeImmediately: position.executeImmediately,

            amountDCAInvalidReason: null,
            startIntro: true,
            fundingAmount: '1',
            fundingInvalidReason: null,
            dcasCount: '1',
            dcasCountInvalidReason: null,
            weeks: empty0String(Math.floor(position.intervalDCA / (3600 * 24 * 7)).toString()),
            weeksInvalidReason: null,
            days: empty0String(Math.floor((position.intervalDCA % (3600 * 24 * 7)) / (3600 * 24)).toString()),
            daysInvalidReason: null,
            hours: empty0String(Math.floor((position.intervalDCA % (3600 * 24)) / 3600).toString()),
            hoursInvalidReason: null,
          },
        })
      },
      resetConfig: () => {
        set({
          config: emptyConfig,
        })
      },
    })),
    {
      name: `involica_${CHAIN_ID}`,
    },
  ),
)
