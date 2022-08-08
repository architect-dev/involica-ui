import { createSelector } from "@reduxjs/toolkit";
import { stateToFarms, stateToFarmTypeFilter, stateToFarmLiveFilter, stateToGlacierTotalFrozenSummit, stateToTokenInfos, stateToFarmsElevationData, stateToLifetimeSummitBonuses, stateToLifetimeSummitWinnings, stateToFarmsUserDataLoaded, stateToExpeditionSummitWinnings, stateToExpeditionUsdcWinnings, stateToFarmsElevationsData, stateToSummitPrice, stateToPricesPerToken } from "./base";
import { getFarmInteracting, getFormattedBigNumber, sumBigNumbersByKey } from "utils"
import { BN_ZERO, Elevation, elevationUtils } from "config/constants";
import { useSelector } from "./utils";
import BigNumber from "bignumber.js";
import { orderBy } from "lodash";



const selectFarmFilters = createSelector(
    stateToFarmTypeFilter,
    stateToFarmLiveFilter,
    (farmType, liveFarms) => ({
        farmType,
        liveFarms,
    })
)
export const useFarmFilters = () => useSelector(selectFarmFilters)


const selectStakedUnstakedFarmSymbols = createSelector(
    stateToFarms,
    (farms) => {
        const staked: string[] = []
        const unstaked: string[] = []

        farms.forEach((farm) => {
            if (getFarmInteracting(farm)) {
                staked.push(farm.symbol)
            } else {
                unstaked.push(farm.symbol)
            }
        })

        return [staked, unstaked]
    }
)
export const useStakedUnstakedFarmSymbols = () => useSelector(selectStakedUnstakedFarmSymbols)

export const selectFarmBySymbol = createSelector(
    stateToFarms,
    (_, symbol: string) => symbol,
    (farms, symbol) => farms.find((farm) => farm.symbol === symbol)
)
export const makeSelectFarmBySymbol = () => selectFarmBySymbol

const selectFarmAndUserTokenInteractionSectionInfo = createSelector(
    stateToFarms,
    stateToTokenInfos,
    (_: any, symbol: string) => symbol,
    (_: any, _2: any, elevation: Elevation) => elevation,
    (farms, tokenInfos, symbol, elevation) => {
        const farm = farms.find((f) => f.symbol === symbol)
        const tokenInfo = tokenInfos.find((tI) => tI.symbol === symbol)
        return {
            // FARM INFO
            farmToken: farm.farmToken,
            depositFeeBP: farm.depositFeeBP,
            decimals: farm.decimals,
            taxBP: farm.taxBP,
            passthroughStrategy: farm.passthroughStrategy,
            getUrl: farm.getUrl,

            // FARM ELEVATION INFO
            elevStaked: farm.elevations[elevation]?.stakedBalance || BN_ZERO,
            elevClaimable: farm.elevations[elevation]?.claimable || BN_ZERO,

            // TOKEN INFO
            farmAllowance: tokenInfo.farmAllowance,
            walletBalance: tokenInfo.walletBalance,
        }
    }
)
export const useFarmAndUserTokenInteractionSectionInfo = (symbol: string, elevation: Elevation) => useSelector((state) => selectFarmAndUserTokenInteractionSectionInfo(state, symbol, elevation))


const selectFarmUserTokenSectionInfo = createSelector(
    stateToFarms,
    stateToTokenInfos,
    (_, symbol: string) => symbol,
    (farms, tokenInfos, symbol) => {
        const farm = farms.find((f) => f.symbol === symbol)
        const tokenInfo = tokenInfos.find((tI) => tI.symbol === symbol)
        return {
            depositFeeBP: farm.depositFeeBP,

            maxTaxBP: farm.taxBP,
            minTaxBP: Math.min(farm.taxBP, farm.native ? 0 : 50),
            currentTaxBP: tokenInfo.taxBP,
            taxResetTimestamp: tokenInfo.taxResetTimestamp,

            currentBonusBP: tokenInfo.bonusBP,
            bonusResetTimestamp: tokenInfo.bonusResetTimestamp,
        }
    }
)
export const useFarmUserTokenSectionInfo = (symbol: string) => useSelector((state) => selectFarmUserTokenSectionInfo(state, symbol))

const selectUserTokenFairnessTaxBP = createSelector(
    stateToTokenInfos,
    (_, symbol: string) => symbol,
    (tokenInfos, symbol) => {
        const tokenInfo = tokenInfos.find((tI) => tI.symbol === symbol)
        return tokenInfo.taxBP
    }
)
export const useFarmUserTokenFairnessTaxBP = (symbol: string) => useSelector((state) => selectUserTokenFairnessTaxBP(state, symbol))

