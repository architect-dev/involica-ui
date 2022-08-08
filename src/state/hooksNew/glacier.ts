import { createSelector } from '@reduxjs/toolkit'
import { BN_ZERO } from 'config/constants'
import { Epoch } from 'state/types'
import { stateToEpochs, stateToCurrentEpochIndex, stateToGlacierTotalFrozenSummit, stateToGlacierTotalThawedSummit } from './base'
import { useSelector } from './utils'

export const makeSelectEpochByIndex = () => createSelector(
    stateToEpochs,
    (_, epochIndex) => epochIndex,
    (epochs, epochIndex): Epoch => epochs.find((epoch) => epoch.index === epochIndex) || {
        index: epochIndex,
        frozenSummit: BN_ZERO,
        isThawed: false,
    }
)

const selectCurrentEpoch = createSelector(
    stateToEpochs,
    stateToCurrentEpochIndex,
    (epochs, currentEpochIndex): Epoch => epochs?.find((epoch) => epoch.index === currentEpochIndex) || {
        index: currentEpochIndex,
        frozenSummit: BN_ZERO,
        isThawed: false,
    }
)
export const useCurrentEpoch = () => useSelector(selectCurrentEpoch)

const selectThawedEpochIndices = createSelector(
    stateToEpochs,
    (epochs): number[] => (epochs || [])
        .filter((epoch) => epoch.isThawed)
        .map((epoch) => epoch.index)
)
export const useThawedEpochIndices = () => useSelector(selectThawedEpochIndices)

const selectFrozenEpochIndices = createSelector(
    stateToEpochs,
    stateToCurrentEpochIndex,
    (epochs, currentEpochIndex): number[] => (epochs || [])
        .filter((epoch) => !epoch.isThawed && epoch.index !== currentEpochIndex)
        .map((epoch) => epoch.index)
)
export const useFrozenEpochIndices = () => useSelector(selectFrozenEpochIndices)

export const useGlacierTotalFrozenSummit = () => useSelector(stateToGlacierTotalFrozenSummit)
export const useGlacierTotalThawedSummit = () => useSelector(stateToGlacierTotalThawedSummit)

