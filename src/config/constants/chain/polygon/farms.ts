import { MultiElevFarmConfig } from '../../types'
import { expandMultiElevConfig, multiElevConfigTokenInfo } from '../../expandMultiElevConfig'
import { farmConfigs } from './farmConfigs'
import { NamedChainId, UserTokenData } from 'state/types'
import { polygonTokens } from './tokens'
import { TokenSymbol } from 'config/constants/tokenSymbols'



const summitFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.SUMMIT,
  ...farmConfigs[TokenSymbol.SUMMIT],
  ...polygonTokens[TokenSymbol.SUMMIT],
  getUrl: 'https://quickswap.exchange/#/swap?outputCurrency=0xSUMMIT',
}
const summitMaticFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.SUMMIT_MATIC,
  ...farmConfigs[TokenSymbol.SUMMIT_MATIC],
  ...polygonTokens[TokenSymbol.SUMMIT_MATIC],
  getUrl: 'https://quickswap.exchange/#/add/0xSUMMIT/ETH',
}

const everestFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.EVEREST,
  ...farmConfigs[TokenSymbol.EVEREST],
  ...polygonTokens[TokenSymbol.EVEREST],
  getUrl: 'https://polygon.summitdefi.com/everest',
}



const maiUsdcFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.MAI_USDC,
  ...farmConfigs[TokenSymbol.MAI_USDC],
  ...polygonTokens[TokenSymbol.MAI_USDC],
  getUrl: 'https://quickswap.exchange/#/add/0x2791bca1f2de4661ed88a30c99a7a9449aa84174/0xa3fa99a148fa48d14ed51d610c367c61876997f1',
}
const qiMaticFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.QI_MATIC,
  ...farmConfigs[TokenSymbol.QI_MATIC],
  ...polygonTokens[TokenSymbol.QI_MATIC],
  getUrl: 'https://quickswap.exchange/#/add/ETH/0x580a84c73811e1839f75d86d75d88cca0c241ff4',
  beefyVaultApiName: 'mai-qi-matic'
}

const aTriCryptoFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.aTriCrypto,
  ...farmConfigs[TokenSymbol.aTriCrypto],
  ...polygonTokens[TokenSymbol.aTriCrypto],
  getUrl: 'https://polygon.curve.fi/atricrypto3/deposit',
  beefyVaultApiName: 'curve-poly-atricrypto3',
}

const bifiMaxiFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.BIFI_MAXI,
  ...farmConfigs[TokenSymbol.BIFI_MAXI],
  ...polygonTokens[TokenSymbol.BIFI_MAXI],
  getUrl: 'https://quickswap.exchange/#/swap?outputCurrency=0xfbdd194376de19a88118e84e279b977f165d01b8',
  beefyVaultApiName: 'polygon-bifi-maxi',
}

const quickFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.QUICK,
  ...farmConfigs[TokenSymbol.QUICK],
  ...polygonTokens[TokenSymbol.QUICK],
  getUrl: 'https://quickswap.exchange/#/swap?outputCurrency=0x831753DD7087CaC61aB5644b308642cc1c33Dc13',
  beefyVaultApiName: 'quick-quick'
}

const ethMaticFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.ETH_MATIC,
  ...farmConfigs[TokenSymbol.ETH_MATIC],
  ...polygonTokens[TokenSymbol.ETH_MATIC],
  getUrl: 'https://quickswap.exchange/#/add/ETH/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
}

const maticUsdcFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.MATIC_USDC,
  ...farmConfigs[TokenSymbol.MATIC_USDC],
  ...polygonTokens[TokenSymbol.MATIC_USDC],
  getUrl: 'https://quickswap.exchange/#/add/ETH/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  beefyVaultApiName: 'quick-matic-usdc'
}

const eurtDaiUsdcUsdtFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.EURt_DAI_USDC_USDT,
  ...farmConfigs[TokenSymbol.EURt_DAI_USDC_USDT],
  ...polygonTokens[TokenSymbol.EURt_DAI_USDC_USDT],
  getUrl: 'https://polygon.curve.fi/eurtusd/deposit',
  beefyVaultApiName: 'curve-poly-eurt',
}

const farms = [
  summitFarm,
  summitMaticFarm,
  everestFarm,
  maiUsdcFarm,
  qiMaticFarm,
  aTriCryptoFarm,
  bifiMaxiFarm,
  quickFarm,
  ethMaticFarm,
  maticUsdcFarm,
  eurtDaiUsdcUsdtFarm,
]

export const polygonFarms = (chainId) => {
  if (chainId !== NamedChainId.POLYGON) return []
  return farms.map((farm) => expandMultiElevConfig(chainId, farm)).flat()
}

export const polygonFarmTokens = (chainId): UserTokenData[] => {
  if (chainId !== NamedChainId.POLYGON) return []
  return farms.map(((farm) => multiElevConfigTokenInfo(chainId, farm)))
}
