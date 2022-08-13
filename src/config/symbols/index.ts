import { CHAIN_ID } from 'utils'
import ftmSymbols from './ftm'

export const getSymbol = (address: string) => {
  switch (parseInt(CHAIN_ID)) {
    case 250:
    default:
      return ftmSymbols[address]
  }
}