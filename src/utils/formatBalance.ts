import BigNumber from 'bignumber.js'
import { BigNumberish, bn, bnExp } from './bigNum'
import { nFormatter } from './helpers'

export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  const displayBalance = new BigNumber(balance).dividedBy(bnExp(decimals))
  return displayBalance.toNumber()
}



export const getFormattedBigNumber = (balance: BigNumber, digits = 3, decimals = 18) => {
  return nFormatter(getBalanceNumber(balance, decimals), digits)
}
