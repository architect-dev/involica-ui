import React, { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { Elevation, SummitPalette } from 'config/constants/types'
import { useAllElevationsClaimable, useCurrentEpoch, useElevationInteractionsLocked, useElevationsWithInteractionsAvailable } from 'state/hooksNew'
import { useClaimElevation } from 'hooks/useClaim'
import DesktopVerticalDivider from 'uikit/components/DesktopVerticalDivider'
import SummitButton from 'uikit/components/Button/SummitButton'
import { HighlightedText, Text } from 'uikit/components/Text'
import { MobileColumnFlex, Flex } from 'uikit/components/Box'
import { getFormattedBigNumber } from 'utils'
import { Modal } from '../Modal'
import styled from 'styled-components'
import { HarvestEpochModalContent } from './HarvestEpochModal'
import { useHarvestEpoch } from 'hooks/useHarvestEpoch'


const NoTextShadowFlex = styled(Flex)`
    gap: 6px;
    width: 100;
    align-items: center;
    justify-content: center;
    margin-top: -22px;
    
    > * {
        text-shadow: none !important;
    }
`


interface TheBigFreezeProps {
    claimables: {
        elevation: Elevation,
        claimable: BigNumber,
        claimableBonus: BigNumber
    }[]
}

const TheBigFreezeButton: React.FC<TheBigFreezeProps> = React.memo(({ claimables }) => {
    const elevations = claimables.map((claimable) => claimable.elevation)
    const elevationsWithInteractionsAvailable = useElevationsWithInteractionsAvailable()
    const claimableAndInteractableElevations = elevations.filter((elev) => elevationsWithInteractionsAvailable[elev])

    const { onClaimElevation, claimPending } = useClaimElevation()

    const handlePresentFreezeElev = useCallback(() => {
        if (claimPending) return
        onClaimElevation(claimableAndInteractableElevations)
    }, [claimPending, onClaimElevation, claimableAndInteractableElevations])

    return (
        <Flex flexDirection='column' alignItems='center' justifyContent='center'>
            {claimableAndInteractableElevations.length === 0 &&
                <Text mt='24px' bold monospace color='red' italic small textAlign='center'>No Elevations with Freezable Winnings</Text>
            }
            <SummitButton
                isLocked={claimableAndInteractableElevations.length === 0}
                isLoading={claimPending}
                width='200px'
                style={{ padding: '0px' }}
                freezeSummitButton
                summitPalette={SummitPalette.GOLD}
                onClick={handlePresentFreezeElev}
            >
                THE BIG FREEZE
            </SummitButton>
        </Flex>
    )
})

interface ElevProps {
    elevation: Elevation
    claimable: BigNumber
}

const ElevClaim: React.FC<ElevProps> = React.memo(({ elevation, claimable }) => {
    const elevationLocked = useElevationInteractionsLocked(elevation)

    const { onClaimElevation, claimPending } = useClaimElevation()
    const nothingToClaim = !claimable || claimable.isEqualTo(0)

    const handlePresentFreezeElev = useCallback(() => {
        if (claimPending || elevationLocked || nothingToClaim) return
        onClaimElevation([elevation])
    }, [claimPending, elevationLocked, nothingToClaim, onClaimElevation, elevation])

    return (
        <Flex flexDirection='column' alignItems='center' justifyContent='center'>
            <SummitButton
                summitPalette={elevation}
                isLocked={elevationLocked}
                isLoading={claimPending}
                disabled={nothingToClaim}
                width='160px'
                height='28px'
                style={{ padding: '0px' }}
                onClick={handlePresentFreezeElev}
            >
                {elevation}
            </SummitButton>
            {elevationLocked &&
                <Text mt='6px' bold monospace color='red' italic small textAlign='center'>
                    Locked until
                    <br/>
                    Rollover
                </Text>
            }
        </Flex>
    )
})


interface Props {
    onDismiss?: () => void
}

const ManageWinningsModal: React.FC<Props> = ({
    onDismiss = () => null,
}) => {
    const elevationsClaimable = useAllElevationsClaimable()
    const currentEpoch = useCurrentEpoch()
    const { onHarvestEpoch, harvestEpochPending } = useHarvestEpoch(currentEpoch.index)

    return (
        <Modal
            title='WINNINGS:'
            onDismiss={onDismiss}
            elevationCircleHeader='GLACIER'
            headerless
        >
            <MobileColumnFlex gap='24px'>
                <Flex mb='24px' flex='1' maxWidth='360px' flexDirection='column' alignItems='center' justifyContent='flex-start' gap='32px'>
                    <Text bold monospace mb='-18px'>FREEZE ALL ELEVATIONS:</Text>
                    { elevationsClaimable.length > 0 ?
                        <TheBigFreezeButton claimables={elevationsClaimable}/> :
                        <Text bold monospace>No Winnings to Freeze</Text> 
                    }
                    <Flex flexDirection='column' alignItems='center' justifyContent='center' gap='14px'>
                        { elevationsClaimable.map(({ elevation, claimable, claimableBonus }) => (
                            <>
                                <Flex key={elevation} gap='6px' width='100%' alignItems='center' justifyContent='center'>
                                    <HighlightedText summitPalette={elevation} fontSize='14px'>{elevation}:</HighlightedText>
                                    <HighlightedText summitPalette={elevation} fontSize='18px'>{getFormattedBigNumber(claimable)}</HighlightedText>
                                    <HighlightedText summitPalette={elevation} fontSize='12px'>SUMMIT</HighlightedText>
                                </Flex>
                                <NoTextShadowFlex>
                                    <HighlightedText gold fontSize='14px'>+ {getFormattedBigNumber(claimableBonus)}</HighlightedText>
                                    <HighlightedText gold fontSize='12px'>BONUS</HighlightedText>
                                </NoTextShadowFlex>
                            </>
                        ))}
                    </Flex>
                    <Text bold monospace mb='-18px'>FREEZE ELEVs INDIVIDUALLY:</Text>
                    <Flex flexWrap='wrap' gap='18px' alignItems='center' justifyContent='center'>
                        { elevationsClaimable.map(({ elevation, claimable }) =>
                            <ElevClaim elevation={elevation} claimable={claimable}/>
                        )}
                    </Flex>
                </Flex>
                <DesktopVerticalDivider/>
                <Flex flex='1' maxWidth='360px' flexDirection='column' alignItems='center' justifyContent='flex-start' gap='32px'>
                    <Text bold monospace mb='-18px' textAlign='center'>
                        LOCK FROZEN WINNINGS
                        <br/>
                        FOR EVEREST:
                    </Text>
                    <HarvestEpochModalContent
                        asComponentOfWinningsModal
                        lockForEverest
                        epoch={currentEpoch}
                        onHarvestEpoch={onHarvestEpoch}
                        harvestEpochPending={harvestEpochPending}
                        onDismiss={onDismiss}
                    />
                </Flex>
            </MobileColumnFlex>
        </Modal>
    )
}

export default ManageWinningsModal
