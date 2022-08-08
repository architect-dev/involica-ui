import axios from 'axios'
import BigNumber from 'bignumber.js'
import { BN_ZERO, getPriceableTokens, PriceableToken, TokenAssetType } from 'config/constants'
import {
  retryableMulticall,
  abi,
  groupByAndMap,
  getNativePeggedLpAddress,
  getPeggedTokenAddress,
  chunkArray,
  getWrappedNativeTokenAddress,
} from 'utils'








export const fetchPricesV1 = async () => {
  const priceableTokensMap = getPriceableTokens()
  const priceableTokens = Object.values(priceableTokensMap)
    
  const nativePeggedLpAddress = getNativePeggedLpAddress()
  const nativeAddress = getWrappedNativeTokenAddress()
  const peggedAddress = getPeggedTokenAddress()
  const nativeErc20Calls = [
    {
      address: nativePeggedLpAddress,
      name: 'slot0',
    },
    {
      address: nativeAddress,
      name: 'decimals',
    },
    {
      address: peggedAddress,
      name: 'decimals',
    },
  ]
  const erc20Res = await retryableMulticall(
    abi.ERC20,
    nativeErc20Calls,
    'fetchPricesV2_nativeToken',
  )

  if (erc20Res == null) return null

  const [
    slot0,
    nativeDecimals,
    peggedDecimals,
  ] = erc20Res

  // const nativeAmount = new BigNumber(nativeBalanceInNativeStableLp).div(new BigNumber(10).pow(nativeDecimals))
  // const peggedAmount = new BigNumber(peggedBalanceInNativeStableLp).div(new BigNumber(10).pow(peggedDecimals))

  // const nativePrice = nativeAmount.div(peggedAmount)
  const sqrtPrice = new BigNumber(slot0.sqrtPriceX96._hex)
  const decDiff = Math.abs(nativeDecimals - peggedDecimals)
  const nativePrice = sqrtPrice.times(sqrtPrice).div(new BigNumber(2).pow(192)).times(new BigNumber(10).pow(decDiff))


  const {
    [TokenAssetType.Summit]: summitPriceable,
    [TokenAssetType.Everest]: everestPriceable,
    [TokenAssetType.SingleAsset]: singleAssetPriceables,
    [TokenAssetType.LP]: lpPriceables,
    [TokenAssetType.Stablecoin]: stablecoinPriceables,
    [TokenAssetType.WrappedNative]: wrappedNativePriceables,
    [TokenAssetType.SolidlyLP]: stableLpPriceables,
    [TokenAssetType.CurveLP]: curveLpPriceables,
  } = priceableTokens.reduce((acc, priceableToken) => {
    acc[priceableToken.assetType].push(priceableToken)
    return acc
  }, {
    [TokenAssetType.Summit]: [] as PriceableToken[],
    [TokenAssetType.Everest]: [] as PriceableToken[],
    [TokenAssetType.SingleAsset]: [] as PriceableToken[],
    [TokenAssetType.LP]: [] as PriceableToken[],
    [TokenAssetType.Stablecoin]: [] as PriceableToken[],
    [TokenAssetType.WrappedNative]: [] as PriceableToken[],
    [TokenAssetType.SolidlyLP]: [] as PriceableToken[],
    [TokenAssetType.CurveLP]: [] as PriceableToken[],
  })

  // SINGLE ASSETS AND LPS
  const fetchableTokens: PriceableToken[] = [...summitPriceable, ...singleAssetPriceables, ...lpPriceables]
  const fetchableCalls = fetchableTokens.map((fetchableToken) => [
    {
      address: fetchableToken.tokenAddress || fetchableToken.lpAddress,
      name: 'balanceOf',
      params: [fetchableToken.lpAddress],
    },
    {
      address: nativeAddress,
      name: 'balanceOf',
      params: [fetchableToken.lpAddress],
    },
    {
      address: fetchableToken.lpAddress,
      name: 'totalSupply',
    },
    {
      address: fetchableToken.tokenAddress || fetchableToken.lpAddress,
      name: 'decimals',
    },
  ])
  const priceableRes = await retryableMulticall(abi.ERC20, fetchableCalls.flat(), 'fetchPricesV1_FetchTokenInfo')

  const priceableResChunks = chunkArray(4, priceableRes)

  const fetchablePricesPerToken = groupByAndMap(
    priceableResChunks,
    (_, index) => fetchableTokens[index].symbol,
    (_, index) => {
    const fetchableToken = fetchableTokens[index]
    const [
      tokenBalanceInLp,
      nativeBalanceInLp,
      lpTotalSupply,
      tokenDecimals,
    ]: any[] = priceableResChunks[index]

    if (fetchableToken.assetType === TokenAssetType.LP) {
      // LP
      const fullNativeAmountInLp = new BigNumber(nativeBalanceInLp).times(2)
      const fullValueInLp = nativePrice.times(fullNativeAmountInLp)
      return fullValueInLp.div(new BigNumber(lpTotalSupply))
    }
    // SINGLE ASSET
    const nativeBalanceInLpDecCorrected = new BigNumber(nativeBalanceInLp).div(new BigNumber(10).pow(18))
    const tokenBalanceInLpDecCorrected = new BigNumber(tokenBalanceInLp).div(new BigNumber(10).pow(tokenDecimals))
    const tokenPriceVsNative = nativeBalanceInLpDecCorrected.div(tokenBalanceInLpDecCorrected)
    return nativePrice.times(tokenPriceVsNative)
  })


  // STABLE COINS
  const stableCoinPricesPerToken = groupByAndMap(
    stablecoinPriceables,
    (_, index) => stablecoinPriceables[index].symbol,
    (_) => new BigNumber(1),
  )

  // WRAPPED NATIVE
  const wrappedNativePricesPerToken = groupByAndMap(
    wrappedNativePriceables,
    (_, index) => wrappedNativePriceables[index].symbol,
    (_) => nativePrice,
  )

  const pricesPerToken = {
    ...fetchablePricesPerToken,
    ...stableCoinPricesPerToken,
    ...wrappedNativePricesPerToken,
  }

  // STABLE LPS
  const stableLpCalls = stableLpPriceables.map((stableLpPriceable) => {
    const token0Address = priceableTokensMap[stableLpPriceable.solidlyLpContainingTokens[0]].tokenAddress
    const token1Address = priceableTokensMap[stableLpPriceable.solidlyLpContainingTokens[1]].tokenAddress
    return [
      {
        address: stableLpPriceable.lpAddress,
        name: 'totalSupply',
      },
      {
        address: token0Address,
        name: 'balanceOf',
        params: [stableLpPriceable.lpAddress],
      },
      {
        address: token1Address,
        name: 'balanceOf',
        params: [stableLpPriceable.lpAddress],
      },
    ]
  })
  const solidlyLpsMetadataRes = await retryableMulticall(abi.ERC20, stableLpCalls.flat(), 'fetchPricesV2_SolidlyLpMetadata')
  
  const stableLpResChunks = solidlyLpsMetadataRes != null ? chunkArray(3, solidlyLpsMetadataRes) : null



  const stableLpPricesPerToken = groupByAndMap(
    stableLpPriceables,
    (stableLpPriceable) => stableLpPriceable.symbol,
    (priceable, index) => {

      if (stableLpResChunks == null) return BN_ZERO
      const [
        totalSupplyRaw,
        token0BalRaw,
        token1BalRaw,
      ] = stableLpResChunks[index]

      const totalSupply = new BigNumber(totalSupplyRaw)
      const dec0 = new BigNumber(10).pow(priceableTokensMap[priceable.solidlyLpContainingTokens[0]].decimals)
      const dec1 = new BigNumber(10).pow(priceableTokensMap[priceable.solidlyLpContainingTokens[1]].decimals)
  
      const r0 = new BigNumber(token0BalRaw[0]._hex).div(dec0)
      const r1 = new BigNumber(token1BalRaw[0]._hex).div(dec1)
      const volume0 = r0.times(pricesPerToken[priceable.solidlyLpContainingTokens[0]])
      const volume1 = r1.times(pricesPerToken[priceable.solidlyLpContainingTokens[1]])

      return volume0.plus(volume1).div(totalSupply.div(new BigNumber(10).pow(18)))
    }
  )

  const everestPricePerToken = {
    [everestPriceable[0].symbol]: fetchablePricesPerToken[summitPriceable[0].symbol]
  }


  // CURVE LP PRICES
  const curveLpCalls = curveLpPriceables.map((curveLpPriceable) => ({
    address: curveLpPriceable.lpAddress,
    name: 'totalSupply',
  }))
  const curveLpSuppliesRes = await retryableMulticall(abi.ERC20, curveLpCalls, 'fetchPricesV2_curveLpSupplies')
  
  const curveRes = await axios.get(`https://api.curve.fi/api/getPools/polygon/crypto`)
  const curveLpPricesPerToken = groupByAndMap(
    curveLpPriceables,
    (curveLpPriceable) => curveLpPriceable.symbol,
    (priceable, index) => {
      if (curveLpSuppliesRes == null || curveRes?.data?.data?.poolData == null) return new BigNumber(2)
      const supply = new BigNumber(curveLpSuppliesRes[index][0]._hex).dividedBy(new BigNumber(10).pow(priceable.decimals))
      const curvePoolData = curveRes.data.data.poolData.find((pool) => pool.lpTokenAddress.toLowerCase() === priceable.lpAddress.toLowerCase())
      if (curvePoolData == null) return new BigNumber(2)
      return new BigNumber(curvePoolData.usdTotal).dividedBy(supply)
    }
  )

  return {
    ...pricesPerToken,
    ...stableLpPricesPerToken,
    ...everestPricePerToken,
    ...curveLpPricesPerToken,
  }
}
