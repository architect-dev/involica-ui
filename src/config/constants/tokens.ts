import { PriceableTokenMap } from './types'
import { bscTestnetPeggedTokens, bscTestnetTokens } from './chain/bsc_testnet/tokens'
import { ftmPeggedTokens, ftmTokens } from './chain/ftm/tokens'
import { polygonPeggedTokens, polygonTokens } from './chain/polygon/tokens'
import addresses from './contracts'
import { CHAIN_ID } from './networks'
import memoize from 'fast-memoize'

const chainPeggedTokens = {
  56: [],
  97: bscTestnetPeggedTokens,
  250: ftmPeggedTokens,
  137: polygonPeggedTokens,
}

export const getPeggedTokens = memoize(() => {
  return chainPeggedTokens[CHAIN_ID]
})

const chainTokens = {
  56: [],
  97: bscTestnetTokens,
  250: ftmTokens,
  137: polygonTokens,
}




const replaceSummitAddresses = (tokenAddress: string, summitAddress: string, summitLpAddress: string): string => {
  if (tokenAddress === '0xSUMMIT') return summitAddress
  if (tokenAddress === '0xSUMMITLP') return summitLpAddress
  return tokenAddress
}

const replaceTokensSummitAddresses = (chainId, tokens: PriceableTokenMap): PriceableTokenMap => {
  const summitAddress = addresses.summitToken[chainId]
  const summitLpAddress = addresses.summitLpToken[chainId]

  const newTokens = {}

  Object.keys(tokens).forEach((symbol) => {
    newTokens[symbol] = {
      ...tokens[symbol],
      tokenAddress: replaceSummitAddresses(tokens[symbol].tokenAddress, summitAddress, summitLpAddress),
      lpAddress: replaceSummitAddresses(tokens[symbol].lpAddress, summitAddress, summitLpAddress),
    }
  })

  return newTokens
}

export const getPriceableTokens = memoize((): PriceableTokenMap => {
  return replaceTokensSummitAddresses(CHAIN_ID, chainTokens[CHAIN_ID])
})