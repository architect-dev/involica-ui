import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Flex, HighlightedText, MobileColumnFlex, Text, TokenSymbolImage } from 'uikit'
import { MobileRowFlex } from 'uikit/components/Box/Flex'
import { getEpochTimestamps, getFormattedBigNumber, timestampToDate } from 'utils'
import HarvestEpochButtons from './HarvestEpochButton'
import { makeSelectEpochByIndex, useSelector, useThawedEpochIndices } from 'state/hooksNew'

const MobileBreak = styled.br`
    display: default;
    ${({ theme }) => theme.mediaQueries.nav} {
        display: none;
    }
`

const Divider = styled.div`
    background-color: ${({ theme }) => theme.colors.text};
    height: 1px;
    width: calc(100% - 48px);
    opacity: 0.5;
`

export const StyledMobileColumnFlex = styled(MobileColumnFlex)`
    ${({ theme }) => theme.mediaQueries.nav} {
        width: calc(100% - 24px);
        justify-content: space-between;
    }
`

const ThawedEpoch: React.FC<{ epochIndex: number }> = ({ epochIndex }) => {
    const epochByIndexSelector = useMemo(makeSelectEpochByIndex, [])
    const epoch = useSelector((state) => epochByIndexSelector(state, epochIndex))
    
    const rawFrozen = getFormattedBigNumber(epoch.frozenSummit, 3)
    const { beginTimestamp, closeTimestamp } = getEpochTimestamps(epoch.index)
    const beginDate = timestampToDate(beginTimestamp)
    const closeDate = timestampToDate(closeTimestamp)
    return (
        <StyledMobileColumnFlex alignItems='center' justifyContent='center'>
            <Text bold monospace small textAlign='center'>
                EPOCH:{' '}
                <MobileBreak/>
                {beginDate} - {closeDate}
            </Text>
            <MobileColumnFlex alignItems='center' justifyContent='center' mt='12px' mb='12px'>
                <TokenSymbolImage symbol='ThawedSUMMIT' width={40} height={40} />
                <HighlightedText bold monospace fontSize='22px' ml='4px' mr='4px' lineHeight='22px'>{rawFrozen}</HighlightedText>
            </MobileColumnFlex>
            <HarvestEpochButtons epochIndex={epoch.index} width='160px' height='28px' />
        </StyledMobileColumnFlex>
    )
}

export const ThawedEpochsSection: React.FC = () => {
    const thawedEpochIndices = useThawedEpochIndices()
    if (thawedEpochIndices.length === 0) return null

    return (
        <>
            <Divider/>
            <Flex gap='24px' flexDirection='column' alignItems='center' justifyContent='center' width='100%'>
                <Text bold monospace>THAWED EPOCHS:</Text>
                <MobileRowFlex gap='24px' width='100%' flexWrap='wrap' alignItems='center' justifyContent='center'>
                    { thawedEpochIndices.map((thawedEpochIndex) =>
                        <ThawedEpoch
                            key={thawedEpochIndex}
                            epochIndex={thawedEpochIndex}
                        />
                    )}
                </MobileRowFlex>
            </Flex>
        </>
    )
}