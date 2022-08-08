import { MultiElevFarmConfig } from '../../types'
import { expandMultiElevConfig, multiElevConfigTokenInfo } from '../../expandMultiElevConfig'
import { farmConfigs } from './farmConfigs'
import { NamedChainId, UserTokenData } from 'state/types'
import { bscTestnetTokens } from './tokens'
import { TokenSymbol } from 'config/constants/tokenSymbols'



const summitFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.SUMMIT,
  ...farmConfigs[TokenSymbol.SUMMIT],
  ...bscTestnetTokens[TokenSymbol.SUMMIT],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xSUMMIT',
}

const everestFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.EVEREST,
  ...farmConfigs[TokenSymbol.EVEREST],
  ...bscTestnetTokens[TokenSymbol.EVEREST],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xEVEREST',
}

const cakeFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.CAKE,
  ...farmConfigs[TokenSymbol.CAKE],
  ...bscTestnetTokens[TokenSymbol.CAKE],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xCAKE',
}

const bifiFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.BIFI,
  ...farmConfigs[TokenSymbol.BIFI],
  ...bscTestnetTokens[TokenSymbol.BIFI],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xBIFI',
}

const usdcFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.USDC,
  ...farmConfigs[TokenSymbol.USDC],
  ...bscTestnetTokens[TokenSymbol.USDC],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xUSDC',
}

const gs0Farm: MultiElevFarmConfig = {
  symbol: TokenSymbol.GS0,
  ...farmConfigs[TokenSymbol.GS0],
  ...bscTestnetTokens[TokenSymbol.GS0],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xGS0',
}

const gs1Farm: MultiElevFarmConfig = {
  symbol: TokenSymbol.GS1,
  ...farmConfigs[TokenSymbol.GS1],
  ...bscTestnetTokens[TokenSymbol.GS1],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xGS1',
}

const gs2Farm: MultiElevFarmConfig = {
  symbol: TokenSymbol.GS2,
  ...farmConfigs[TokenSymbol.GS2],
  ...bscTestnetTokens[TokenSymbol.GS2],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xGS2',
}

const gs3Farm: MultiElevFarmConfig = {
  symbol: TokenSymbol.GS3,
  ...farmConfigs[TokenSymbol.GS3],
  ...bscTestnetTokens[TokenSymbol.GS3],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xGS3',
}

const gs4Farm: MultiElevFarmConfig = {
  symbol: TokenSymbol.GS4,
  ...farmConfigs[TokenSymbol.GS4],
  ...bscTestnetTokens[TokenSymbol.GS4],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xGS4',
}

const gs5Farm: MultiElevFarmConfig = {
  symbol: TokenSymbol.GS5,
  ...farmConfigs[TokenSymbol.GS5],
  ...bscTestnetTokens[TokenSymbol.GS5],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0xGS5',
}

const farms = [
  summitFarm,
  everestFarm,
  cakeFarm,
  bifiFarm,
  usdcFarm,
  gs0Farm,
  gs1Farm,
  gs2Farm,
  gs3Farm,
  gs4Farm,
  gs5Farm,
]

export const bscTestnetFarms = (chainId) => {
  if (chainId !== NamedChainId.BSC_TESTNET) return []
  return farms.map((farm) => expandMultiElevConfig(chainId, farm)).flat()
}

export const bscTestnetFarmTokens = (chainId): UserTokenData[] => {
  if (chainId !== NamedChainId.BSC_TESTNET) return []
  return farms.map(((farm) => multiElevConfigTokenInfo(chainId, farm)))
}
