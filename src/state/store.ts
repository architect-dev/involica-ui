/* eslint-disable no-param-reassign */
import { CHAIN_ID, Nullable } from '@utils'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import fetchPublicData from './fetchPublicData'
import fetchUserData from './fetchUserData'
import { State, MaxGasPriceOptions, PositionOut, Token } from './types'
import {
	emptyConfig,
	getHydratedConfigFromPosition,
	getWeights,
	validateAmountDCA,
	validateDcasCount,
	validateFundingAmount,
	validateIntervalComponent,
	wdhToSec,
} from './utils'

export const useInvolicaStore = create<State>()(
	persist(
		immer((set, get) => ({
			account: null,
			isDark: false,
			connectModalOpen: false,
			setActiveAccount: (account: string) => set({ account }),
			clearActiveAccount: () => set({ account: null, config: emptyConfig }),
			setIsDark: (isDark) => set({ isDark }),
			setConnectModalOpen: (connectModalOpen) => set({ connectModalOpen }),

			userData: null,
			userDataLoaded: false,
			fetchUserData: async (account, hydrateConfig) => {
				const userData = await fetchUserData(account)
				if (userData == null) return
				set({ userData, userDataLoaded: true })
				if (hydrateConfig) {
					const hydratedConfig = getHydratedConfigFromPosition(userData.position)
					if (hydratedConfig != null) set({ config: hydratedConfig })
				}
			},

			tokens: {},
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
				const w = getWeights(get().config.outs.length + 1)
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
				const w = getWeights(get().config.outs.length - 1)
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
			setAmountDCA: (amountDCA: string, fullBalance: Nullable<string>, token: Token) =>
				set((state) => {
					state.config.amountDCA = amountDCA
					state.config.amountDCAInvalidReason = validateAmountDCA(amountDCA, fullBalance, token)
				}),
			setFundingAmount: (fundingAmount: string, fullBalance: Nullable<string>) =>
				set((state) => {
					state.config.fundingAmount = fundingAmount
					state.config.fundingInvalidReason = validateFundingAmount(fundingAmount, fullBalance, get().nativeToken)
				}),
			setIntervalDCA: (intervalDCA: number) =>
				set((state) => {
					state.config.intervalDCA = intervalDCA
				}),
			setMaxGasPrice: (maxGasPrice: MaxGasPriceOptions) =>
				set((state) => {
					state.config.maxGasPrice = maxGasPrice
				}),

			// TRANSIENT
			setDcasCount: (dcasCount: string) =>
				set((state) => {
					state.config.dcasCount = dcasCount
					state.config.dcasCountInvalidReason = validateDcasCount(dcasCount)
				}),
			setWeeks: (weeks: string) => {
				set((state) => {
					state.config.weeks = weeks
					state.config.intervalDCA = wdhToSec(weeks, get().config.days, get().config.hours)
					state.config.weeksInvalidReason = validateIntervalComponent(weeks)
				})
			},
			setDays: (days: string) =>
				set((state) => {
					state.config.days = days
					state.config.intervalDCA = wdhToSec(get().config.weeks, days, get().config.hours)
					state.config.daysInvalidReason = validateIntervalComponent(days)
				}),
			setHours: (hours: string) =>
				set((state) => {
					state.config.hours = hours
					state.config.intervalDCA = wdhToSec(get().config.weeks, get().config.days, hours)
					state.config.hoursInvalidReason = validateIntervalComponent(hours)
				}),

			// DEBUG
			hydrateConfig: () => {
				const hydratedConfig = getHydratedConfigFromPosition(get().userData?.position)
				if (hydratedConfig == null) return
				set({ config: hydratedConfig })
			},
			resetConfig: () => {
				set({ config: emptyConfig })
			},
		})),
		{
			name: `involica_${CHAIN_ID}`,
		}
	)
)
