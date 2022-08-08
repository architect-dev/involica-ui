import React from 'react'
import BigNumber from "bignumber.js"
import { transparentize } from "polished"
import styled from "styled-components"
import { Flex, SummitButton, Text, useModal } from "uikit"
import { getFormattedBigNumber, timestampToDateWithYear } from "utils"
import { useCurrentTimestamp } from 'state/hooks'
import { SummitPalette } from 'config/constants'
import { useUnlockSummit } from 'hooks/useUnlockSummit'
import UnlockSummitModal from './UnlockSummitModal'


interface ExistingLockedSummitProps {
    lockRelease: number
    summitLocked: BigNumber
}

const ExistingLockedSummitFlex = styled(Flex)`
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    border-radius: 16px;
    padding: 8px;
    border: ${({ theme }) => `1px solid ${transparentize(0.5, theme.colors.text)}`};
`

export const ExistingLockedSummit: React.FC<ExistingLockedSummitProps> = ({ lockRelease, summitLocked }) => {
    const rawSummitLocked = getFormattedBigNumber(summitLocked)
    const releaseDate = timestampToDateWithYear(lockRelease)
    const currentTimestamp = useCurrentTimestamp()
    const matured = currentTimestamp >= lockRelease

    const { pending, onUnlockSummit } = useUnlockSummit()

    const [onPresentUnlockSummitModal] = useModal(
        <UnlockSummitModal
            onUnlockSummit={onUnlockSummit}
        />,
    )

    return (
        <ExistingLockedSummitFlex flexDirection='column' alignItems='flex-start' justifyContent='center'>
            <Text bold monospace small>{rawSummitLocked} SUMMIT is locked until {releaseDate}.</Text>
            <Text monospace small>Any additional locked SUMMIT will also unlock on this date.</Text>
            { matured &&
                <SummitButton
                    summitPalette={ SummitPalette.EVEREST }
                    onClick={onPresentUnlockSummitModal}
                    disabled={pending}
                    padding='0px'
                    height='24px'
                    width='160px'
                    mt='8px'
                    ml='auto'
                    mr='auto'
                >
                    UNLOCK SUMMIT
                </SummitButton>
            }
        </ExistingLockedSummitFlex>
    )
}