import { TokenSymbol } from "config/constants/tokenSymbols"
import { TokenAssetType, PriceableToken } from "config/constants/types"

export const bscTestnetPeggedTokens = {
  [TokenSymbol.USDC]: true,
}

export const bscTestnetTokens: { [key: string]: PriceableToken } = {
  [TokenSymbol.wBNB]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.wBNB,
    tokenAddress: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    decimals: 18,
  },
  [TokenSymbol.SUMMIT]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.SUMMIT,
    tokenAddress: '0xSUMMIT',
    decimals: 18,
  },
  [TokenSymbol.EVEREST]: {
    assetType: TokenAssetType.Everest,
    symbol: TokenSymbol.EVEREST,
    tokenAddress: '0x83Db6A464E88FF9bD77d0737847F2d6B43239346',
    decimals: 18,
  },
  [TokenSymbol.CAKE]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.CAKE,
    tokenAddress: '0x5887fa698320693A0D610c597658FAD5D6BF5009',
    decimals: 18,
  },
  [TokenSymbol.BIFI]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.BIFI,
    tokenAddress: '0x3614fE815A40242bBC56D9e0fC98975D7F587268',
    decimals: 18,
  },
  [TokenSymbol.USDC]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.USDC,
    tokenAddress: '0x48DC8b7332c71dC18E125D71E305Cfa592196c73',
    decimals: 6,
  },
  [TokenSymbol.GS0]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.GS0,
    tokenAddress: '0x4FD19440dca1F5e27509c3C3a952888c52081880',
    decimals: 18,
  },
  [TokenSymbol.GS1]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.GS1,
    tokenAddress: '0x276cBFeb56Da65fb483718b74F6D780266E69c81',
    decimals: 18,
  },
  [TokenSymbol.GS2]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.GS2,
    tokenAddress: '0xB297e914113753382D87127f5F65eE32dab2E4ca',
    decimals: 18,
  },
  [TokenSymbol.GS3]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.GS3,
    tokenAddress: '0xC9cb6E1c49dDfFBFE73E0aEd505cb747dF9C7788',
    decimals: 18,
  },
  [TokenSymbol.GS4]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.GS4,
    tokenAddress: '0xC20D903c9268ebaA23da0A3b2dD11eC0f468fA1c',
    decimals: 18,
  },
  [TokenSymbol.GS5]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.GS5,
    tokenAddress: '0x9600d1a7aA1b5C7FD0A3F70dEEA99613E2C2d25A',
    decimals: 18,
  },
}
