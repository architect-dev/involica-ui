import React from 'react'
import styled from 'styled-components'
import { ElevationPuck, Flex, MobileColumnFlex, Text } from 'uikit'
import { CurrentEpochSection } from './CurrentEpochSection'
import { GlacierTotalSummitAmounts } from './GlacierTotalSummitAmounts'
import { ThawedEpochsSection } from './ThawedEpochsSection'

const EpochsCard = styled(Flex)`
    position: relative;
    z-index: 10;
    padding: 16px;
    padding-top: 112px;
    padding-bottom: 24px;
    margin-top: 64px;
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
    box-shadow: ${({ theme }) => `1px 1px 3px ${theme.colors.textShadow}`};
    width: 100%;
    height: 100%;
    gap: 24px;
    align-items: center;
    flex-direction: column;
`

const EpochsHeaderCard: React.FC = () => {
    return (
        <EpochsCard>
            <ElevationPuck elevation='GLACIER'>
                <Text bold fontSize='24px' color='white'>
                    <Text fontSize='16px' color='white'>THE</Text>
                    GLACIER
                </Text>
            </ElevationPuck>
            <GlacierTotalSummitAmounts/>
            <ThawedEpochsSection/>
            <MobileColumnFlex gap='24px' mt='12px' mb='16px' width='100%' alignItems='center'>
                <Flex flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
                    <Text monospace small textAlign='center'>
                        The GLACIER holds your frozen SUMMIT winnings from
                        all elevation farms. All SUMMIT frozen during
                        an Epoch thaws 4 weeks later.
                        <br/>
                        <br/>
                        <br/>
                        <Text bold monospace small>SUMMIT in the Glacier can either be:</Text>
                        - Harvested after Epoch has Thawed for no tax
                        <br/>
                        - Harvested while frozen for a 50% tax
                        <br/>
                        (50% burned, 50% to EVEREST holders)
                        <br/>
                        - Locked for EVEREST at any time without tax
                        <br/>(requires lock duration {`>`}= 30 days)
                    </Text>
                </Flex>
                <CurrentEpochSection/>
            </MobileColumnFlex>
        </EpochsCard>
    )
}

export default React.memo(EpochsHeaderCard)