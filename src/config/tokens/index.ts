import { BigNumberish, CHAIN_ID, eN } from 'utils'
import { ftmDecimals, ftmStables, ftmSymbols } from './ftm'

export const getSymbol = (address: string): string => {
  switch (parseInt(CHAIN_ID)) {
    case 250:
    default:
      return ftmSymbols[address] ?? 'UNKNOWN'
  }
}

export const getIsStable = (address: string): boolean => {
  switch (parseInt(CHAIN_ID)) {
    case 250:
    default:
      return ftmStables[address] ?? false
  }
}

export const getDecimals = (address: string): number => {
  switch(parseInt(CHAIN_ID)) {
    case 250:
    default:
      return ftmDecimals[address] ?? 18
  }
}

export const getChainGwei = (raw: BigNumberish) => {
  switch (parseInt(CHAIN_ID)) {
    case 250:
      return eN(raw, 11)
    default:
      return eN(raw, 9)
  }
}
