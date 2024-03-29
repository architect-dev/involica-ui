import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { nativeAdd } from '@config/constants'
import { useInterval } from '@hooks/useInterval'
import useRefresh from '@hooks/useRefresh'
import { pick } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Nullable, bn, bnDecOffset, bnDisplay, eN } from '@utils'
import { timestampToDateTime } from '@utils/timestamp'
import { PositionLimitingFactor, PositionStatus } from './status'
import { useInvolicaStore } from './store'
import { AddressRecord, Position, PositionConfig, PositionConfigMutators, PositionConfigSupplements, Token, UserTokenData } from './types'

// FETCHERS

export const useFetchPublicData = () => {
	const { slowRefresh } = useRefresh()
	const fetchPublicData = useInvolicaStore((state) => state.fetchPublicData)

	useEffect(() => {
		fetchPublicData()
	}, [fetchPublicData, slowRefresh])
}

export const useFetchUserData = () => {
	const { account } = useWeb3React()
	const { slowRefresh } = useRefresh()
	const { setActiveAccount, fetchUserData } = useInvolicaStore((state) => ({
		setActiveAccount: state.setActiveAccount,
		fetchUserData: state.fetchUserData,
	}))

	useEffect(() => {
		if (!account) return
		setActiveAccount(account)
		fetchUserData(account, true)
	}, [account, fetchUserData, setActiveAccount, slowRefresh])
}

// POSITION & CONFIG

export type WithDirty<T extends keyof PositionConfig> = { dirty: boolean; current: Position[T] } & Pick<PositionConfig, T>

export const useConfigSupplements = <S extends Array<keyof PositionConfigSupplements>>(supplements: S): Pick<PositionConfigSupplements, S[0]> => {
	return useInvolicaStore((state) => {
		const supps: Pick<PositionConfigSupplements, S[0]> = {} as any
		supplements.forEach((supp) => {
			// @ts-expect-error Unclear typing
			supps[supp] = state.config[supp]
		})
		return supps
	})
}
export const useDirtyablePositionValue = <K extends keyof PositionConfig>(key: K, positionOnly?: boolean): WithDirty<K> => {
	const positionVal = useInvolicaStore((state) => state.userData?.position?.[key])
	const configVal = useInvolicaStore((state) => state.config[key])
	return useMemo(
		() =>
			({
				[key]: positionOnly ? positionVal : configVal ?? positionVal,
				dirty: JSON.stringify(configVal) !== JSON.stringify(positionVal),
				current: positionVal,
			} as WithDirty<K>),
		[key, positionOnly, positionVal, configVal]
	)
}

export const usePositionSetters = <M extends Array<keyof PositionConfigMutators>>(mutators: M): Pick<PositionConfigMutators, M[0]> => {
	return useInvolicaStore((state) => {
		const setters: Pick<PositionConfigMutators, M[0]> = {} as any
		mutators.forEach((mutator) => {
			// @ts-expect-error Unclear typing
			setters[mutator] = state[mutator]
		})
		return setters
	})
}
export const useConfigurablePositionValue = <K extends keyof PositionConfig, M extends Array<keyof PositionConfigMutators>>(key: K, mutators: M) => ({
	...useDirtyablePositionValue(key),
	...usePositionSetters(mutators),
})

export const usePositionTokenIn = (positionOnly?: boolean) => ({
	...useDirtyablePositionValue('tokenIn', positionOnly),
})
export const useConfigurableTokenIn = () => ({ ...useConfigurablePositionValue('tokenIn', ['setTokenIn']) })

export const usePositionOuts = (positionOnly?: boolean) => ({ ...useDirtyablePositionValue('outs', positionOnly) })
export const useConfigurableOuts = () => ({
	...useConfigurablePositionValue('outs', ['setOuts', 'addOut', 'removeOut', 'updateWeights']),
})

