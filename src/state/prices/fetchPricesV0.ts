import BigNumber from 'bignumber.js'
import { getPriceableTokens } from 'config/constants'
import {
  groupByAndMap,
} from 'utils'


export const fetchPricesV0 = async () => {
  const priceableTokensMap = getPriceableTokens()
  const priceableTokens = Object.values(priceableTokensMap)

  return groupByAndMap(
    priceableTokens,
    (priceableToken) => priceableToken.symbol,
    () => new BigNumber(1.5)
  )
}
