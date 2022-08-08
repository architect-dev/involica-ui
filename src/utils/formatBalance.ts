import BigNumber from 'bignumber.js'
import { nFormatter } from './helpers'

export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  const displayBalance = new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals))
  return displayBalance.toNumber()
}

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
  return balance.dividedBy(new BigNumber(10).pow(decimals)).toFixed()
}

export const getFormattedBigNumber = (balance: BigNumber, digits = 3, decimals = 18) => {
  return nFormatter(getBalanceNumber(balance, decimals), digits)
}