export const usePositionOutConfigurableMaxSlippage = (token: string) => {
	const { updateOutMaxSlippage } = usePositionSetters(['updateOutMaxSlippage'])
	const positionMaxSlippage = useInvolicaStore((state) => state.userData?.position?.outs.find((out) => out.token === token)?.maxSlippage)
	const configMaxSlippage = useInvolicaStore((state) => state.config.outs.find((out) => out.token === token)?.maxSlippage)

	const updateMaxSlippage = useCallback(
		(maxSlippage: string) => {
			updateOutMaxSlippage(token, parseFloat(maxSlippage))
		},
		[token, updateOutMaxSlippage]
	)
	const maxSlippage = useMemo(() => configMaxSlippage ?? positionMaxSlippage, [configMaxSlippage, positionMaxSlippage])
	const dirty = useMemo(() => JSON.stringify(configMaxSlippage) !== JSON.stringify(positionMaxSlippage), [configMaxSlippage, positionMaxSlippage])

	return {
		maxSlippage,
		dirty,
		current: positionMaxSlippage,
		updateMaxSlippage,
	}
}

export const usePositionOutWeightsDirty = () => {
	const positionOuts = useInvolicaStore((state) => state.userData?.position?.outs ?? [])
	const configOuts = useInvolicaStore((state) => state.config?.outs ?? [])

	return useMemo(() => {
		if (positionOuts.length !== configOuts.length) return true
		return positionOuts.some((out, i) => out.token !== configOuts[i].token || out.weight !== configOuts[i].weight)
	}, [positionOuts, configOuts])
}
export const usePositionOutsDirtyData = (intro = false) => {
	const positionOuts = useInvolicaStore((state) => state.userData?.position?.outs ?? [])
	const configOuts = useInvolicaStore((state) => state.config?.outs ?? [])

	return useMemo(() => {
		if (intro) return null

		const longerOuts = positionOuts.length > configOuts.length ? positionOuts : configOuts
		const shorterOuts = positionOuts.length > configOuts.length ? configOuts : positionOuts

		const dirtyData: { token: boolean; weight: boolean; slippage: boolean }[] = []

		longerOuts.forEach((out, i) => {
			if (i >= shorterOuts.length) {
				dirtyData.push({ token: true, weight: true, slippage: true })
				return
			}
			const tokenDirty = out.token !== shorterOuts[i].token
			dirtyData.push({
				token: tokenDirty,
				weight: tokenDirty || out.weight !== shorterOuts[i].weight,
				slippage: tokenDirty || out.maxSlippage !== shorterOuts[i].maxSlippage,
			})
		})

		return dirtyData
	}, [intro, positionOuts, configOuts])
}

export const usePositionAmountDCA = (positionOnly?: boolean) => ({
	...useDirtyablePositionValue('amountDCA', positionOnly),
})
export const useConfigurableAmountDCA = () => ({
	...useConfigurablePositionValue('amountDCA', ['setAmountDCA']),
	...useConfigSupplements(['amountDCAInvalidReason']),
})

export const usePositionIntervalDCA = (positionOnly?: boolean) => ({
	...useDirtyablePositionValue('intervalDCA', positionOnly),
})
export const useConfigurableIntervalDCA = () => ({
	...useConfigurablePositionValue('intervalDCA', ['setWeeks', 'setDays', 'setHours', 'setIntervalDCA']),
	...useConfigSupplements(['weeks', 'weeksInvalidReason', 'days', 'daysInvalidReason', 'hours', 'hoursInvalidReason']),
})

export const usePositionMaxGasPrice = (positionOnly?: boolean) => ({
	...useDirtyablePositionValue('maxGasPrice', positionOnly),
})
export const useConfigurableMaxGasPrice = () => ({ ...useConfigurablePositionValue('maxGasPrice', ['setMaxGasPrice']) })

export const useConfigurableDcasCount = () => ({
	...useConfigSupplements(['dcasCount', 'dcasCountInvalidReason']),
	...usePositionSetters(['setDcasCount']),
})

export const useConfigFundingAmount = () => ({ ...useConfigSupplements(['fundingAmount']) })
export const useConfigurableFundingAmount = () => ({
	...useInvolicaStore((state) => ({
		fundingAmount: state.config.fundingAmount,
		fundingInvalidReason: state.config.fundingInvalidReason,
	})),
	...usePositionSetters(['setFundingAmount']),
})

export const useConfigurableGetStarted = () => ({
	...useInvolicaStore((state) => ({ startIntro: state.config.startIntro })),
	...usePositionSetters(['getStarted']),
})

// TOKENS

