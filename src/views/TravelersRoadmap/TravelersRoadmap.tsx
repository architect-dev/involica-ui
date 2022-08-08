import React from 'react'
import styled from 'styled-components'
import { Flex, MobileColumnFlex, Text } from 'uikit'
import {RoadmapTotemRow, RoadmapExpedition} from './components/RoadmapTotemRow'
import RoadmapEverest from './components/RoadmapEverest'
import MultiElevWinningsAndClaim from 'views/ElevationFarms/components/MultiElevWinningsAndClaim'
import PortfolioStakedBreakdown from 'views/ElevationFarms/components/PortfolioStakedBreakdown'
import { textGold } from 'theme/colors'


const Card = styled(Flex)<{ dark?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme, dark }) => dark ? '#121421' : theme.colors.background};
    border-radius: 4px;
    width: 100%;
    flex: 1;
    max-width: 850px;
    padding: 10px 18px 24px 18px;
`

const DeityText = styled(Text)`
    z-index: 4;
    position: relative;
    text-shadow: 1px 1px 2px ${textGold};
    color: white;
`

const RoadmapWrapper = styled.div`
    min-height: calc(100vh - 90px);
    padding-left: 8px;
    padding-right: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    gap: 36px;
    padding-top: 48px;
    padding-bottom: 128px;
`

const TravelersRoadmap: React.FC = () => {
    return (
        <RoadmapWrapper>
            <Card>
                <Text bold monospace style={{ width: '100%' }} textAlign='left'>TOTEMS:</Text>
                <RoadmapTotemRow />
            </Card>
            <Card gap='36px'>
                <Text bold monospace style={{ width: '100%' }} textAlign='left'>FARMING:</Text>
                <PortfolioStakedBreakdown/>
                <MultiElevWinningsAndClaim/>
            </Card>
            <MobileColumnFlex flexWrap='wrap' width='100%' maxWidth='850px' gap='36px' justifyContent='space-between' alignItems='flex-start'>
                <Card dark>
                    <DeityText bold monospace textAlign='left' style={{ width: '100%', zIndex: 3 }}>THE EXPEDITION:</DeityText>
                    <RoadmapExpedition />
                </Card>
                <Card>
                    <Text bold monospace style={{ width: '100%' }} textAlign='left'>EVEREST:</Text>
                    <RoadmapEverest />
                </Card>
            </MobileColumnFlex>
        </RoadmapWrapper>
    )
}

export default TravelersRoadmap
