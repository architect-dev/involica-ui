import BigNumber from "bignumber.js"
import { BN_ZERO, Elevation, elevationUtils, FarmConfig, TokenAssetType } from "config/constants/types"
import memoize from "fast-memoize"
import { Farm, FarmElevation, FarmType } from "state/types"

export const getFarmToken = ({
    assetType,
    tokenAddress,
    lpAddress
} : {
    assetType: TokenAssetType,
    tokenAddress?: string,
    lpAddress?: string,
}) => {
    switch (assetType) {
        case TokenAssetType.SolidlyLP:
        case TokenAssetType.CurveLP:
        case TokenAssetType.LP: return lpAddress
        case TokenAssetType.Summit:
        case TokenAssetType.Everest:
        case TokenAssetType.Stablecoin:
        case TokenAssetType.SingleAsset:
        case TokenAssetType.WrappedNative:
        case TokenAssetType.Balancer2Pool:
        case TokenAssetType.BalancerMultiPool:
        default: return tokenAddress
    }
}
export const getFarmType = ({
    assetType,
} : {
    assetType: TokenAssetType,
}) => {
    switch (assetType) {
        case TokenAssetType.SolidlyLP:
        case TokenAssetType.Balancer2Pool:
        case TokenAssetType.BalancerMultiPool:
        case TokenAssetType.LP: return FarmType.LP
        case TokenAssetType.Summit:
        case TokenAssetType.Stablecoin:
        case TokenAssetType.SingleAsset:
        case TokenAssetType.WrappedNative:
        default: return FarmType.Token
    }
}
export const getFarmInteracting = (farm: Farm) => {
    return Object.values(farm.elevations).reduce((interacting, farmElev: FarmElevation) => {
        if (interacting) return true
        if (farmElev == null) return false
        return (farmElev.stakedBalance || BN_ZERO)
            .plus(farmElev.claimable || BN_ZERO)
            .plus(farmElev.yieldContributed || BN_ZERO)
            .isGreaterThan(0)
    }, false)
}

export const getFarmAllElevationsIterable = memoize((farmConfigs: FarmConfig[]) => {
    return farmConfigs.map((farm) => {
        return Object.keys(farm.elevations)
            // .filter((elev) => elev === Elevation.MESA)
            .map((elevation) => ({
                symbol: farm.symbol,
                farmToken: farm.farmToken,
                elevation: elevation as Elevation,
            }))
    }).flat()
})
export const getFarmAllTokensIterable = memoize((farmConfigs: FarmConfig[]) => {
    return farmConfigs.map((farm) => farm.farmToken)
})
export const getFarmOnlyElevationsIterable = memoize((farmConfigs: FarmConfig[]) => {
    return farmConfigs.map((farm) => {
        return Object.keys(farm.elevations)
            .filter((elevation) => elevation !== Elevation.OASIS)
            .map((elevation) => ({
                symbol: farm.symbol,
                farmToken: farm.farmToken,
                elevation: elevation as Elevation,
            }))
    }).flat()
})

export const getFarmTotalStakedBalance = (elevations): BigNumber => {
    return elevationUtils.all.reduce((acc, elev) =>
        acc.plus(elevations[elev] || BN_ZERO),
        BN_ZERO
    )
}