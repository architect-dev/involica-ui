import { CHAIN_ID } from './networks'

const chainNativeTokenSymbol = {
  56: 'BNB',
  97: '',
  250: 'FTM',
  137: 'MATIC',
}

export const getNativeTokenSymbol = (): string => {
  return chainNativeTokenSymbol[CHAIN_ID]
}
