import BigNumber from 'bignumber.js'
import {
  multicall,
  abi,
  groupBy,
  getCartographerAddress,
  retryDecorator,
  getSubCartographerAddress,
  groupByAndMap,
} from 'utils/'
import { BN_ZERO, Elevation, elevationUtils } from '../../config/constants/types'
import { SECONDS_PER_YEAR } from 'config'
import { getFarmConfigs } from 'config/constants'
import { Farm } from 'state/types'
import { merge } from 'lodash'


export const fetchFarms = async () => {
  const farmConfigs = getFarmConfigs()
  const cartographerAddress = getCartographerAddress()

  const fetchFarmData = async (farmConfig): Promise<Farm> => {
    const { farmToken } = farmConfig

    /*
      TOKEN
        . alloc emission mult
        . elev emission mult
        . deposit fee
        . fairness tax
        . summit per second
      OASIS
        . pool info (live & supply)
      ELEVATIONS
        . pool info (live & launched & supply)
    */

    const [
      [alloc, allocEmissionMultiplier, oasisEmissionMultiplier, plainsEmissionMultiplier, mesaEmissionMultiplier, summitEmissionMultiplier, tokenDepositFee, tokenWithdrawalTax, summitPerSecond],
      [oasisPoolInfo],
      [plainsPoolInfo],
      [mesaPoolInfo],
      [summitPoolInfo],
    ] = await Promise.all([
      await multicall(abi.cartographer, [
        {
          address: cartographerAddress,
          name: 'tokenAlloc',
          params: [farmToken],
        },
        {
          address: cartographerAddress,
          name: 'tokenAllocEmissionMultiplier',
          params: [farmToken],
        },
        {
          address: cartographerAddress,
          name: 'tokenElevationEmissionMultiplier',
          params: [farmToken, 0],
        },
        {
          address: cartographerAddress,
          name: 'tokenElevationEmissionMultiplier',
          params: [farmToken, 1],
        },
        {
          address: cartographerAddress,
          name: 'tokenElevationEmissionMultiplier',
          params: [farmToken, 2],
        },
        {
          address: cartographerAddress,
          name: 'tokenElevationEmissionMultiplier',
          params: [farmToken, 3],
        },
        {
          address: cartographerAddress,
          name: 'tokenDepositFee',
          params: [farmToken],
        },
        {
          address: cartographerAddress,
          name: 'tokenWithdrawalTax',
          params: [farmToken],
        },
        {
          address: cartographerAddress,
          name: 'summitPerSecond',
        },
      ]),
      ...elevationUtils.all.map(async (elev) => multicall(
        elev === Elevation.OASIS ? abi.cartographerOasis : abi.cartographerElevation, [{
          address: getSubCartographerAddress(elev),
          name: 'poolInfo',
          params: [farmToken],
      }])),
    ])

    const elevSummitPerYear = groupByAndMap(
      elevationUtils.all,
      (elev) => elev,
      (elev) => {
        const elevEmissionMultiplier = elev === Elevation.OASIS ?
          oasisEmissionMultiplier :
          elev === Elevation.PLAINS ?
            plainsEmissionMultiplier :
            elev === Elevation.MESA ?
              mesaEmissionMultiplier :
              summitEmissionMultiplier
        return new BigNumber(summitPerSecond)
          .times(SECONDS_PER_YEAR)
          .times(new BigNumber(elevEmissionMultiplier))
          .times(new BigNumber(allocEmissionMultiplier))
          .div(new BigNumber(10).pow(24))
      }
    )

    // const summitPerYear = new BigNumber(summitPerSecond)
    //   .times(SECONDS_PER_YEAR)
    //   .times(new BigNumber(elevEmissionMultiplier))
    //   .times(new BigNumber(allocEmissionMultiplier))
    //   .div(new BigNumber(10).pow(24))

    const elevationsInfo = {
      [Elevation.OASIS]: {
        live: oasisPoolInfo.live,
        launched: true,
        supply: new BigNumber(oasisPoolInfo.supply._hex),
        summitPerYear: oasisPoolInfo.live ? elevSummitPerYear[Elevation.OASIS] : BN_ZERO,
      },
      [Elevation.PLAINS]: {
        live: plainsPoolInfo.live,
        launched: plainsPoolInfo.launched,
        supply: new BigNumber(plainsPoolInfo.supply._hex),
        summitPerYear: plainsPoolInfo.live ? elevSummitPerYear[Elevation.PLAINS] : BN_ZERO,
      },
      [Elevation.MESA]: {
        live: mesaPoolInfo.live,
        launched: mesaPoolInfo.launched,
        supply: new BigNumber(mesaPoolInfo.supply._hex),
        summitPerYear: mesaPoolInfo.live ? elevSummitPerYear[Elevation.MESA] : BN_ZERO,
      },
      [Elevation.SUMMIT]: {
        live: summitPoolInfo.live,
        launched: summitPoolInfo.launched,
        supply: new BigNumber(summitPoolInfo.supply._hex),
        summitPerYear: summitPoolInfo.live ? elevSummitPerYear[Elevation.SUMMIT] : BN_ZERO,
      }
    }

    return {
      ...farmConfig,
      allocation: new BigNumber(alloc[0]._hex).toNumber(),
      elevations: merge({}, farmConfig.elevations, elevationsInfo),
      depositFeeBP: new BigNumber(tokenDepositFee).toNumber(),
      taxBP: new BigNumber(tokenWithdrawalTax).toNumber(),
    }
  }

  const decoratedFetchFarmData = retryDecorator(fetchFarmData)

  const farmsData = (await Promise.all(farmConfigs.map(decoratedFetchFarmData))).filter((fetchFarmDataResult: any) => {
    if (fetchFarmDataResult.err) {
      console.error(`fetchFarms: ${fetchFarmDataResult.err}`)
      return false
    }
    return true
  }) as Farm[]

  return groupBy(farmsData, (farm) => farm.symbol)
}
