import BigNumber from 'bignumber.js'
import { BN_ZERO, getPriceableTokens, PriceableToken, TokenAssetType, TokenSymbol } from 'config/constants'
import {
  retryableMulticall,
  abi,
  groupByAndMap,
  getBalancer2PoolPriceOracleAddress,
  getBalancerMultiPoolPriceOracleAddress,
  ChainUsesPricingData,
} from 'utils'




/*


Example structure of a BalancerMultiPool token type

[TokenSymbol.BATTLE_OF_THE_BANDS]: {
    assetType: TokenAssetType.BalancerMultiPool,
    symbol: TokenSymbol.BATTLE_OF_THE_BANDS,
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



  

  Here is a single asset that is contained in the MultiPool above
  This is fetched so that the price of its containing multipool can be fetched in turn

  [TokenSymbol.fBNB]: {
    assetType: TokenAssetType.SingleAsset,
    symbol: TokenSymbol.fBNB,
    tokenAddress: '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454',
    decimals: 18,
  },



  */





export const fetchPricesV2 = async () => {
  const priceableTokensMap = getPriceableTokens()
  const priceableTokens = Object.values(priceableTokensMap)

  if (!ChainUsesPricingData()) {
    return groupByAndMap(
      priceableTokens,
      (token) => token.symbol,
      () => new BigNumber(1.5),
    )
  }

  // Balancer Price Oracle here: 0x33365E1B22BbeF5766419e19f77c15fD3E0a8Ae5
  const balancer2PoolPriceOracleAddress = getBalancer2PoolPriceOracleAddress()

  // Balancer Multi Pool Oracle (kinda): 0x20dd72Ed959b6147912C2e529F0a0C651c33c9ce
  const balancerMultiPoolPriceOracleAddress = getBalancerMultiPoolPriceOracleAddress()


  // We have broken down the tokens into these asset types. The balancer price oracle actually
  // Does a great job with everything (including balancer 2 pools and uniswap LPs) except for the multi pools.
  const {
    [TokenAssetType.Summit]: summitPriceable,
    [TokenAssetType.Everest]: everestPriceable,
    [TokenAssetType.SingleAsset]: singleAssetPriceables,
    [TokenAssetType.LP]: lpPriceables,
    [TokenAssetType.Stablecoin]: stablecoinPriceables,
    [TokenAssetType.WrappedNative]: wrappedNativePriceables,
    [TokenAssetType.Balancer2Pool]: balancer2PoolPriceables,
    [TokenAssetType.BalancerMultiPool]: balancerMultiPoolPriceables,
    [TokenAssetType.SolidlyLP]: solidlyLpPriceables,
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
    [TokenAssetType.Balancer2Pool]: [] as PriceableToken[],
    [TokenAssetType.BalancerMultiPool]: [] as PriceableToken[],
    [TokenAssetType.SolidlyLP]: [] as PriceableToken[],
  })

  // These are tokens / LPS that can be priced directly by the balancer oracle
  const balancerDirectPriceables = [
    ...singleAssetPriceables,
    ...lpPriceables,
    ...stablecoinPriceables,
    ...wrappedNativePriceables,
    ...balancer2PoolPriceables,
  ]

  // This is kinda dirty, but these are all the tokens that are used to price the multi pools
  const balancerMultiPoolContainedPriceableOptions = [
    ...singleAssetPriceables,
    ...stablecoinPriceables,
    ...wrappedNativePriceables
  ]

  // This gets the prices that can be fetched directly from the balancer oracle
  const balancerDirectCalls = balancerDirectPriceables.map((priceable) => ({
    address: balancer2PoolPriceOracleAddress,
    name: 'calculateAssetPrice',
    params: [priceable.tokenAddress || priceable.lpAddress],
  }))

  const balancerDirectRes = await retryableMulticall(abi.Balancer2PoolPriceOracle, balancerDirectCalls, 'fetchPricesV2BalancerDirect')


  const balancerDirectPricesPerToken = groupByAndMap(
    balancerDirectPriceables,
    (_, index) => balancerDirectPriceables[index].symbol,
    (_, index) => new BigNumber(balancerDirectRes[index]).div(new BigNumber(10).pow(18))
  )


  // BALANCER MULTI POOL

  // This fetches info about the pool from the balancer multi pool oracle
  // This includes the token address of all the containing tokens
  // As well as the balances of these tokens in the pool
  const balancerMultiPoolPriceOracleCalls = [...balancerMultiPoolPriceables, ...summitPriceable].map((balancerMultiPoolToken) => [
    {
      address: balancerMultiPoolPriceOracleAddress,
      name: 'getPoolTokens',
      params: [balancerMultiPoolToken.balancerMultiPoolInfo.poolId],
    },
  ])

  const balancerMultiPoolPriceablesRes = await retryableMulticall(abi.BalancerMultiPoolPriceOracle, balancerMultiPoolPriceOracleCalls.flat(), 'fetchPricesV2BalancerMultiPoolTokens')

  // You also need to know the total supply of the balancer multi pool token
  // We effectively calculate the price of the whole pool, then divide it by the number
  // Of BPT receipt tokens that exist
  const balancerMultiPoolTokenSuppliesCalls = [...balancerMultiPoolPriceables, ...summitPriceable].map((balancerMultiPoolToken) => [
    {
      address: balancerMultiPoolToken.tokenAddress,
      name: 'totalSupply',
    },
  ])
  const balancerMultiPoolTokenSuppliesRes = await retryableMulticall(abi.ERC20, balancerMultiPoolTokenSuppliesCalls.flat(), 'fetchPricesV2BalancerMultiPoolSupply')

  const balancerMultiPoolPricesPerToken = groupByAndMap(
    [...balancerMultiPoolPriceables, ...summitPriceable],
    (_, index) => [...balancerMultiPoolPriceables, ...summitPriceable][index].symbol,
    (priceable, index) => {


      // This is UGLY because its been worked into a system that it wasn't designed for
      // But essentially, SUMMIT is 60% of the pool, USDC 20%, and FTM 40%

      // SUMMIT is priced by determining the amount of USDC + FTM in the pool, then dividing that
      // by 0.4 to get the full price of the pool.

      // Then that can be multiplied by 0.6 to determine the value of the SUMMIT in the pool
      // Which can finally be divided by the total amount of SUMMIt in the pool

      // I think this can be improved if it is done in a standalone way

      // SUMMIT TOKEN
      if (priceable.symbol === 'SUMMIT') {
        let summitBalanceInPool
        const containingTokenValue = balancerMultiPoolPriceablesRes[index][1]
          .map((containingTokenBalance) => new BigNumber(containingTokenBalance._hex))
          .map((containingTokenBalance, containingTokenIndex) => {
            const indexToken = balancerMultiPoolPriceablesRes[index][0][containingTokenIndex]
            if (indexToken === priceable.tokenAddress) {
              summitBalanceInPool = containingTokenBalance
              return BN_ZERO
            }
            const indexPriceable = balancerMultiPoolContainedPriceableOptions.find((priceableOption) => priceableOption.tokenAddress.toLowerCase() === indexToken.toLowerCase())
            return new BigNumber(containingTokenBalance.div(new BigNumber(10).pow(indexPriceable.decimals)).times(balancerDirectPricesPerToken[indexPriceable.symbol]))
          })
          .reduce((acc, containedTokenValue) => acc.plus(containedTokenValue), new BigNumber(0))
          .times(new BigNumber(10).pow(18)).dividedBy(0.4).times(0.6)
        return containingTokenValue.dividedBy(summitBalanceInPool)
      }


      // This is effectively doing the same as above, but its a bit simpler as we are just
      // Dividing by the amount of BPT receipt tokens that exist instead of the SUMMIT token balance in the pool


      // MULTI POOL LP TOKENS
      let combinedWeight = 0
      let combinedVolume = BN_ZERO
      const { pricingTokens } = priceable.balancerMultiPoolInfo
      const pricingTokensList = pricingTokens.map((pricingToken) => pricingToken.token)

      balancerMultiPoolPriceablesRes[index][1]
        .map((containingTokenBalance) => new BigNumber(containingTokenBalance._hex))
        .forEach((containingTokenBalance, containingTokenIndex) => {
          const indexToken = balancerMultiPoolPriceablesRes[index][0][containingTokenIndex]
          const indexPriceable = balancerMultiPoolContainedPriceableOptions.find((priceableOption) => priceableOption.tokenAddress.toLowerCase() === indexToken.toLowerCase())
          const indexTokenPriceableIndex = pricingTokensList.indexOf(indexPriceable.symbol)

          // Exit if token isn't part of pricing calculation
          if (indexTokenPriceableIndex === -1) return

          // Add weight and volume to accumulators
          combinedWeight += pricingTokens[indexTokenPriceableIndex].weight
          const volume = new BigNumber(containingTokenBalance.div(new BigNumber(10).pow(indexPriceable.decimals)).times(balancerDirectPricesPerToken[indexPriceable.symbol]))
          combinedVolume = combinedVolume.plus(volume)
        })

      const tokenSupply = new BigNumber(balancerMultiPoolTokenSuppliesRes[index]).div(new BigNumber(10).pow(18))
      return combinedVolume.times(100).div(combinedWeight).div(tokenSupply)
    },
  )



  // SOLIDLY PRICES PER TOKEN
  const solidlyLpsMetadataCalls = solidlyLpPriceables.map((solidlyLpPriceable) => [{
    address: solidlyLpPriceable.lpAddress,
    name: 'totalSupply',
  }, {
    address: solidlyLpPriceable.lpAddress,
    name: 'metadata',
  }])
  const solidlyLpsMetadataRes = await retryableMulticall(abi.SolidlyLP, solidlyLpsMetadataCalls.flat(), 'fetchPricesV2_SolidlyLpMetadata')


  const solidlyLpPricesPerToken = groupByAndMap(
    solidlyLpPriceables,
    (solidlyLpPriceable) => solidlyLpPriceable.symbol,
    (priceable, index) => {

      if (solidlyLpsMetadataRes == null) return BN_ZERO

      const totalSupply = new BigNumber(solidlyLpsMetadataRes[index * 2 + 0][0]._hex)
      const dec0 = new BigNumber(solidlyLpsMetadataRes[index * 2 + 1].dec0._hex)
      const dec1 = new BigNumber(solidlyLpsMetadataRes[index * 2 + 1].dec1._hex)
      const r0 = new BigNumber(solidlyLpsMetadataRes[index * 2 + 1].r0._hex).div(dec0)
      const r1 = new BigNumber(solidlyLpsMetadataRes[index * 2 + 1].r1._hex).div(dec1)
      const volume0 = r0.times(balancerDirectPricesPerToken[priceable.solidlyLpContainingTokens[0]])
      const volume1 = r1.times(balancerDirectPricesPerToken[priceable.solidlyLpContainingTokens[1]])

      return volume0.plus(volume1).div(totalSupply.div(new BigNumber(10).pow(18)))
    }
  )




  // EVEREST price = SUMMIT price
  const everestPricePerToken = {
    [everestPriceable[0].symbol]: balancerMultiPoolPricesPerToken[TokenSymbol.SUMMIT].dividedBy(2)
  }


  // Combine and return
  return {
    ...balancerDirectPricesPerToken,
    ...balancerMultiPoolPricesPerToken,
    ...solidlyLpPricesPerToken,
    ...everestPricePerToken,
  }
}
