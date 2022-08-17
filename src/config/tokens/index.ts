import { BigNumberish, CHAIN_ID, eN } from 'utils'
import { ftmStables, ftmSymbols } from './ftm'

export const getSymbol = (address: string) => {
  switch (parseInt(CHAIN_ID)) {
    case 250:
    default:
      return ftmSymbols[address]
  }
}

export const getIsStable = (address: string) => {
  switch (parseInt(CHAIN_ID)) {
    case 250:
    default:
      return ftmStables[address]
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