export const useTokenPublicData = (token: Nullable<string>): { data: Nullable<Token> } => ({
	data: useInvolicaStore((state) => (token == null ? undefined : state?.tokens?.[token])),
})
export const useTokensPublicData = (tokens: string[]): AddressRecord<Token> => useInvolicaStore((state) => pick(state.tokens, tokens))
export const useTokenUserData = (token: Nullable<string>): { userData: Nullable<UserTokenData> } => ({
	userData: useInvolicaStore((state) => (token == null ? undefined : state?.userData?.userTokensData?.[token])),
})
export const useTokenFullData = (token: Nullable<string>): { data: Nullable<Token>; userData: Nullable<UserTokenData> } => ({
	data: useInvolicaStore((state) => (token == null ? undefined : state?.tokens?.[token])),
	userData: useInvolicaStore((state) => (token == null ? undefined : state?.userData?.userTokensData?.[token])),
})

export const useNativeTokenPublicData = (): { nativeTokenData: Nullable<Token> } => ({
	nativeTokenData: useInvolicaStore((state) => state?.nativeToken),
})
export const useNativeTokenUserData = (): { nativeTokenUserData: Nullable<UserTokenData> } => ({
	nativeTokenUserData: useInvolicaStore((state) => state?.userData?.userNativeTokenData),
})
export const useNativeTokenFullData = (): {
	nativeTokenData: Nullable<Token>
	nativeTokenUserData: Nullable<UserTokenData>
} => ({
	nativeTokenData: useInvolicaStore((state) => state?.nativeToken),
	nativeTokenUserData: useInvolicaStore((state) => state?.userData?.userNativeTokenData),
})

export const useTokenOrNativePublicData = (token: Nullable<string>): { data: Nullable<Token> } => ({
	data: useInvolicaStore((state) => (token == null ? undefined : token === nativeAdd ? state?.nativeToken : state?.tokens?.[token])),
})
export const useTokenOrNativeFullData = (token: Nullable<string>): { data: Nullable<Token>; userData: Nullable<UserTokenData> } => ({
	data: useInvolicaStore((state) => (token == null ? undefined : token === nativeAdd ? state?.nativeToken : state?.tokens?.[token])),
	userData: useInvolicaStore((state) =>
		token == null ? undefined : token === nativeAdd ? state?.userData?.userNativeTokenData : state?.userData?.userTokensData?.[token]
	),
})

export const usePositionTokenInWithData = (positionOnly?: boolean) => {
	const { tokenIn, dirty } = usePositionTokenIn(positionOnly)
	const { data: tokenInData, userData: tokenInUserData } = useTokenFullData(tokenIn)
	return { tokenIn, dirty, tokenInData, tokenInUserData }
}

// USER DATA
export const useUserHasPosition = () => useInvolicaStore((state) => state.userData?.userHasPosition)
export const useUserTreasury = () => useInvolicaStore((state) => state.userData?.userTreasury)
export const useDcasRemaining = () => useInvolicaStore((state) => state.userData?.dcasRemaining)
export const useIsPositionPaused = () => useInvolicaStore((state) => state.userData?.position?.paused)
export const useUserTxs = () => useInvolicaStore((state) => state.userData?.userTxs ?? [])
export const useNextDCATimestamp = () => {
	const lastDCA = useInvolicaStore((state) => state.userData?.position?.lastDCA)
	const intervalDCA = useInvolicaStore((state) => state.userData?.position?.intervalDCA)

	return useMemo(() => {
		if (lastDCA == null || lastDCA === 0 || intervalDCA == null || intervalDCA === 0) return null
		return lastDCA + intervalDCA
	}, [intervalDCA, lastDCA])
}

export const useTimeUntilNextDCA = () => {
	const nextDCA = useNextDCATimestamp()
	const [timeUntilNextDCA, setTimeUntilNextDCA] = useState<Nullable<number>>(null)

	useInterval(
		useCallback(() => {
			if (nextDCA == null) return
			if (nextDCA <= Math.floor(Date.now() / 1000)) setTimeUntilNextDCA(0)
			else setTimeUntilNextDCA(nextDCA - Math.floor(Date.now() / 1000))
		}, [nextDCA]),
		1000
	)

	return timeUntilNextDCA
}

