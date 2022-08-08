import React, { useMemo, useCallback } from 'react'
import { useHarvestEpoch } from 'hooks/useHarvestEpoch'
import { makeSelectEpochByIndex, useSelector } from 'state/hooksNew'
import { useModal, SummitButton, Flex } from 'uikit'
import HarvestEpochModal from '../../../uikit/widgets/Modals/HarvestEpochModal'
import { SummitPalette } from 'config/constants'

interface Props {
    epochIndex: number
    width?: string
    height?: string
}

const HarvestEpochButtons: React.FC<Props> = ({ epochIndex, width = '160px', height }) => {
    const epochByIndexSelector = useMemo(makeSelectEpochByIndex, [])
    const epoch = useSelector((state) => epochByIndexSelector(state, epochIndex))
    
    const nothingToHarvest = epoch.frozenSummit.isEqualTo(0)
    const { onHarvestEpoch, harvestEpochPending } = useHarvestEpoch(epochIndex)
    const [onPresentHarvestEpoch] = useModal(
        <HarvestEpochModal
            epoch={epoch}
            onHarvestEpoch={onHarvestEpoch}
        />
    )
    const handlePresentHarvestEpoch = useCallback(() => {
        if (harvestEpochPending || nothingToHarvest) return
        onPresentHarvestEpoch({
            lockForEverest: false
        })
    }, [harvestEpochPending, nothingToHarvest, onPresentHarvestEpoch])
    const handlePresentLockEpochForEverest = useCallback(() => {
        if (harvestEpochPending || nothingToHarvest) return
        onPresentHarvestEpoch({
            lockForEverest: true
        })
    }, [harvestEpochPending, nothingToHarvest, onPresentHarvestEpoch])

    return (
        <Flex alignItems='center' justifyContent='center' gap='12px'>
            <SummitButton
                isLoading={harvestEpochPending}
                disabled={nothingToHarvest}
                width={width}
                padding='0px'
                summitPalette={SummitPalette.EVEREST}
                height={height}
                onClick={handlePresentLockEpochForEverest}
            >
                LOCK FOR EVEREST
            </SummitButton>
            <SummitButton
                isLoading={harvestEpochPending}
                disabled={nothingToHarvest}
                width={width}
                padding='0px'
                height={height}
                onClick={handlePresentHarvestEpoch}
            >
                HARVEST EPOCH
            </SummitButton>
        </Flex>
    )
}

export default React.memo(HarvestEpochButtons, (prev, next) => prev.epochIndex === next.epochIndex)