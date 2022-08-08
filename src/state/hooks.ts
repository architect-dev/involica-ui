import BigNumber from 'bignumber.js'
import { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useRefresh from 'hooks/useRefresh'
import { getFormattedBigNumber, epochEndTimestamp, epochThawTimestamp } from 'utils'
import {
  fetchFarmsPublicDataAsync,
  fetchExpeditionUserDataAsync,
  fetchExpeditionPublicDataAsync,
} from './actions'
import { State, Farm, ElevationInfo } from './types'
import { BN_ZERO, Elevation, elevationUtils, SummitPalette } from '../config/constants/types'
import { fetchPricesAsync } from './prices'
import {
  fetchElevationHelperInfoAsync,
  fetchElevationsPublicDataAsync,
  setExpeditionApr,
} from './summitEcosystem'
import { useLocation } from 'react-router-dom'
import { getFarmConfigs } from 'config/constants/farms'
import useTheme from 'hooks/useTheme'
import { updateExpeditionUserWinningsAsync } from './expedition'
import { useWeb3React } from '@web3-react/core'
import { useEverestStatsInfo, useFarmsTotalVolumes, useFetchFarmBeefyAprs } from './hooksNew'

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => {
      setMatches(media.matches)
    }
    media.addListener(listener)
    return () => media.removeListener(listener)
  }, [matches, query])

  return matches
}