export const useSummitPrice = () => useSelector((state) => state.prices.pricesPerToken?.SUMMIT)

const selectSymbolElevateModalInfo = createSelector(
    stateToFarms,
    stateToTokenInfos,
    (_: any, symbol: string) => symbol,
    (farms, tokenInfos, symbol) => {
        const farm = farms.find((f) => f.symbol === symbol)
        const tokenInfo = tokenInfos.find((tI) => tI.symbol === symbol)

        const elevLaunched = {
            [Elevation.OASIS]: false,
            [Elevation.PLAINS]: false,
            [Elevation.MESA]: false,
            [Elevation.SUMMIT]: false,
        }
        const elevStaked = {
            [Elevation.OASIS]: BN_ZERO,
            [Elevation.PLAINS]: BN_ZERO,
            [Elevation.MESA]: BN_ZERO,
            [Elevation.SUMMIT]: BN_ZERO,
        }
        elevationUtils.all.forEach((elev) => {
            elevLaunched[elev] = elev === Elevation.OASIS || farm.elevations[elev]?.launched || false
            elevStaked[elev] = farm.elevations[elev]?.stakedBalance || BN_ZERO
        })
        return {
            elevLaunched,
            elevStaked,
            decimals: farm.decimals,
            farmToken: farm.farmToken,
            depositFeeBP: farm.depositFeeBP,

            // TOKEN INFO
            farmAllowance: tokenInfo.farmAllowance,
            walletBalance: tokenInfo.walletBalance,

            name: farm.name,
            lpSource: farm.lpSource,
            allocation: farm.allocation,
            passthroughStrategy: farm.passthroughStrategy,
            getUrl: farm.getUrl,
        }
    }
)
export const useSymbolElevateModalInfo = (symbol: string) => useSelector((state) => selectSymbolElevateModalInfo(state, symbol))

const selectSymbolElevateSelectorInfo = createSelector(
    selectSymbolElevateModalInfo,
    ({ elevLaunched }) => elevLaunched
)
export const useSymbolElevateSelectorInfo = (symbol: string) => useSelector((state) => selectSymbolElevateSelectorInfo(state, symbol))



const selectAllElevationsClaimable = createSelector(
    stateToFarmsElevationsData,
    (elevationsData) => {
        return elevationUtils.all
            .map((elevation) => ({
                elevation,
                claimable: (elevationsData[elevationUtils.toInt(elevation)]?.claimable || BN_ZERO) as BigNumber,
                claimableBonus: (elevationsData[elevationUtils.toInt(elevation)]?.claimableBonus || BN_ZERO) as BigNumber
            }))
            .filter((rawClaimable) => rawClaimable.claimable.isGreaterThan(0))
    }
)
export const useAllElevationsClaimable = () => useSelector(selectAllElevationsClaimable)


const selectFarmsWithClaimable = createSelector(
    stateToFarms,
    (_, elevation: Elevation) => elevation,
    (farms, elevation) => farms
        .map((farm) => ({
            symbol: farm.symbol,
            claimable: farm.elevations[elevation]?.claimable || BN_ZERO,
            claimableBonus: farm.elevations[elevation]?.claimableBonus || BN_ZERO,
        }))
        .filter((farm) => farm.claimable.isGreaterThan(0))
)
const selectElevationWinningsContributions = createSelector(
    selectFarmsWithClaimable,
    (farmsWithClaimable) => {
        const sortedClaimables = orderBy(
            farmsWithClaimable,
            (farmWithClaimable) => farmWithClaimable.claimable.toNumber(),
            'desc'
        )

        const contributionSum = sortedClaimables.reduce((acc, sortedClaimable) => acc.plus(sortedClaimable.claimable), BN_ZERO)

        const winningsContributions = sortedClaimables.map((sortedClaimable, index) => ({
            token: true,
            title: sortedClaimable.symbol,
            key: index,
            perc: sortedClaimable.claimable.times(100).div(contributionSum).toNumber(),
            val: `${getFormattedBigNumber(sortedClaimable.claimable)} SUMMIT`,
            bonusVal: sortedClaimable.claimableBonus.isGreaterThan(0) ? `+${getFormattedBigNumber(sortedClaimable.claimableBonus)} BONUS` : null,
        }))

        const {
            elevClaimable,
            elevClaimableBonus
        } = sortedClaimables.reduce((acc, sortedClaimable) => ({
            elevClaimable: acc.elevClaimable.plus(sortedClaimable.claimable),
            elevClaimableBonus: acc.elevClaimableBonus.plus(sortedClaimable.claimableBonus),
        }), { elevClaimable: BN_ZERO, elevClaimableBonus: BN_ZERO })

        return {
            winningsContributions,
            elevClaimable,
            elevClaimableBonus,
        }
    }
)
export const useElevationWinningsContributions = (elevation: Elevation) => useSelector((state) => selectElevationWinningsContributions(state, elevation))

