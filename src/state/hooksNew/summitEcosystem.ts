import { createSelector } from "@reduxjs/toolkit";
import { BN_ZERO, elevationUtils } from "config/constants";
import { stateToElevationRolloversToShow, stateToFarmsUserDataLoaded, stateToFarmsElevationsData, stateToForceOpenConnectModal } from "./base";
import { useSelector } from "./utils";


export const useForceOpenConnectModal = () => useSelector(stateToForceOpenConnectModal)

const selectClaimableElevations = createSelector(
    stateToFarmsElevationsData,
    (elevationsData) => {
        return elevationsData
            .map((data, elevIndex) => (data.claimable || BN_ZERO).isGreaterThan(0) ? elevationUtils.fromInt(elevIndex) : null)
            .filter((elev) => elev != null)
    }
)
const selectElevationRolloversToShow = createSelector(
    stateToElevationRolloversToShow,
    stateToFarmsUserDataLoaded,
    selectClaimableElevations,
    (elevationRolloversToShow, userDataLoaded, claimableElevations) => {
        if (!userDataLoaded) return []
        return elevationRolloversToShow.filter((elev) => claimableElevations.includes(elev))
    }
)
export const useElevationRolloversToShow = () => useSelector(selectElevationRolloversToShow)
