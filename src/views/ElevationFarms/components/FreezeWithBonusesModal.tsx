/* eslint-disable react/no-array-index-key */
import { Elevation, elevationUtils, SummitPalette } from 'config/constants/types'
import React, { useCallback } from 'react'
import { getFormattedBigNumber } from 'utils'
import styled from 'styled-components'
import { Flex, Modal, ModalActions, HighlightedText, Text, SummitButton, TokenSymbolImage } from 'uikit'
import { useElevationOrMultiElevWinningsContributions } from 'state/hooksNew'

const NoTextShadowFlex = styled(Flex)`
    gap: 12px;
    width: 100;
    align-items: center;
    justify-content: center;
    margin-top: -24px;
    
    > * {
        text-shadow: none !important;
    }
`

interface Props {
    elevations: Elevation[]
    onFreezeWinnings: (elevations: Elevation[]) => void
    onDismiss?: () => void
}

interface BonusRowProps {
    title?: string
    bonusVal?: string
}

export const FarmBonusWinningsRow: React.FC<BonusRowProps> = React.memo(({ title, bonusVal }) => {
    if (bonusVal == null) return null
    return (
        <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%' mb='8px'>
            <Flex alignItems='center' justifyContent='center' gap='6px'>
                <TokenSymbolImage symbol={title} width={36} height={36} />
                <Text monospace bold gold small textAlign='left'>{title} FARM:</Text>
            </Flex>
            <Text bold gold monospace textAlign='right'>{bonusVal.replace('+', '').replace('BONUS', 'SUMMIT')}</Text>
        </Flex>
    )
})

export const FreezeWithBonusesModal: React.FC<Props> = ({
    elevations,
    onFreezeWinnings,
    onDismiss,
}) => {

    const earningsOrWinnings = elevationUtils.winningsOrEarnings(elevations[0]).toUpperCase()

    const {
        contributions,
        claimable,
        claimableBonus,
    } = useElevationOrMultiElevWinningsContributions(elevations)


    const handleFreezeWinnings = useCallback(() => {
        onFreezeWinnings(elevations)
        onDismiss()
    }, [onFreezeWinnings, elevations, onDismiss])

    const titleText = elevations.length === 1 ?
        `FREEZE YOUR ${elevations[0]} ${earningsOrWinnings}` :
        `THE BIG FREEZE - FREEZE ALL ELEVATIONS`
    const summitPalette = elevations.length === 1 ?
        elevations[0] as unknown as SummitPalette :
        SummitPalette.BASE
    const buttonText = elevations.length === 1 ?
        `FREEZE ${earningsOrWinnings}` :
        'FREEZE ALL ELEVATIONS'



    return (
        <Modal title="FREEzE|br|WINNINGS" onDismiss={onDismiss} headerless elevationCircleHeader={summitPalette}>
            <Flex width='100%' flexDirection='column' alignItems='center' justifyContent='center' gap='18px' mb='18px'>
                <Text bold monospace textAlign='center'>{titleText}:</Text>
                { elevations.map((elevation) => (
                    <>
                        <Flex key={elevation} gap='12px' width='100%' alignItems='center' justifyContent='center'>
                            { elevations.length > 1 && <HighlightedText summitPalette={elevation} small>{elevation}:</HighlightedText> }
                            <HighlightedText summitPalette={elevation} fontSize='24px'>{getFormattedBigNumber(claimable)}</HighlightedText>
                            <HighlightedText summitPalette={elevation} fontSize='16px'>SUMMIT</HighlightedText>
                        </Flex>
                        <NoTextShadowFlex>
                            <HighlightedText gold fontSize='18px'>+ {getFormattedBigNumber(claimableBonus)}</HighlightedText>
                            <HighlightedText gold fontSize='14px'>BONUS</HighlightedText>
                        </NoTextShadowFlex>
                    </>
                ))}


                { elevations.length === 1 &&
                    <>
                        <Text bold monospace textAlign='center'>LOYALTY BONUS BREAKDOWN:</Text>
                        <Flex width='100%' flexDirection='column' alignItems='center' justifyContent='center' pl='24px' pr='24px'>
                            {contributions.map((contrib) =>
                                <FarmBonusWinningsRow
                                    key={contrib.key}
                                    title={contrib.title}
                                    bonusVal={contrib.bonusVal}
                                />
                            )}
                        </Flex>
                    </>
                }
                
                <ModalActions>
                    <SummitButton secondary onClick={onDismiss}>
                        CANCEL
                    </SummitButton>
                    <SummitButton
                        summitPalette={summitPalette}
                        onClick={handleFreezeWinnings}
                        width='200px'
                        padding='0px'
                        freezeSummitButton
                    >
                        {buttonText}
                    </SummitButton>
                </ModalActions>
            </Flex>
        </Modal>
    )
}