const selectUserElevationClaimable = createSelector(
    stateToFarmsElevationData,
    (elevationData) => elevationData?.claimable || BN_ZERO
)
export const useUserElevationClaimable = (elevation: Elevation) => useSelector((state) => selectUserElevationClaimable(state, elevation))


const selectMultiElevWinningsContributions = createSelector(
    stateToFarmsElevationsData,
    (farmsElevData) => {
        const elevationsClaimable = elevationUtils.all
            .map((elevation) => ({
                elevation,
                claimable: (farmsElevData[elevationUtils.toInt(elevation)]?.claimable || BN_ZERO) as BigNumber,
                claimableBonus: (farmsElevData[elevationUtils.toInt(elevation)]?.claimableBonus || BN_ZERO) as BigNumber
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
    }
)


const selectElevationOrMultiElevWinningsContributions = createSelector(
    (_, elevations: Elevation[]) => elevations.length > 1,
    selectMultiElevWinningsContributions,
    (state, elevations: Elevation[]) => selectFarmsWithClaimable(state, elevations[0]),
    (multiElev, multiElevWinningsContributions, farmsWithClaimable) => {
        if (multiElev) {
            return ({
                contributions: multiElevWinningsContributions.claimableBreakdown,
                claimable: multiElevWinningsContributions.totalClaimable,
                claimableBonus: multiElevWinningsContributions.totalClaimableBonus,
            })
        }

        const sortedClaimables = orderBy(
            farmsWithClaimable,
            (farmWithClaimable) => farmWithClaimable.claimable.toNumber(),
            'desc'
        )

        const contributionSum = sortedClaimables.reduce((acc, sortedClaimable) => acc.plus(sortedClaimable.claimable), BN_ZERO)

        const contributions = sortedClaimables.map((sortedClaimable, index) => ({
            token: true,
            title: sortedClaimable.symbol,
            key: index,
            perc: sortedClaimable.claimable.times(100).div(contributionSum).toNumber(),
            val: `${getFormattedBigNumber(sortedClaimable.claimable)} SUMMIT`,
            bonusVal: sortedClaimable.claimableBonus.isGreaterThan(0) ? `+${getFormattedBigNumber(sortedClaimable.claimableBonus)} BONUS` : null,
        }))

        const {
            claimable,
            claimableBonus
        } = sortedClaimables.reduce((acc, sortedClaimable) => ({
            claimable: acc.claimable.plus(sortedClaimable.claimable),
            claimableBonus: acc.claimableBonus.plus(sortedClaimable.claimableBonus),
        }), { claimable: BN_ZERO, claimableBonus: BN_ZERO })

        return {
            contributions,
            claimable,
            claimableBonus,
        }
    }
)
export const useElevationOrMultiElevWinningsContributions = (elevations: Elevation[]) => useSelector((state) => selectElevationOrMultiElevWinningsContributions(state, elevations))

const selectLifetimeSummitWinningsAndBonus = createSelector(
    stateToLifetimeSummitWinnings,
    stateToLifetimeSummitBonuses,
    selectMultiElevWinningsContributions,
    stateToGlacierTotalFrozenSummit,
    stateToSummitPrice,
    (lifetimeSummitWinnings, lifetimeSummitBonuses, { totalClaimable, totalClaimableBonus }, totalFrozen, summitPrice) => {
        const winnings = (lifetimeSummitWinnings || BN_ZERO).plus(totalClaimable || BN_ZERO)
        const bonuses = (lifetimeSummitBonuses || BN_ZERO).plus(totalClaimableBonus || BN_ZERO)
        const winningsUsd = winnings.div(new BigNumber(10).pow(18)).times(summitPrice).toFixed(2)
        const bonusesUsd = bonuses.div(new BigNumber(10).pow(18)).times(summitPrice).toFixed(2)
        
        return {
            lifetimeSummitWinnings: winnings,
            lifetimeSummitBonuses: bonuses,
            lifetimeSummitWinningsUsd: winningsUsd,
            lifetimeSummitBonusesUsd: bonusesUsd,
            pendingSummitWinnings: totalClaimable || BN_ZERO,
            frozenSummit: totalFrozen || BN_ZERO,
        }
    }
)
export const useLifetimeSummitWinningsAndBonus = () => useSelector(selectLifetimeSummitWinningsAndBonus)


const selectFarmsWithYield = createSelector(
    stateToFarms,
    (_, elevation: Elevation) => elevation,
    (farms, elevation) => farms
        .map((farm) => ({
            symbol: farm.symbol,
            yieldContributed: farm.elevations[elevation]?.yieldContributed || BN_ZERO
        }))
        .filter((farm) => farm.yieldContributed.isGreaterThan(0))
)
const selectElevationYieldBetContributions = createSelector(
    selectFarmsWithYield,
    (farmsWithYield) => {
        const sortedYields = orderBy(
            farmsWithYield,
            (farmWithYield) => farmWithYield.yieldContributed.toNumber(),
            'desc'
        )

        const yieldSum = sortedYields.reduce((acc, sortedYield) => acc.plus(sortedYield.yieldContributed), BN_ZERO)

        return sortedYields.map((sortedYield, index) => ({
            token: true,
            title: sortedYield.symbol,
            key: index,
            perc: sortedYield.yieldContributed.times(100).div(yieldSum).toNumber(),
            val: `${getFormattedBigNumber(sortedYield.yieldContributed)} SUMMIT`,
        }))
    }
)
export const useElevationYieldBetContributions = (elevation: Elevation) => useSelector((state) => selectElevationYieldBetContributions(state, elevation))

const selectUserElevationYieldInfo = createSelector(
    stateToFarmsElevationData,
    (elevationData) => ({
        yieldContributed: elevationData?.yieldContributed || BN_ZERO,
        potentialWinnings: elevationData?.potentialWinnings || BN_ZERO,
    })
)
export const useUserElevationYieldInfo = (elevation: Elevation) => useSelector((state) => selectUserElevationYieldInfo(state, elevation))

const selectFarmsUserDataLoaded = createSelector(
    stateToFarmsUserDataLoaded,
    (userDataLoaded) => userDataLoaded
)

export const useFarmsUserDataLoaded = () => useSelector(selectFarmsUserDataLoaded)




const selectElevationsRolledOverInfo = createSelector(
    stateToFarmsElevationsData,
    stateToExpeditionSummitWinnings,
    stateToExpeditionUsdcWinnings,
    (elevationData, expedSummitWinnings, expedUsdcWinnings) => {
        return elevationUtils.allWithExpedition.map((elev) => {
            if (elev === Elevation.EXPEDITION) return {
                summitWinnings: expedSummitWinnings,
                usdcWinnings: expedUsdcWinnings,
            }
            return {
                summitWinnings: elevationData[elevationUtils.toInt(elev)]?.claimable || BN_ZERO,
                usdcWinnings: BN_ZERO,
            }
        })
    }
)
export const useElevationsRolledOverInfo = () => useSelector(selectElevationsRolledOverInfo)




const selectFarmsWithStaked = createSelector(
    stateToFarms,
    stateToPricesPerToken,
    (_, elevation: Elevation | null) => elevation,
    (farms, pricesPerToken, elevation) => farms
        .map((farm) => {
            const tokenPrice = pricesPerToken != null && pricesPerToken[farm.symbol] ? pricesPerToken[farm.symbol] : new BigNumber(1)
            const stakedBalance = elevation == null ?
                sumBigNumbersByKey(Object.values(farm.elevations), 'stakedBalance') :
                farm.elevations[elevation]?.stakedBalance
            if (stakedBalance == null || stakedBalance.isEqualTo(0)) return null
            return {
                symbol: farm.symbol,
                stakedUsd: parseFloat(stakedBalance.div(new BigNumber(10).pow(farm.decimals)).times(tokenPrice).toFixed(2)),
            }
        })
        .filter((farm) => farm != null)
)
const selectElevationStakedContributions = createSelector(
    selectFarmsWithStaked,
    (farmsWithStaked) => {
        const sortedStakeds = orderBy(
            farmsWithStaked,
            (farmWithStaked) => farmWithStaked.stakedUsd,
            'desc'
        )

        const stakedSum = sortedStakeds.reduce((acc, sortedYield) => acc + sortedYield.stakedUsd, 0)

        return sortedStakeds.map((sortedYield, index) => {
            return {
                token: true,
                title: sortedYield.symbol,
                key: index,
                perc: sortedYield.stakedUsd * 100 / stakedSum,
                val: `$${sortedYield.stakedUsd} (${(sortedYield.stakedUsd * 100 / stakedSum).toFixed(1)}%)`,
            }
        })
    }
)
export const useElevationStakedContributions = (elevation?: Elevation) => useSelector((state) => selectElevationStakedContributions(state, elevation))

