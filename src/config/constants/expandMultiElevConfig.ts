import { UserTokenData } from 'state/types'
import { getFarmToken } from 'utils/farms'
import addresses from './contracts'
import { MultiElevFarmConfig, FarmConfig } from './types'

const replaceSummitAddresses = (tokenAddress: string, summitAddress: string, summitLpAddress: string): string => {
  if (tokenAddress === '0xSUMMIT') return summitAddress
  if (tokenAddress === '0xSUMMITLP') return summitLpAddress
  return tokenAddress
}

export const expandMultiElevConfig = (chainId: string, config: MultiElevFarmConfig): FarmConfig => {
  const { getUrl, tokenAddress, lpAddress, ...farmConfig } = config

  const summitAddress = addresses.summitToken[chainId]
  const summitLpAddress = addresses.summitLpToken[chainId]
  const trueTokenAddress = replaceSummitAddresses(tokenAddress, summitAddress, summitLpAddress)
  const trueLpAddress = replaceSummitAddresses(lpAddress, summitAddress, summitLpAddress)
  const farmToken = getFarmToken({ assetType: farmConfig.assetType, tokenAddress: trueTokenAddress, lpAddress: trueLpAddress })
  const trueGetUrl = getUrl.replace('0xSUMMIT', summitAddress)

  return {
    ...config,
    farmToken,
    tokenAddress: trueTokenAddress,
    lpAddress: trueLpAddress,
    getUrl: trueGetUrl,
  }
}

export const multiElevConfigTokenInfo = (chainId: string, config: MultiElevFarmConfig): UserTokenData => {
  const summitAddress = addresses.summitToken[chainId]
  const summitLpAddress = addresses.summitLpToken[chainId]
  const trueTokenAddress = replaceSummitAddresses(config.tokenAddress, summitAddress, summitLpAddress)
  const trueLpAddress = replaceSummitAddresses(config.lpAddress, summitAddress, summitLpAddress)
  const tokenAddress = getFarmToken({ assetType: config.assetType, tokenAddress: trueTokenAddress, lpAddress: trueLpAddress })
  return {
    symbol: config.symbol,
    tokenAddress,
  }
}


