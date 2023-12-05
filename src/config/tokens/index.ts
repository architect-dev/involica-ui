import { useMemo } from 'react'
import { BigNumberish, CHAIN_ID, Nullable, eN } from '@utils'
import { ftmDecimals, ftmStables, ftmSymbols } from './ftm'

export const getSymbol = (address: Nullable<string>): string => {
	switch (parseInt(CHAIN_ID)) {
		case 250:
		default:
			return address != null && ftmSymbols[address] != null ? ftmSymbols[address] : 'UNKNOWN'
	}
}
export const useSymbol = (address: string): string => {
	return useMemo(() => getSymbol(address), [address])
}

export const getIsStable = (address: string): boolean => {
	switch (parseInt(CHAIN_ID)) {
		case 250:
		default:
			return ftmStables[address] ?? false
	}
}

export const getDecimals = (address: string): number => {
	switch (parseInt(CHAIN_ID)) {
		case 250:
		default:
			return ftmDecimals[address] ?? 18
	}
}

export const getChainGwei = (raw: BigNumberish) => {
	switch (parseInt(CHAIN_ID)) {
		case 250:
			return eN(raw, 9)
		default:
			return eN(raw, 9)
	}
}