export const useUpcomingDCAs = () => {
	const lastDCA = useInvolicaStore((state) => state.userData?.position?.lastDCA)
	const intervalDCA = useInvolicaStore((state) => state.userData?.position?.intervalDCA)
	const dcasRemaining = useDcasRemaining()

	return useMemo(() => {
		if (lastDCA == null || lastDCA === 0 || intervalDCA == null || intervalDCA === 0 || dcasRemaining == null) return null
		const upcomingDCAs: string[] = []
		;[1, 2, 3, 4, 5, 6].forEach((i) => {
			upcomingDCAs.push(timestampToDateTime(lastDCA + intervalDCA * (i + 1)))
		})
		return upcomingDCAs.slice(0, Math.min(dcasRemaining, 6))
	}, [dcasRemaining, intervalDCA, lastDCA])
}

export const baseGasPrice = 450000
export const perSwapGasPrice = 195000
export const usePositionOutsLength = (positionOnly?: boolean) => {
	const { outs } = usePositionOuts(positionOnly)
	return useMemo(() => outs?.length ?? 0, [outs?.length])
}
export const useDcaTxPriceRange = (positionOnly?: boolean) => {
	const minGasPrice = '100'
	const { maxGasPrice } = usePositionMaxGasPrice(positionOnly)
	const outsLength = usePositionOutsLength(positionOnly)

	const minTxPrice = useMemo(() => {
		return bnDisplay((baseGasPrice + outsLength * perSwapGasPrice) * parseFloat(eN(minGasPrice, 9)), 0)
	}, [minGasPrice, outsLength])

	const maxTxPrice = useMemo(() => {
		if (maxGasPrice == null) return null
		return bnDisplay((baseGasPrice + outsLength * perSwapGasPrice) * parseFloat(eN(maxGasPrice, 9)), 0)
	}, [maxGasPrice, outsLength])

	return {
		minTxPrice,
		maxTxPrice,
		maxGasPrice,
	}
}

export const usePositionStatus = () => {
	const { tokenInData, tokenInUserData } = usePositionTokenInWithData(true)
	const userHasPosition = useUserHasPosition()
	const userTreasury = useUserTreasury()
	const { amountDCA } = usePositionAmountDCA(true)
	const { minTxPrice, maxTxPrice } = useDcaTxPriceRange(true)
	const positionPaused = useIsPositionPaused()
	const positionManualOnly = false

	return useMemo(() => {
		if (!userHasPosition || minTxPrice == null) return PositionStatus.NoPosition

		if (positionManualOnly) return PositionStatus.ActiveManualOnly
		if (positionPaused) return PositionStatus.WarnPaused

		if (userTreasury == null || new BigNumber(userTreasury).lt(minTxPrice)) return PositionStatus.ErrorGasFunds
		if (amountDCA == null || amountDCA === '' || amountDCA === '0') return PositionStatus.ErrorNoDcaAmount
		if (tokenInUserData?.allowance == null || tokenInData?.decimals == null || bnDecOffset(tokenInUserData.allowance, tokenInData.decimals)!.lt(amountDCA))
			return PositionStatus.ErrorInsufficientAllowance
		if (tokenInUserData?.balance == null || tokenInData?.decimals == null || bnDecOffset(tokenInUserData.balance, tokenInData.decimals)!.lt(amountDCA))
			return PositionStatus.ErrorInsufficientBalance
		if (userTreasury == null || maxTxPrice == null || new BigNumber(userTreasury).lt(maxTxPrice)) return PositionStatus.WarnGasFunds

		return PositionStatus.Active
	}, [
		userHasPosition,
		positionManualOnly,
		positionPaused,
		userTreasury,
		minTxPrice,
		amountDCA,
		tokenInData?.decimals,
		tokenInUserData?.allowance,
		tokenInUserData?.balance,
		maxTxPrice,
	])
}
export const usePositionLimitingFactor = () => {
	const { tokenInData, tokenInUserData } = usePositionTokenInWithData(true)
	const userHasPosition = useUserHasPosition()
	const userTreasury = useUserTreasury()
	const { amountDCA } = usePositionAmountDCA(true)
	const { minTxPrice } = useDcaTxPriceRange(true)
	const positionPaused = useIsPositionPaused()
	const positionManualOnly = false

	return useMemo(() => {
		if (!userHasPosition) return PositionLimitingFactor.None
		if (positionManualOnly) return PositionLimitingFactor.None
		if (positionPaused) return PositionLimitingFactor.None

		if (amountDCA == null) return PositionLimitingFactor.None
		if (userTreasury == null) return PositionLimitingFactor.None
		if (tokenInUserData?.allowance == null) return PositionLimitingFactor.None
		if (tokenInUserData?.balance == null) return PositionLimitingFactor.None
		if (tokenInData?.decimals == null) return PositionLimitingFactor.None
		if (minTxPrice == null) return PositionLimitingFactor.None

		const fundingDcas = Math.floor(bn(userTreasury).div(minTxPrice).toNumber())
		const allowanceDcas = Math.floor(bnDecOffset(tokenInUserData?.allowance, tokenInData?.decimals)!.div(amountDCA).toNumber())
		const balanceDcas = Math.floor(bnDecOffset(tokenInUserData?.balance, tokenInData?.decimals)!.div(amountDCA).toNumber())
		const minDcas = Math.min(fundingDcas, allowanceDcas, balanceDcas)

		if (fundingDcas === minDcas) return PositionLimitingFactor.Funding
		if (allowanceDcas === minDcas) return PositionLimitingFactor.Allowance
		return PositionLimitingFactor.Balance
	}, [
		userHasPosition,
		positionManualOnly,
		positionPaused,
		userTreasury,
		minTxPrice,
		tokenInUserData?.allowance,
		tokenInUserData?.balance,
		tokenInData?.decimals,
		amountDCA,
	])
}

