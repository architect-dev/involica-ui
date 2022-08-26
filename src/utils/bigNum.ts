import BigNumber from 'bignumber.js'

export { default as formatAddress } from './formatAddress'

export const decOffset = (ish: BigNumberish | null, decimals: number | null = 18): number => {
  if (ish == null || decimals == null) return null
  return bn(ish).dividedBy(bnExp(decimals)).toNumber()
}

export const bnZero = new BigNumber(0)

export type BigNumberish = BigNumber | string | number
export const bn = (toBN: BigNumberish) => new BigNumber(toBN)
export const bnExp = (decimals: number): BigNumber => {
  return new BigNumber(10).pow(decimals)
}
export const eN = (ish: BigNumberish, decimals: number): string => {
  return bn(ish).times(bnExp(decimals)).toString()
}

export const bnDisplay = (balance: BigNumberish | null, decimals: number | null, precision?: number) => {
  if (balance == null || decimals == null) return null
  return bn(balance).dividedBy(bnExp(decimals)).toFixed(precision)
}
