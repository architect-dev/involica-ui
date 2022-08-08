import { TokenSymbol } from "config/constants/tokenSymbols"
import { TokenAssetType, PriceableToken, TokenLpSource } from "config/constants/types"

export const ftmPeggedTokens = {
  [TokenSymbol.USDC]: true,
}

// SUMMIT POOL ID: 0x9b99145008204301de44eddc2ad4615ed3d61538000100000000000000000208
// SUMMIT POOL ADDRESS: 0x9b99145008204301de44edDC2aD4615ED3d61538

export const ftmTokens: { [key: string]: PriceableToken } = {
  [TokenSymbol.wFTM]: {
    assetType: TokenAssetType.WrappedNative,
    symbol: TokenSymbol.wFTM,
    tokenAddress: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    lpAddress: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    decimals: 18,
  },
  [TokenSymbol.USDC]: {
    assetType: TokenAssetType.Stablecoin,
    symbol: TokenSymbol.USDC,
    tokenAddress: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    decimals: 6,
  },
  [TokenSymbol.SUMMIT]: {
    assetType: TokenAssetType.Summit,
    symbol: TokenSymbol.SUMMIT,
    tokenAddress: '0xSUMMIT',
    decimals: 18,
    balancerMultiPoolInfo: {
      poolId: '0x1577eb091d3933a89be62130484e090bb8bd0e5800010000000000000000020f',
      pricingTokens: [{
        token: TokenSymbol.wFTM,
        weight: 20,
      }, {
        token: TokenSymbol.USDC,
        weight: 20,
      }]
    }
  },
  [TokenSymbol.EVEREST]: {
    assetType: TokenAssetType.Everest,
    symbol: TokenSymbol.EVEREST,
    tokenAddress: '0xC687806Cfd11B5330d7c3aE6f18B18DC71e1083e',
    decimals: 18,
  },
  [TokenSymbol.TOMB_FTM]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.TOMB_FTM,
    lpSource: TokenLpSource.SpookySwap,
    lpAddress: '0x2a651563c9d3af67ae0388a5c8f89b867038089e',
    decimals: 18,
  },
  [TokenSymbol.TSHARE_FTM]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.TSHARE_FTM,
    lpSource: TokenLpSource.SpookySwap,
    lpAddress: '0x4733bc45ef91cf7ccecaeedb794727075fb209f2',
    decimals: 18,
  },
  [TokenSymbol.FTM_BOO]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.FTM_BOO,
    lpSource: TokenLpSource.SpookySwap,
    lpAddress: '0xEc7178F4C41f346b2721907F5cF7628E388A7a58',
    decimals: 18,
  },
  [TokenSymbol.BPT_BEETS_FTM]: {
    assetType: TokenAssetType.Balancer2Pool,
    symbol: TokenSymbol.BPT_BEETS_FTM,
    lpSource: TokenLpSource.BeethovenX,
    tokenAddress: '0xcde5a11a4acb4ee4c805352cec57e236bdbc3837',
    decimals: 18,
  },
  [TokenSymbol.BATTLE_OF_THE_BANDS]: {
    assetType: TokenAssetType.BalancerMultiPool,
    symbol: TokenSymbol.BATTLE_OF_THE_BANDS,
    lpSource: TokenLpSource.BeethovenX,
    tokenAddress: '0x9af1f0e9ac9c844a4a4439d446c1437807183075',
    decimals: 18,
    balancerMultiPoolInfo: {
      poolId: '0x9af1f0e9ac9c844a4a4439d446c14378071830750001000000000000000000da',
      pricingTokens: [{
        token: TokenSymbol.wFTM,
        weight: 20,
      }, {
        token: TokenSymbol.fBNB,
        weight: 16,
      }, {
        token: TokenSymbol.fMATIC,
        weight: 16,
      }]
    }
  },
  [TokenSymbol.GRAND_ORCH]: {
    assetType: TokenAssetType.BalancerMultiPool,
    symbol: TokenSymbol.GRAND_ORCH,
    lpSource: TokenLpSource.BeethovenX,
    tokenAddress: '0xd47d2791d3b46f9452709fa41855a045304d6f9d',
    decimals: 18,
    balancerMultiPoolInfo: {
      poolId: '0xd47d2791d3b46f9452709fa41855a045304d6f9d000100000000000000000004',
      pricingTokens: [{
        token: TokenSymbol.wFTM,
        weight: 33.333,
      }, {
        token: TokenSymbol.wBTC,
        weight: 33.333,
      }]
    }
  },
  [TokenSymbol.FANTOM_OF_THE_OPERA]: {
    assetType: TokenAssetType.BalancerMultiPool,
    symbol: TokenSymbol.FANTOM_OF_THE_OPERA,
    lpSource: TokenLpSource.BeethovenX,
    tokenAddress: '0xcdF68a4d525Ba2E90Fe959c74330430A5a6b8226',
    decimals: 18,
    balancerMultiPoolInfo: {
      poolId: '0xcdf68a4d525ba2e90fe959c74330430a5a6b8226000200000000000000000008',
      pricingTokens: [{
        token: TokenSymbol.wFTM,
        weight: 70,
      }]
    }
  },
  [TokenSymbol.BOO]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.BOO,
    tokenAddress: '0x841fad6eae12c286d1fd18d1d525dffa75c7effe',
    lpAddress: '0xEc7178F4C41f346b2721907F5cF7628E388A7a58',
    decimals: 18,
  },
  [TokenSymbol["2SHARES_FTM"]]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol["2SHARES_FTM"],
    lpSource: TokenLpSource.SpookySwap,
    lpAddress: '0x6398ACBBAB2561553a9e458Ab67dCFbD58944e52',
    decimals: 18,
  },
  [TokenSymbol["2OMB_FTM"]]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol["2OMB_FTM"],
    lpSource: TokenLpSource.SpookySwap,
    lpAddress: '0xbdC7DFb7B88183e87f003ca6B5a2F81202343478',
    decimals: 18,
  },
  [TokenSymbol.PAE_FTM]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.PAE_FTM,
    lpSource: TokenLpSource.SpookySwap,
    lpAddress: '0x2DC234DbfC085DdbC36a6EACC061D7333Cd397b0',
    decimals: 18,
  },
  [TokenSymbol.pFTM_FTM]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.pFTM_FTM,
    lpSource: TokenLpSource.SpookySwap,
    lpAddress: '0x9ce8e9b090e8AF873e793e0b78C484076F8CEECE',
    decimals: 18,
  },
  [TokenSymbol.BOO_XBOO]: {
    assetType: TokenAssetType.SolidlyLP,
    symbol: TokenSymbol.BOO_XBOO,
    lpSource: TokenLpSource.SolidlyVolatile,
    lpAddress: '0x5804F6C40f44cF7593F73cf3aa16F7037213A623',
    decimals: 18,
    solidlyLpContainingTokens: [TokenSymbol.BOO, TokenSymbol.xBOO],

  },
  [TokenSymbol.USDC_MIM]: {
    assetType: TokenAssetType.SolidlyLP,
    symbol: TokenSymbol.USDC_MIM,
    lpSource: TokenLpSource.SolidlyStable,
    lpAddress: '0xbcab7d083Cf6a01e0DdA9ed7F8a02b47d125e682',
    decimals: 18,
    solidlyLpContainingTokens: [TokenSymbol.USDC, TokenSymbol.MIM],
  },
  [TokenSymbol.FTM_BSHARE]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.FTM_BSHARE,
    lpSource: TokenLpSource.SpookySwap,
    lpAddress: '0x6F607443DC307DCBe570D0ecFf79d65838630B56',
    decimals: 18,

  },
  [TokenSymbol.TOMB_BASED]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.TOMB_BASED,
    lpSource: TokenLpSource.SpookySwap,
    lpAddress: '0xaB2ddCBB346327bBDF97120b0dD5eE172a9c8f9E',
    decimals: 18,
  },
  [TokenSymbol.LQDR_FTM]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.LQDR_FTM,
    lpSource: TokenLpSource.SpiritSwap,
    lpAddress: '0x4Fe6f19031239F105F753D1DF8A0d24857D0cAA2',
    decimals: 18,
  },
  [TokenSymbol.TOMB_MAI]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.TOMB_MAI,
    lpSource: TokenLpSource.TombSwap,
    lpAddress: '0x45f4682b560d4e3b8ff1f1b3a38fdbe775c7177b',
    decimals: 18,
  },
  [TokenSymbol.BASED_MAI]: {
    assetType: TokenAssetType.LP,
    symbol: TokenSymbol.BASED_MAI,
    lpSource: TokenLpSource.TombSwap,
    lpAddress: '0x7b5b3751550be4ff87ac6bda89533f7a0c9825b3',
    decimals: 18,
  },
  



  // BALANCER COMPONENTS
  [TokenSymbol.wBTC]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.wBTC,
    tokenAddress: '0x321162Cd933E2Be498Cd2267a90534A804051b11',
    decimals: 8,
  },
  [TokenSymbol.wETH]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.wETH,
    tokenAddress: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
    decimals: 18,
  },
  [TokenSymbol.fMATIC]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.fMATIC,
    tokenAddress: '0x40DF1Ae6074C35047BFF66675488Aa2f9f6384F3',
    decimals: 18,
  },
  [TokenSymbol.fAVAX]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.fAVAX,
    tokenAddress: '0x511D35c52a3C244E7b8bd92c0C297755FbD89212',
    decimals: 18,
  },
  [TokenSymbol.fBNB]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.fBNB,
    tokenAddress: '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454',
    decimals: 18,
  },
  [TokenSymbol.fSOL]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.fSOL,
    tokenAddress: '0x44F7237df00E386af8e79B817D05ED9f6FE0f296',
    decimals: 18,
  },
  [TokenSymbol.fLUNA]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.fLUNA,
    tokenAddress: '0x95dD59343a893637BE1c3228060EE6afBf6F0730',
    decimals: 6,
  },
  [TokenSymbol.MIM]: {
    assetType: TokenAssetType.Stablecoin,
    symbol: TokenSymbol.MIM,
    tokenAddress: '0x82f0b8b456c1a451378467398982d4834b6829c1',
    decimals: 18,
  },
  [TokenSymbol.xBOO]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.xBOO,
    tokenAddress: '0xa48d959AE2E88f1dAA7D5F611E01908106dE7598',
    decimals: 18,
  },
  [TokenSymbol.BSHARE]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.BSHARE,
    tokenAddress: '0x49C290Ff692149A4E16611c694fdED42C954ab7a',
    decimals: 18,
  },
  [TokenSymbol.BASED]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.BASED,
    tokenAddress: '0x8D7d3409881b51466B483B11Ea1B8A03cdEd89ae',
    decimals: 18,
  },
}