export const useAllowanceIsSufficient = () => {
	const { tokenInUserData } = usePositionTokenInWithData(true)
	const { amountDCA } = usePositionAmountDCA(true)

	return useMemo(() => {
		if (tokenInUserData?.allowance == null) return false
		if (amountDCA == null) return false

		return new BigNumber(tokenInUserData?.allowance).gte(amountDCA)
	}, [amountDCA, tokenInUserData?.allowance])
}

// REVERT CONFIG
export const useRevertTokenAndAmount = () => {
	const { dirty: tokenInDirty, current: tokenInCurrent, setTokenIn } = useConfigurableTokenIn()
	const { data: tokenInCurrentData } = useTokenPublicData(tokenInCurrent)
	const { dirty: amountDCADirty, current: amountDCACurrent, setAmountDCA } = useConfigurableAmountDCA()

	return useCallback(() => {
		if (tokenInDirty) {
			setTokenIn(tokenInCurrent)
		}
		if (amountDCADirty && tokenInCurrentData) {
			setAmountDCA(amountDCACurrent, amountDCACurrent, tokenInCurrentData)
		}
	}, [amountDCACurrent, amountDCADirty, setAmountDCA, setTokenIn, tokenInCurrent, tokenInCurrentData, tokenInDirty])
}

const empty0String = (s: string | null) => (s == null || s === '0' ? '' : s)
export const useRevertIntervalAndMaxGasPrice = () => {
	const { dirty: intervalDCADirty, current: intervalDCACurrent, setWeeks, setDays, setHours } = useConfigurableIntervalDCA()
	const { dirty: maxGasPriceDirty, current: maxGasPriceCurrent, setMaxGasPrice } = useConfigurableMaxGasPrice()

	return useCallback(() => {
		if (intervalDCADirty) {
			setWeeks(empty0String(Math.floor(intervalDCACurrent / (3600 * 24 * 7)).toString()))
			setDays(empty0String(Math.floor((intervalDCACurrent % (3600 * 24 * 7)) / (3600 * 24)).toString()))
			setHours(empty0String(Math.floor((intervalDCACurrent % (3600 * 24)) / 3600).toString()))
		}
		if (maxGasPriceDirty) {
			setMaxGasPrice(maxGasPriceCurrent)
		}
	}, [intervalDCADirty, maxGasPriceDirty, setWeeks, intervalDCACurrent, setDays, setHours, setMaxGasPrice, maxGasPriceCurrent])
}

export const useRevertOuts = () => {
	const { dirty: outsDirty, current: outsCurrent, setOuts } = useConfigurableOuts()

	return useCallback(() => {
		if (outsDirty) {
			setOuts(outsCurrent)
		}
	}, [outsCurrent, outsDirty, setOuts])
}
