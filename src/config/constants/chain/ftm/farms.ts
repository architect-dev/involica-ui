import { MultiElevFarmConfig } from '../../types'
import { expandMultiElevConfig, multiElevConfigTokenInfo } from '../../expandMultiElevConfig'
import { farmConfigs } from './farmConfigs'
import { NamedChainId, UserTokenData } from 'state/types'
import { ftmTokens } from './tokens'
import { TokenSymbol } from 'config/constants/tokenSymbols'



const summitFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.SUMMIT,
  ...farmConfigs[TokenSymbol.SUMMIT],
  ...ftmTokens[TokenSymbol.SUMMIT],
  getUrl: 'https://beets.fi/#/trade/0x0dDB88e14494546D07fCd94c3f0ef6D3296B1cD7',
}

const everestFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.EVEREST,
  ...farmConfigs[TokenSymbol.EVEREST],
  ...ftmTokens[TokenSymbol.EVEREST],
  getUrl: 'https://ftm.summitdefi.com/everest',
}



const booXBooFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.BOO_XBOO,
  ...farmConfigs[TokenSymbol.BOO_XBOO],
  ...ftmTokens[TokenSymbol.BOO_XBOO],
  getUrl: 'https://solidly.exchange/liquidity/create',
}

const usdcMimFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.USDC_MIM,
  ...farmConfigs[TokenSymbol.USDC_MIM],
  ...ftmTokens[TokenSymbol.USDC_MIM],
  getUrl: 'https://solidly.exchange/liquidity/create',
}



const ftmBshareFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.FTM_BSHARE,
  ...farmConfigs[TokenSymbol.FTM_BSHARE],
  ...ftmTokens[TokenSymbol.FTM_BSHARE],
  getUrl: 'https://spookyswap.finance/add/0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83/0x49C290Ff692149A4E16611c694fdED42C954ab7a',
}
const tombBasedFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.TOMB_BASED,
  ...farmConfigs[TokenSymbol.TOMB_BASED],
  ...ftmTokens[TokenSymbol.TOMB_BASED],
  getUrl: 'https://spookyswap.finance/add/0x6c021Ae822BEa943b2E66552bDe1D2696a53fbB7/0x8D7d3409881b51466B483B11Ea1B8A03cdEd89ae',
}



const paeFtmFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.PAE_FTM,
  ...farmConfigs[TokenSymbol.PAE_FTM],
  ...ftmTokens[TokenSymbol.PAE_FTM],
  getUrl: 'https://spookyswap.finance/add/0x8a41f13a4FaE75ca88B1ee726ee9D52B148b0498/FTM',
  beefyVaultApiName: 'ripae-pae-ftm'
}

const pFtmFtmFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.pFTM_FTM,
  ...farmConfigs[TokenSymbol.pFTM_FTM],
  ...ftmTokens[TokenSymbol.pFTM_FTM],
  getUrl: 'https://spookyswap.finance/add/0x112dF7E3b4B7Ab424F07319D4E92F41e6608c48B/FTM',
  beefyVaultApiName: 'ripae-pftm-ftm'
}

const tombFtmFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.TOMB_FTM,
  ...farmConfigs[TokenSymbol.TOMB_FTM],
  ...ftmTokens[TokenSymbol.TOMB_FTM],
  getUrl: 'https://spookyswap.finance/add/FTM/0x6c021Ae822BEa943b2E66552bDe1D2696a53fbB7',
  beefyVaultApiName: 'tomb-tomb-ftm'
}

const tshareFtmFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.TSHARE_FTM,
  ...farmConfigs[TokenSymbol.TSHARE_FTM],
  ...ftmTokens[TokenSymbol.TSHARE_FTM],
  getUrl: 'https://spookyswap.finance/add/FTM/0x4cdF39285D7Ca8eB3f090fDA0C069ba5F4145B37',
  beefyVaultApiName: 'tomb-tshare-ftm'
}

const ftmBooFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.FTM_BOO,
  ...farmConfigs[TokenSymbol.FTM_BOO],
  ...ftmTokens[TokenSymbol.FTM_BOO],
  getUrl: 'https://spookyswap.finance/add/FTM/0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE',
  beefyVaultApiName: 'boo-boo-ftm'
}

const booFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.BOO,
  ...farmConfigs[TokenSymbol.BOO],
  ...ftmTokens[TokenSymbol.BOO],
  getUrl: 'https://spookyswap.finance/swap?outputCurrency=0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE',
  beefyVaultApiName: 'boo-boo',
}

const fidelioDuettoFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.BPT_BEETS_FTM,
  name: 'Fidelio Duetto',
  ...farmConfigs[TokenSymbol.BPT_BEETS_FTM],
  ...ftmTokens[TokenSymbol.BPT_BEETS_FTM],
  getUrl: 'https://beets.fi/#/pool/0xcde5a11a4acb4ee4c805352cec57e236bdbc3837000200000000000000000019',
  beefyVaultApiName: 'beets-fidelio-duetto'
}

const fantomOfTheOperaFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.FANTOM_OF_THE_OPERA,
  name: 'Fantom of the Opera',
  ...farmConfigs[TokenSymbol.FANTOM_OF_THE_OPERA],
  ...ftmTokens[TokenSymbol.FANTOM_OF_THE_OPERA],
  getUrl: 'https://beets.fi/#/pool/0xcdf68a4d525ba2e90fe959c74330430a5a6b8226000200000000000000000008',
  beefyVaultApiName: 'beets-fantom-of-opera'
}

const grandOrchestraFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.GRAND_ORCH,
  name: 'The Grand Orchestra',
  ...farmConfigs[TokenSymbol.GRAND_ORCH],
  ...ftmTokens[TokenSymbol.GRAND_ORCH],
  getUrl: 'https://beets.fi/#/pool/0xd47d2791d3b46f9452709fa41855a045304d6f9d000100000000000000000004',
  beefyVaultApiName: 'beets-grand-orchestra'
}

const battleOfTheBandsFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.BATTLE_OF_THE_BANDS,
  name: 'Battle of the Bands',
  ...farmConfigs[TokenSymbol.BATTLE_OF_THE_BANDS],
  ...ftmTokens[TokenSymbol.BATTLE_OF_THE_BANDS],
  getUrl: 'https://beets.fi/#/pool/0x9af1f0e9ac9c844a4a4439d446c14378071830750001000000000000000000da',
  beefyVaultApiName: 'beets-battle-bands'
}

const twoSharesFtmFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol['2SHARES_FTM'],
  ...farmConfigs[TokenSymbol['2SHARES_FTM']],
  ...ftmTokens[TokenSymbol['2SHARES_FTM']],
  getUrl: 'https://spookyswap.finance/add/FTM/0xc54A1684fD1bef1f077a336E6be4Bd9a3096a6Ca',
  beefyVaultApiName: '2omb-2share-ftm'
}

const twOmbFtmFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol['2OMB_FTM'],
  ...farmConfigs[TokenSymbol['2OMB_FTM']],
  ...ftmTokens[TokenSymbol['2OMB_FTM']],
  getUrl: 'https://spookyswap.finance/add/FTM/0x7a6e4E3CC2ac9924605DCa4bA31d1831c84b44aE',
  beefyVaultApiName: '2omb-2omb-ftm'
}
const lqdrFtmFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.LQDR_FTM,
  ...farmConfigs[TokenSymbol.LQDR_FTM],
  ...ftmTokens[TokenSymbol.LQDR_FTM],
  getUrl: 'https://swap.spiritswap.finance/#/add/0x10b620b2dbAC4Faa7D7FFD71Da486f5D44cd86f9/0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
}

const tombMaiFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.TOMB_MAI,
  ...farmConfigs[TokenSymbol.TOMB_MAI],
  ...ftmTokens[TokenSymbol.TOMB_MAI],
  getUrl: 'https://swap.tomb.com/#/add/0x6c021Ae822BEa943b2E66552bDe1D2696a53fbB7/0xfB98B335551a418cD0737375a2ea0ded62Ea213b',
  beefyVaultApiName: 'tomb-tomb-mai'
}
const basedMaiFarm: MultiElevFarmConfig = {
  symbol: TokenSymbol.BASED_MAI,
  ...farmConfigs[TokenSymbol.BASED_MAI],
  ...ftmTokens[TokenSymbol.BASED_MAI],
  getUrl: 'https://swap.tomb.com/#/add/0xfB98B335551a418cD0737375a2ea0ded62Ea213b/0x8D7d3409881b51466B483B11Ea1B8A03cdEd89ae',
  beefyVaultApiName: 'based-based-mai'
}

const farms = [
  summitFarm,
  everestFarm,
  lqdrFtmFarm,
  tombMaiFarm,
  basedMaiFarm,
  ftmBshareFarm,
  tombBasedFarm,
  booXBooFarm,
  usdcMimFarm,
  paeFtmFarm,
  pFtmFtmFarm,
  tombFtmFarm,
  tshareFtmFarm,
  ftmBooFarm,
  booFarm,
  twoSharesFtmFarm,
  twOmbFtmFarm,
  fidelioDuettoFarm,
  fantomOfTheOperaFarm,
  grandOrchestraFarm,
  battleOfTheBandsFarm,
]

export const ftmFarms = (chainId) => {
  if (chainId !== NamedChainId.FTM) return []
  return farms.map((farm) => expandMultiElevConfig(chainId, farm)).flat()
}

export const ftmFarmTokens = (chainId): UserTokenData[] => {
  if (chainId !== NamedChainId.FTM) return []
  return farms.map(((farm) => multiElevConfigTokenInfo(chainId, farm)))
}