export const useFetchPublicData = () => {
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync())
    dispatch(fetchExpeditionPublicDataAsync())
    dispatch(fetchElevationsPublicDataAsync())
    dispatch(fetchElevationHelperInfoAsync())
    dispatch(fetchPricesAsync())
  }, [dispatch, slowRefresh])
}
export const useCurrentTimestamp = (): number => {
  const [timestamp, setTimestamp] = useState<number>(Math.floor(Date.now() / 1000))
  useEffect(() => {
    setTimestamp(Math.floor(Date.now() / 1000))
    const interval = setInterval(() => {
      setTimestamp(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return timestamp
}

export const useCurrentTimestampOnce = (): number => {
  const [timestamp, setTimestamp] = useState<number>(Math.floor(Date.now() / 1000))
  useEffect(() => {
    setTimestamp(Math.floor(Date.now() / 1000))
  }, [])
  return timestamp
}

// Farms

export const useFarms = (): Farm[] => {
  return useSelector((state: State) => state.farms.data)
}
export const useFarmsLoaded = (): boolean => {
  return useSelector((state: State) => state.farms.farmsLoaded)
}

export const useElevationUserRoundInfo = (elevation: Elevation) => {
  return useSelector((state: State) => state.farms.elevationData[elevationUtils.toInt(elevation || Elevation.OASIS)])
}
export const useDashboardTotemBattleInfo = () => {
  const elevationData = useSelector((state: State) => state.farms.elevationData) 
  const userTotems = useSelector((state: State) => state.summitEcosystem.totems)
  return useMemo(
    () => elevationUtils.elevationOnly
      .map((elev) => {
        const userTotem = userTotems[elevationUtils.toInt(elev)]
        if (userTotem == null) return []
        return [{
          totem: userTotem,
          crowned: true,
          mult: elevationData[elevationUtils.toInt(elev)]?.totemMultipliers[userTotem] || 0
        }]
      }),
    [elevationData, userTotems]
  )
}

export const useMultiElevYieldBetInfo = () => {
  const elevationData = useSelector((state: State) => state.farms.elevationData) 
  return useMemo(
    () => {
      const elevYieldsRaw = elevationUtils.elevationOnly
        .map((elev) => {
          const { yieldContributed, potentialWinnings } = elevationData[elevationUtils.toInt(elev)] || { yieldContributed: BN_ZERO, potentialWinnings: BN_ZERO }
          return {
            elev,
            yieldContributed,
            potentialWinnings,
          }
        })
        .filter((rawYield) => rawYield.yieldContributed.plus(rawYield.potentialWinnings).isGreaterThan(0))

      const { totalYieldContributed, totalPotentialWinnings } = elevYieldsRaw.reduce((acc, elevYield) => ({
        totalYieldContributed: acc.totalYieldContributed.plus(elevYield.yieldContributed),
        totalPotentialWinnings: acc.totalPotentialWinnings.plus(elevYield.potentialWinnings),
      }), { totalYieldContributed: BN_ZERO, totalPotentialWinnings: BN_ZERO})

      const elevYieldsBreakdown = elevYieldsRaw.map((rawYield, index) => ({
        title: rawYield.elev,
        elevation: true,
        key: elevationUtils.toInt(rawYield.elev),
        perc: elevYieldsRaw[index].yieldContributed.times(100).div(totalYieldContributed).toNumber(),
        val: `${getFormattedBigNumber(elevYieldsRaw[index].yieldContributed)} SUMMIT`,
      }))

      return {
        elevYieldsBreakdown,
        totalYieldContributed,
        totalPotentialWinnings
      }
    },
    [elevationData]
  )
}

export const useAllElevationsClaimable = () => {
  const elevationData = useSelector((state: State) => state.farms.elevationData) 
  return useMemo(
    () => {
      const elevationsClaimable = elevationUtils.all
        .map((elevation) => ({
          elevation,
          claimable: (elevationData[elevationUtils.toInt(elevation)]?.claimable || BN_ZERO) as BigNumber,
          claimableBonus: (elevationData[elevationUtils.toInt(elevation)]?.claimableBonus || BN_ZERO) as BigNumber
        }))
        .filter((rawClaimable) => rawClaimable.claimable.isGreaterThan(0))

      const totalClaimable = elevationsClaimable
        .reduce((acc, elevClaimable) => acc.plus(elevClaimable.claimable), BN_ZERO)
      const totalClaimableBonus = elevationsClaimable
        .reduce((acc, elevClaimable) => acc.plus(elevClaimable.claimableBonus), BN_ZERO)

      const claimableBreakdown = elevationsClaimable.map((rawClaimable, index) => ({
        title: rawClaimable.elevation,
        elevation: true,
        key: elevationUtils.toInt(rawClaimable.elevation),
        perc: elevationsClaimable[index].claimable.times(100).div(totalClaimable).toNumber(),
        val: `${getFormattedBigNumber(elevationsClaimable[index].claimable)} SUMMIT`,
        bonusVal: elevationsClaimable[index].claimableBonus.isGreaterThan(0) ? `+${getFormattedBigNumber(elevationsClaimable[index].claimableBonus)} BONUS` : null,
      }))

      return {
        elevationsClaimable,
        totalClaimable,
        totalClaimableBonus,
        claimableBreakdown,
      }
    },
    [elevationData]
  )
}

export const useMultiElevStaked = () => {
  const { totalTVL, elevTVL } = useUserTVLs()
  return useMemo(
    () => {
      const tvlContributions = Object.entries(elevTVL)
        .filter(([_, tvl]) => tvl.isGreaterThan(0))
        .map(([elevation, tvl]) => ({
          title: elevation,
          elevation: true,
          key: elevationUtils.toInt(elevation as Elevation),
          perc: tvl.times(100).div(totalTVL).toNumber(),
          val: `$${tvl.toFixed(2)} (${tvl.times(100).div(totalTVL).toFixed(1)}%)`,
        }))

      return {
        totalTVL,
        tvlContributions,
      }
    },
    [totalTVL, elevTVL]
  )
}

// Expeditions

export const useExpeditionFetching = () => {
  const { account } = useWeb3React()
  const { slowRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchExpeditionPublicDataAsync())
      dispatch(fetchExpeditionUserDataAsync(account))
      dispatch(updateExpeditionUserWinningsAsync(account))
    }
  }, [account, dispatch, slowRefresh])
}

export const useExpeditionInfo = () => useSelector((state: State) => state.expedition.data)
export const useExpeditionUserData = () => useSelector((state: State) => state.expedition.userData)

export const useExpeditionEntered = () => {
  const { entered } = useExpeditionUserData()
  return useMemo(
    () => entered,
    [entered],
  )
}

// Prices
export const usePricesPerToken = () => {
  return useSelector((state: State) => state.prices.pricesPerToken)
}

export const useTotalValue = (elevation?: Elevation): BigNumber => {
  const farms = useFarms()
  const pricesPerToken = usePricesPerToken()
  const [tvl, setTvl] = useState(BN_ZERO)

  useEffect(
    () => {
      const volume = farms
        .reduce((accumValue, farm) => {
          const tokenPrice = pricesPerToken != null && pricesPerToken[farm.symbol] && !isNaN(pricesPerToken[farm.symbol].toNumber()) ? pricesPerToken[farm.symbol] : new BigNumber(1)
          let crossElevSupplyRaw = new BigNumber(0)
          elevationUtils.all
            .filter((elev) => elevation == null ? true : elev === elevation)
            .forEach((elev) => {
              crossElevSupplyRaw = crossElevSupplyRaw.plus(farm.elevations[elev].supply)
            })
          return accumValue.plus((crossElevSupplyRaw || new BigNumber(0)).div(new BigNumber(10).pow(farm.decimals || 18)).times(tokenPrice))
        }, new BigNumber(0))
      
        
      if (isNaN(volume.toNumber())) {
        return
      }
      setTvl(volume)
    },
    [farms, pricesPerToken, elevation]
  )

  return tvl
}

export const useUserTVLs = () => {
  const farms = useFarms()
  const pricesPerToken = usePricesPerToken()

  return useMemo(
    () => {
      let totalTVL = BN_ZERO
      const elevTVL = {
        [Elevation.OASIS]: BN_ZERO,
        [Elevation.PLAINS]: BN_ZERO,
        [Elevation.MESA]: BN_ZERO,
        [Elevation.SUMMIT]: BN_ZERO,
      }

      farms.forEach((farm) => {
        const tokenPrice = pricesPerToken != null && pricesPerToken[farm.symbol] ? pricesPerToken[farm.symbol] : new BigNumber(1)
        const bnDecimals = new BigNumber(10).pow(farm.decimals || 18)
        elevationUtils.all.forEach((elevation) => {
          const staked = farm.elevations[elevation]?.stakedBalance || BN_ZERO
          if (staked.isEqualTo(0)) return
          const value = staked.div(bnDecimals).times(tokenPrice)
          totalTVL = totalTVL.plus(value)
          elevTVL[elevation] = elevTVL[elevation].plus(value)
        })
      })

      return {
        totalTVL,
        elevTVL,
      }
    },
    [farms, pricesPerToken]
  )
}

// Prices

export const useSummitEnabled = () => useSelector((state: State) => state.summitEcosystem.summitEnabled)

export const useElevationInfo = (elevation: Elevation): ElevationInfo | null => {
  return useSelector(
    (state: State) =>
      state.summitEcosystem.elevationsInfo[elevationUtils.elevationToElevationDataIndex(elevation)] || null,
  )
}

export const useSingleFarmSelected = (): string | null => {
  const location = useLocation()
  const farmConfigs = getFarmConfigs()

  return useMemo(() => {
    const pathSplit = location.pathname.split('/')
    const lpLabel = pathSplit[2]
    if (lpLabel == null) return null

    const singleFarm = farmConfigs.find(
      (farm) => `${farm.symbol.toLowerCase()}` === lpLabel,
    )

    return singleFarm != null ? singleFarm.symbol : null
  }, [location, farmConfigs])
}

export const useSelectedElevation = (): Elevation | null => {
  const location = useLocation()

  return useMemo(() => {
    const keyPath = location.pathname.split('/')[1]
    switch (keyPath) {
      case 'oasis':
        return Elevation.OASIS
      case 'plains':
        return Elevation.PLAINS
      case 'mesa':
        return Elevation.MESA
      case 'summit':
        return Elevation.SUMMIT
      case 'expedition':
        return Elevation.EXPEDITION
      default:
        return null
    }
  }, [location])
}

export const useIsRoadmap = () => {
  const location = useLocation()

  return useMemo(
    () => location.pathname.split('/')[1] === 'roadmap',
    [location]
  )
}

export const useTotemSelectionPending = (): boolean => {
  return useSelector((state: State) => state.summitEcosystem.pendingTotemSelection)
}

// HISTORICAL WINNERS
export const useTotemHistoricalData = (
  elevation: Elevation,
): { recentWinners: number[]; recentWinningsMultipliers: number[]; winsAccum: number[], winningNumberDrawn: number | null } => {
  const elevationInfo = useElevationInfo(elevation)
  return useMemo(() => {
    if (elevationInfo == null || elevation === Elevation.OASIS)
      return {
        recentWinners: [],
        recentWinningsMultipliers: [],
        winsAccum: [],
        winningNumberDrawn: null,
      }
      
    return {
      recentWinners: elevationInfo.prevWinners.slice(0, Math.min(10, elevationInfo.roundNumber + 1)),
      recentWinningsMultipliers: elevationInfo.prevWinningsMultipliers.slice(
        0,
        Math.min(6, elevationInfo.roundNumber + 1),
      ),
      winsAccum: elevationInfo.totemWinAcc,
      winningNumberDrawn: elevationInfo.winningNumberDrawn,
    }
  }, [elevationInfo, elevation])
}

// THEME
export const usePageForcedDarkMode = () => {
  const elevation = useSelectedElevation()
  const { setPageForcedDark } = useTheme()

  useEffect(() => setPageForcedDark(elevation === Elevation.EXPEDITION), [elevation, setPageForcedDark])
}


// EPOCHS
export const useEpochVariableTickTimestamp = (epoch: number, toEpochEnd = false) => {
  const currentTimestamp = useCurrentTimestamp()
  return useMemo(() => {
    const maxTimestamp = toEpochEnd ? epochEndTimestamp(epoch) : epochThawTimestamp(epoch)
    if (currentTimestamp > maxTimestamp) return maxTimestamp
    if ((maxTimestamp - currentTimestamp) > (24 * 3600)) return (Math.floor(currentTimestamp / 3600) * 3600) + 1800
    if ((maxTimestamp - currentTimestamp) > 3600) return (Math.floor(currentTimestamp / 60) * 60) + 30
    return currentTimestamp
  }, [currentTimestamp, epoch, toEpochEnd])
}


// UI
export const useCurrentSummitPalette = (): SummitPalette => {
  const location = useLocation()

  return useMemo(() => {
    const keyPath = location.pathname.split('/')[1]
    switch (keyPath) {
      case 'everest':
        return SummitPalette.EVEREST
      case 'oasis':
        return SummitPalette.OASIS
      case 'plains':
        return SummitPalette.PLAINS
      case 'mesa':
        return SummitPalette.MESA
      case 'summit':
        return SummitPalette.SUMMIT
      case 'expedition':
        return SummitPalette.EXPEDITION
      default:
        return SummitPalette.BASE
    }
  }, [location])
}


// EXPED APR


export const useFetchExpeditionApr = () => {
  const farmsVolumes = useFarmsTotalVolumes()
  const farmsAprs = useFetchFarmBeefyAprs()
  const pricesPerToken = usePricesPerToken()
  const { totalSummitLocked } = useEverestStatsInfo()
  const dispatch = useDispatch()

  useEffect(
      () => {
        if (farmsAprs == null) return
        const totalUsd = Object.entries(farmsAprs).reduce((runningUsd, [symbol, apr]) => {
            return runningUsd + (farmsVolumes[symbol] != null ?
                farmsVolumes[symbol].times(apr).dividedBy(new BigNumber(10).pow(18)) :
                BN_ZERO
            ).times(pricesPerToken[symbol]).toNumber()
          },
          0
        )
        const summitLockedValue = totalSummitLocked.dividedBy(new BigNumber(10).pow(18)).times(pricesPerToken.SUMMIT).toNumber()
        if (totalUsd > 0 && summitLockedValue >= 0) {
          dispatch(setExpeditionApr((totalUsd / summitLockedValue) * 100 * 0.8))
        }
      },
      [farmsVolumes, farmsAprs, pricesPerToken, totalSummitLocked, dispatch]
  )
}

