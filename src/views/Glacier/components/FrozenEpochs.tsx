import React, { useMemo } from 'react'
import { makeSelectEpochByIndex, useFrozenEpochIndices, useSelector } from 'state/hooksNew'
import styled from 'styled-components'
import { Flex, HighlightedText, Text, TokenSymbolImage } from 'uikit'
import { getEpochTimestamps, getBalanceNumber, timestampToDate } from 'utils'
import CardValue from 'views/Home/components/CardValue'
import EpochProgressBar from './EpochProgressBar'
import HarvestEpochButtons from './HarvestEpochButton'

const MobileBreak = styled.br`
    display: default;
    ${({ theme }) => theme.mediaQueries.nav} {
        display: none;
    }
`

export const FrozenEpochCard = styled(Flex)`
    position: relative;
    flex-direction: column;
    background: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
    padding: 18px;
    flex: 1;
    box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
    max-width: 401px;
`

const FrozenEpoch: React.FC<{ epochIndex: number }> = ({ epochIndex }) => {
    const epochByIndexSelector = useMemo(makeSelectEpochByIndex, [])
    const epoch = useSelector((state) => epochByIndexSelector(state, epochIndex))
    
    const rawFrozen = getBalanceNumber(epoch.frozenSummit)
    const { beginTimestamp, closeTimestamp, thawTimestamp } = getEpochTimestamps(epoch.index)
    const beginDate = timestampToDate(beginTimestamp)
    const closeDate = timestampToDate(closeTimestamp)
    const thawDate = timestampToDate(thawTimestamp)
    return (
        <FrozenEpochCard gap='24px' alignItems='center' justifyContent='center'>
            <Text bold monospace small textAlign='center'>
                EPOCH:{' '}
                <MobileBreak/>
                {beginDate} - {closeDate}
            </Text>


            <Text monospace small italic textAlign='center' mb='-24px'>
                SUMMIT THAWS IN:
            </Text>


            <EpochProgressBar
                epoch={epoch.index}
            />
            <Flex gap='24px' alignItems='center' justifyContent='space-around' width='100%' maxWidth='450px'>
                <Flex flexDirection='column' justifyContent='center' alignItems='center'>
                    <Text bold monospace small>SUMMIT FROZEN:</Text>
                    <Flex gap='6px' ml='-6px' alignItems='center' justifyContent='center'>
                        <TokenSymbolImage symbol='FrozenSUMMIT' width={40} height={40} />
                        <CardValue
                            value={rawFrozen}
                            decimals={3}
                            fontSize="20"
                        />
                    </Flex>
                </Flex>
                <Flex flexDirection='column' justifyContent='center' alignItems='center'>
                    <Text bold monospace small>THAW DATE:</Text>
                    <HighlightedText bold monospace header fontSize='20' lineHeight='40px'>
                        {thawDate}
                    </HighlightedText>
                </Flex>
            </Flex>
            <HarvestEpochButtons epochIndex={epoch.index} width='160px' height='28px' />
        </FrozenEpochCard>
    )
}

export const FrozenEpochs: React.FC = () => {
    const frozenEpochIndices = useFrozenEpochIndices()
    if (frozenEpochIndices.length === 0) return null

    return (
        <Flex gap='24px' flexDirection='column' alignItems='center' justifyContent='center' width='100%'>
            <Text bold monospace>FROZEN EPOCHS:</Text>
            <Flex gap='24px' width='100%' flexWrap='wrap' alignItems='center' justifyContent='center'>
                { frozenEpochIndices.map((frozenEpochIndex) =>
                    <FrozenEpoch
                        key={frozenEpochIndex}
                        epochIndex={frozenEpochIndex}
                    />
                )}
            </Flex>
        </Flex>
    )
}