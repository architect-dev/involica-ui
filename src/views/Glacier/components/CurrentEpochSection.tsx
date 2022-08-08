import React from 'react'
import { useCurrentEpoch } from 'state/hooksNew'
import { Flex, HighlightedText, MobileColumnFlex, Text, TokenSymbolImage } from 'uikit'
import { epochThawTimestamp, getBalanceNumber, timestampToDate } from 'utils'
import CardValue from 'views/Home/components/CardValue'
import EpochProgressBar from './EpochProgressBar'
import HarvestEpochButtons from './HarvestEpochButton'

export const CurrentEpochSection: React.FC = () => {
    const currentEpoch = useCurrentEpoch()
    const thawTimestamp = epochThawTimestamp(currentEpoch.index)
    const thawDate = timestampToDate(thawTimestamp)
    const rawFrozen = getBalanceNumber(currentEpoch.frozenSummit)

    return (
        <Flex gap='24px' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
            <Text bold monospace>CURRENT EPOCH:</Text>
            <EpochProgressBar
                epoch={currentEpoch.index}
                isCurrentEpoch
            />
            <MobileColumnFlex gap='24px' alignItems='center' justifyContent='space-between' width='100%' maxWidth='450px'>
                <Flex flexDirection='column' justifyContent='center' alignItems='center'>
                    <Text bold monospace small>EPOCH SUMMIT FROZEN:</Text>
                    <Flex gap='6px' ml='-6px' alignItems='center' justifyContent='center'>
                        <TokenSymbolImage symbol='FrozenSUMMIT' width={40} height={40} />
                        <CardValue
                            value={rawFrozen}
                            decimals={3}
                            fontSize="22"
                        />
                    </Flex>
                </Flex>
                <Flex flexDirection='column' justifyContent='center' alignItems='center'>
                    <Text bold monospace small>EPOCH THAW DATE:</Text>
                    <HighlightedText bold monospace header fontSize='22' lineHeight='40px'>
                        {thawDate}
                    </HighlightedText>
                </Flex>
            </MobileColumnFlex>
            <HarvestEpochButtons
                epochIndex={currentEpoch.index}
            />
        </Flex>
    )
}