import BigNumber from 'bignumber.js'

export { default as formatAddress } from './formatAddress'

export const bnToDec = (bn: BigNumber, decimals = 18): number => {
  return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber()
}

export const bnZero = new BigNumber(0)

export const bnExp = (decimals: number): BigNumber => {
  return new BigNumber(10).pow(decimals)
}

export const eN = (bn: BigNumber, decimals: number): string => {
  return bn.times(bnExp(decimals)).toString()
}
