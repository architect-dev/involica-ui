import BigNumber from "bignumber.js";
import { BN_ZERO, Elevation, elevationUtils } from "config/constants";
import { State } from "state/types";

// EXPEDITION
export const stateToExpeditionLoaded = (state: State) => state.expedition.expeditionLoaded
export const stateToExpeditionUserDataLoaded = (state: State) => state.expedition.userDataLoaded
export const stateToExpeditionInfo = (state: State) => state.expedition.data
export const stateToExpeditionUserData = (state: State) => state.expedition.userData
export const stateToEnteredExpedition = (state: State) => state.expedition.userData.entered
export const stateToExpeditionSummitRoundEmission = (state: State) => state.expedition?.data?.summit?.roundEmission || BN_ZERO
export const stateToExpeditionUsdcRoundEmission = (state: State) => state.expedition?.data?.usdc?.roundEmission || BN_ZERO
export const stateToExpeditionSummitEmissionsRemaining = (state: State) => state.expedition?.data?.summit?.emissionsRemaining || BN_ZERO
export const stateToExpeditionUsdcEmissionsRemaining = (state: State) => state.expedition?.data?.usdc?.emissionsRemaining || BN_ZERO
export const stateToExpeditionSummitDisbursed = (state: State) => state.expedition?.data?.summit?.distributed || BN_ZERO
export const stateToExpeditionUsdcDisbursed = (state: State) => state.expedition?.data?.usdc?.distributed || BN_ZERO
export const stateToExpeditionSafeSupply = (state: State) => state.expedition?.data?.safeEverest || BN_ZERO
export const stateToExpeditionDeitiedSupply = (state: State) => state.expedition?.data?.deitiedEverest || BN_ZERO
export const stateToExpeditionDeitySupplies = (state: State) => state.expedition?.data?.deityEverest || [BN_ZERO, BN_ZERO]
export const stateToExpeditionSummitWinnings = (state: State) => state.expedition?.userData?.summitWinnings || BN_ZERO
export const stateToExpeditionUsdcWinnings = (state: State) => state.expedition?.userData?.usdcWinnings || BN_ZERO
export const stateToExpeditionFaith = (state: State) => state.expedition.userData.faith
export const stateToExpeditionEverestOwned = (state: State) => state.expedition.userData.everestOwned

// GLACIER
export const stateToCurrentEpochIndex = (state: State) => state.glacier.currentEpochIndex
export const stateToEpochs = (state: State) => state.glacier.epochs
export const stateToGlacierTotalFrozenSummit = (state: State) => state.glacier.totalFrozenSummit
export const stateToGlacierTotalThawedSummit = (state: State) => state.glacier.totalThawedSummit

// TOTEM
export const stateToUserTotems = (state: State) => state.summitEcosystem.totems
export const stateToElevationUserTotem = (state: State, elevation: Elevation) => state.summitEcosystem.totems[elevationUtils.toInt(elevation)]
export const stateToExpeditionDeity = (state: State) => state.expedition.userData.deity
export const stateToWinningTotems = (state: State) => state.summitEcosystem.winningTotems
export const stateToWinningDeity = (state: State) => state.summitEcosystem.winningTotems[4]

// ECOSYSTEM
export const stateToDeityDivider = (state: State) => state.summitEcosystem.expeditionDivider
export const stateToTotemSelectionPending = (state: State) => state.summitEcosystem.pendingTotemSelection
export const stateToFarmTypeFilter = (state: State) => state.summitEcosystem.farmType
export const stateToFarmLiveFilter = (state: State) => state.summitEcosystem.liveFarms
export const stateToElevationInfo = (state: State, elevation: Elevation) => state.summitEcosystem.elevationsInfo[elevationUtils.elevationToElevationDataIndex(elevation)] || null
export const stateToElevationsInfos = (state: State) => state.summitEcosystem.elevationsInfo
export const stateToElevationRolloversToShow = (state: State) => state.summitEcosystem.elevationRolloversToShow
export const stateToExpeditionAPR = (state: State) => state.summitEcosystem.expeditionAPR
export const stateToTotemSelectionRounds = (state: State) => state.summitEcosystem.totemSelectionRounds
export const stateToDeitySelectionRound = (state: State) => state.summitEcosystem.totemSelectionRounds[elevationUtils.toInt(Elevation.EXPEDITION)] || null
export const stateToDebankExpeditionTreasury = (state: State) => state.summitEcosystem.expeditionPotTotalValue
export const stateToExpedTreasurySummitBalance = (state: State) => state.summitEcosystem.expeditionTreasurySummitBalance
export const stateToForceOpenConnectModal = (state: State) => state.summitEcosystem.forceOpenConnectModal

// FARMS
export const stateToFarmsElevationsData = (state: State) => state.farms.elevationData
export const stateToFarmsElevationData = (state: State, elevation: Elevation) => state.farms.elevationData[elevationUtils.toInt(elevation)]
export const stateToFarms = (state: State) => state.farms.data
export const stateToFarmsLoaded = (state: State) => state.farms.farmsLoaded
export const stateToFarmsUserDataLoaded = (state: State) => state.farms.userDataLoaded
export const stateToTokenInfos = (state: State) => state.tokens.data
export const stateToLifetimeSummitWinnings = (state: State) => state.farms.lifetimeSummitWinnings
export const stateToLifetimeSummitBonuses = (state: State) => state.farms.lifetimeSummitBonuses

// EVEREST
export const stateToEverestTotalSummitLocked = (state: State) => state.everest.totalSummitLocked
export const stateToEverestAverageLockDuration = (state: State) => state.everest.averageLockDuration
export const stateToEverestSupply = (state: State) => state.everest.everestSupply
export const stateToEverestUserData = (state: State) => state.everest.userData
export const stateToUserEverestOwned = (state: State) => state.everest.userData?.everestOwned || BN_ZERO
export const stateToUserSummitLocked = (state: State) => state.everest.userData?.summitLocked || BN_ZERO

// PRICES
export const stateToPricesPerToken = (state: State) => state.prices.pricesPerToken
export const stateToSummitPrice = (state: State) => state.prices.pricesPerToken?.SUMMIT || new BigNumber(15)

// TOKENS
export const stateToAvgStakingLoyaltyDuration = (state: State) => state.tokens.avgStakingLoyaltyDuration
