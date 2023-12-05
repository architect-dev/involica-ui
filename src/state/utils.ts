import { ethers } from 'ethers'
import { Nullable, checkPrecisionValid } from '@utils'
import { Position, PositionConfig, PositionConfigSupplements, Token } from './types'

export const weights: Record<number, number[]> = {
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
export const getWeights = (n: number) => weights[n]

export const sToF = (s: string): number => {
	return s == null || s === '' || isNaN(parseFloat(s)) ? 0 : parseFloat(s)
}
export const wdhToSec = (w: string, d: string, h: string): number => {
	return Math.round((sToF(w) * 7 + sToF(d)) * 24 + sToF(h)) * 3600
}

export const validateDecimals = (amount: string, token: Nullable<Token>): Nullable<string> => {
	if (token == null) return `Token not selected`
	if (!checkPrecisionValid(amount, token.decimals)) {
		if (token.decimals === 0) return `${token.symbol} does not support decimals`
		return `${token.symbol} only supports ${token.decimals} decimals`
	}
	return null
}
export const validateAmountDCA = (amountDCA: string, fullBalance: Nullable<string>, token: Nullable<Token>): Nullable<string> => {
	if (amountDCA === '') return 'DCA Amount required'
	if (isNaN(parseFloat(amountDCA))) return 'Not a number'
	const decimalsInvalidError = validateDecimals(amountDCA, token)
	if (decimalsInvalidError != null) return decimalsInvalidError
	if (parseFloat(amountDCA) <= 0) return 'Must be greater than 0'
	if (parseFloat(amountDCA ?? '0') > parseFloat(fullBalance ?? '0')) return 'Insufficient wallet balance to cover 1 DCA'
	return null
}
export const validateFundingAmount = (fundingAmount: string, fullBalance: Nullable<string>, nativeToken: Nullable<Token>): Nullable<string> => {
	if (fundingAmount === '') return 'Funding required'
	if (isNaN(parseFloat(fundingAmount))) return 'Not a number'
	const decInval = validateDecimals(fundingAmount, nativeToken)
	if (decInval != null) return decInval
	if (parseFloat(fundingAmount) <= 0) return 'Must be greater than 0'
	if (parseFloat(fundingAmount ?? '0') > parseFloat(fullBalance ?? '0')) return 'Insufficient balance'
	return null
}
export const validateFundingWithdrawal = (fundingAmount: string, fullBalance: Nullable<string>, nativeToken: Nullable<Token>): Nullable<string> => {
	if (fundingAmount === '') return 'Funding required'
	if (isNaN(parseFloat(fundingAmount))) return 'Not a number'
	const decInval = validateDecimals(fundingAmount, nativeToken)
	if (decInval != null) return decInval
	if (parseFloat(fundingAmount) <= 0) return 'Must be greater than 0'
	if (parseFloat(fundingAmount ?? '0') > parseFloat(fullBalance ?? '0')) return 'Insufficient funding'
	return null
}
export const validateSlippage = (slippage: string): Nullable<string> => {
	if (slippage === '') return 'Slippage required'
	if (isNaN(parseFloat(slippage))) return 'Not a number'
	if (parseFloat(slippage) < 0.5) return 'Must be greater than 0.5%'
	if (parseFloat(slippage) > 50) return 'Must be less than 50%'
	return null
}
export const validateDcasCount = (dcasCount: string): Nullable<string> => {
	if (dcasCount !== 'Inf') {
		if (dcasCount === '') return 'DCA Count or Inf required'
		if (isNaN(parseFloat(dcasCount))) return 'Not a number'
		if (parseFloat(dcasCount) <= 0) return 'Must be greater than 0'
		return null
	}
	return null
}
export const validateIntervalComponent = (component: string): Nullable<string> => {
	if (component === '') return null
	if (isNaN(parseFloat(component))) return 'Not a number'
	if (parseFloat(component) < 0) return 'Must be >= 0'
	return null
}

export const emptyConfig: PositionConfig & PositionConfigSupplements = {
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

export const empty0String = (s: Nullable<string>): string => (s == null || s === '0' ? '' : s)

export const getHydratedConfigFromPosition = (position?: Position): (PositionConfig & PositionConfigSupplements) | null => {
	if (position == null) {
		console.error('No position to hydrate')
		return null
	}
	if (position.user === ethers.constants.AddressZero) {
		return emptyConfig
	}
	return {
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
	}
}
